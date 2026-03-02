
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const blog = require('./router/Blog')
const User = require('./router/User')


mongoose.connect(process.env.MONGODB_URL).then((res)=> {
    console.log("MongoDB Connected..")
}).catch((error)=> {
    console.log("MongoDB Error",error)
})


app.use(cors())
app.use(bodyParser.json())

app.use('/api/blog',blog);
app.use('/api/blog',User);

// Proxy to Gemini API so the API key stays on the server (avoids 403 referrer restrictions)
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
app.post('/api/generate-content', async (req, res) => {
    try {
        const { title, content } = req.body || {};
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
        }
        const prompt = content && String(content).trim()
            ? `Please improve the following blog content by:
                1. Correcting any grammar, spelling, and punctuation errors
                2. Improving sentence structure and clarity
                3. Making it more engaging and readable
                4. Ensuring proper capitalization and formatting
                5. Adding transitions between ideas where needed
                6. Maintaining the original meaning and tone
                7. Formatting it with proper paragraphs separated by line breaks

                Original content:
                ${content}

                Please return only the improved content with proper paragraph formatting.`
            : `Write a comprehensive and engaging blog post about: "${title || ''}"

                Please create:
                1. An engaging introduction paragraph
                2. 3-4 main body paragraphs with detailed content
                3. A conclusion paragraph
                4. Each paragraph should be well-structured and informative
                5. Use proper grammar, spelling, and punctuation
                6. Make it engaging and readable for a general audience
                7. Separate each paragraph with a line break

                Write the content in a professional yet conversational tone. Do not include any titles or headings, just return the paragraph content separated by line breaks.`;

        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: `Gemini API error: ${response.status}`, details: errText });
        }

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const text = data.candidates[0].content.parts[0].text.trim();
            const formatted = text.split('\n').map(l => l.trim()).filter(Boolean).join('\n\n');
            return res.json({ content: formatted });
        }
        return res.status(500).json({ error: 'Invalid response format from Gemini API' });
    } catch (err) {
        console.error('Generate content error:', err);
        return res.status(500).json({ error: err.message || 'AI generation failed' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'API is running successfully!' });
});


module.exports = app;


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}