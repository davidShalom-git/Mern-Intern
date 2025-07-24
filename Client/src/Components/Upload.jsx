import React, { useState } from 'react';
import { Upload, X, Camera, User, FileText, Tag, Sparkles, Loader2 } from 'lucide-react';
import Nav from './Nav';

const BlogUpload = () => {
    const [formData, setFormData] = useState({
        Title: "",
        Topic: "",
        Content: "",
        Images: [],
        Author: "",
        AuthorImage: null
    });

    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateAIContent = async (userContent) => {
        if (!userContent.trim()) {
            return "Please write some content first, and I'll help you improve it!";
        }

        const GEMINI_API_KEY = 'AIzaSyDREfqqyFDXWOtK5cynTLXOgS3f6m6XAJw';
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        const prompt = `Please improve the following blog content by:
                    1. Correcting any grammar, spelling, and punctuation errors
                    2. Improving sentence structure and clarity
                    3. Making it more engaging and readable
                    4. Ensuring proper capitalization and formatting
                    5. Adding transitions between ideas where needed
                    6. Maintaining the original meaning and tone

            Original content:
            ${userContent}

            Please return only the improved content without any additional explanations or comments.`;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API Error:', error)
        }
    };

    const handleAIGenerate = async () => {
        setIsGeneratingAI(true);
        try {
            const improvedContent = await generateAIContent(formData.Content);
            setFormData(prevData => ({
                ...prevData,
                Content: improvedContent
            }));

            if (errors.Content) {
                setErrors(prev => ({ ...prev, Content: "" }));
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            alert('AI content generation failed. Please try again.');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const imagesArray = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                alt: file.name,
                isPrimary: false,
                file: file
            }));
            setFormData(prevData => ({
                ...prevData,
                Images: [...prevData.Images, ...imagesArray].slice(0, 4)
            }));
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'AuthorImage' && files[0]) {
            setFormData(prev => ({ ...prev, AuthorImage: files[0] }));
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prevData => ({
            ...prevData,
            Images: prevData.Images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Title.trim()) newErrors.Title = "Title is required";
        if (!formData.Topic.trim()) newErrors.Topic = "Topic is required";
        if (!formData.Content.trim()) newErrors.Content = "Content is required";
        if (!formData.Author.trim()) newErrors.Author = "Author name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadData = async (formDataToSend) => {
        try {
            console.log("Uploading data...");
            
            const response = await fetch('http://localhost:2000/api/blog/upload', {
                method: 'POST',
                body: formDataToSend
            });
            
            const data = await response.json();
            console.log("Data uploaded successfully:", data);
            alert("Blog uploaded successfully!");
            
            // Reset form after successful upload
            setFormData({
                Title: "",
                Topic: "",
                Content: "",
                Images: [],
                Author: "",
                AuthorImage: null
            });
            
        } catch (error) {
            console.error("Error uploading data:", error);
            alert("Error uploading blog. Please try again.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('Title', formData.Title);
        formDataToSend.append('Topic', formData.Topic);
        formDataToSend.append('Content', formData.Content);
        formDataToSend.append('Author', formData.Author);

        if (formData.AuthorImage instanceof File) {
            formDataToSend.append('AuthorImage', formData.AuthorImage);
        }

        formData.Images.forEach((imageObj) => {
            if (imageObj.file instanceof File) {
                formDataToSend.append('Images', imageObj.file);
            }
        });

        await uploadData(formDataToSend);
        setIsSubmitting(false);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = e.dataTransfer.files;
            const imagesArray = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                alt: file.name,
                isPrimary: false,
                file: file
            }));
            setFormData(prevData => ({
                ...prevData,
                Images: [...prevData.Images, ...imagesArray].slice(0, 4)
            }));
        }
    };

    return (
        <div className='min-h-screen mt-22 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-12 px-4 relative'>
            <Nav />
            {/* Animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>

            {/* Floating orbs */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h1 className='text-4xl font-bold text-white mb-3'>Create Your Blog</h1>
                    <p className='text-gray-400 text-lg'>Share your thoughts with the world</p>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    <div className="space-y-8">

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="w-5 h-5 text-purple-400" />
                                <label className="text-lg font-semibold text-white">Blog Images</label>
                                <span className="text-sm text-gray-400">({formData.Images.length}/4)</span>
                            </div>

                            {formData.Images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {formData.Images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-600/50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.Images.length < 4 && (
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                        ? 'border-purple-400 bg-purple-500/10'
                                        : 'border-gray-600/50 hover:border-purple-400/70 hover:bg-gray-800/30'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-300 mb-2">
                                            <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    <label className="text-lg font-semibold text-white">Title</label>
                                </div>
                                <input
                                    type="text"
                                    name="Title"
                                    placeholder="Enter your blog title"
                                    value={formData.Title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-900/50 text-white placeholder-gray-400 ${errors.Title
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                />
                                {errors.Title && <p className="text-red-400 text-sm mt-1">{errors.Title}</p>}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="w-5 h-5 text-purple-400" />
                                    <label className="text-lg font-semibold text-white">Topic</label>
                                </div>
                                <select
                                    name="Topic"
                                    value={formData.Topic}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-900/50 text-white ${errors.Topic
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                >
                                    <option value="" className="bg-gray-900">Select Topic</option>
                                    {['Technology', 'LifeStyle', 'Achievements', 'Food', 'Memories', 'Songs'].map((topic) => (
                                        <option key={topic} value={topic} className="bg-gray-900">{topic}</option>
                                    ))}
                                </select>
                                {errors.Topic && <p className="text-red-400 text-sm mt-1">{errors.Topic}</p>}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-5 h-5 text-purple-400" />
                                    <label className="text-lg font-semibold text-white">Author</label>
                                </div>
                                <input
                                    type="text"
                                    name="Author"
                                    placeholder="Your name"
                                    value={formData.Author}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-900/50 text-white placeholder-gray-400 ${errors.Author
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                />
                                {errors.Author && <p className="text-red-400 text-sm mt-1">{errors.Author}</p>}
                            </div>
                        </div>

                        {/* Content section with AI Generate button */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                <label className="text-lg font-semibold text-white">Content</label>
                            </div>
                            <div className="relative">
                                <textarea
                                    name="Content"
                                    placeholder="Write your blog content here..."
                                    value={formData.Content}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className={`w-full px-4 py-3 pb-16 rounded-xl border-2 transition-all outline-none resize-none bg-gray-900/50 text-white placeholder-gray-400 ${errors.Content
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                />

                                {/* AI Generate Button inside content box */}
                                <button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={isGeneratingAI}
                                    className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <div className="flex items-center gap-2">
                                        {isGeneratingAI ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        {isGeneratingAI ? 'Generating...' : 'Generate AI'}
                                    </div>
                                </button>
                            </div>
                            {errors.Content && <p className="text-red-400 text-sm mt-1">{errors.Content}</p>}
                            <p className="text-xs text-gray-400 mt-1">
                                💡 Tip: Write your content and click "Generate AI" to improve grammar, clarity, and structure!
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-purple-400" />
                                <label className="text-lg font-semibold text-white">Author Image</label>
                                <span className="text-sm text-gray-400">(Optional)</span>
                            </div>
                            <input
                                type="file"
                                name="AuthorImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-600/50 focus:border-purple-400 transition-all outline-none bg-gray-900/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Upload className="w-5 h-5" />
                                )}
                                {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogUpload;