import React, { useState } from 'react';
import { Upload, X, Camera, User, FileText, Tag, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300`}>
            <Icon className="w-5 h-5" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

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
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

    // Default user image URL
    const DEFAULT_USER_IMAGE = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';

    const showToast = (message, type = 'info') => {
        setToast({ message, type, isVisible: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, 5000);
    };

    // Check if device is mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const generateAIContent = async (title, userContent = "") => {
        if (!title.trim()) {
            showToast("Please enter a title first to generate AI content!", 'error');
            return null;
        }

        const GEMINI_API_KEY = 'AIzaSyDREfqqyFDXWOtK5cynTLXOgS3f6m6XAJw';
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        let prompt;
        
        if (userContent.trim()) {
            prompt = `Please improve the following blog content by:
                1. Correcting any grammar, spelling, and punctuation errors
                2. Improving sentence structure and clarity
                3. Making it more engaging and readable
                4. Ensuring proper capitalization and formatting
                5. Adding transitions between ideas where needed
                6. Maintaining the original meaning and tone
                7. Formatting it with proper paragraphs separated by line breaks

                Original content:
                ${userContent}

                Please return only the improved content with proper paragraph formatting.`;
        } else {
            prompt = `Write a comprehensive and engaging blog post about: "${title}"

                Please create:
                1. An engaging introduction paragraph
                2. 3-4 main body paragraphs with detailed content
                3. A conclusion paragraph
                4. Each paragraph should be well-structured and informative
                5. Use proper grammar, spelling, and punctuation
                6. Make it engaging and readable for a general audience
                7. Separate each paragraph with a line break

                Write the content in a professional yet conversational tone. Do not include any titles or headings, just return the paragraph content separated by line breaks.`;
        }

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
                        temperature: 0.7,
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
                const generatedText = data.candidates[0].content.parts[0].text.trim();
                
                const formattedContent = generatedText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n\n');
                
                return formattedContent;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    };

    const handleAIGenerate = async () => {
        setIsGeneratingAI(true);
        try {
            const improvedContent = await generateAIContent(formData.Title, formData.Content);
            if (improvedContent) {
                setFormData(prevData => ({
                    ...prevData,
                    Content: improvedContent
                }));

                if (errors.Content) {
                    setErrors(prev => ({ ...prev, Content: "" }));
                }

                showToast(
                    formData.Content.trim() 
                        ? "Content improved successfully!" 
                        : "AI content generated successfully!", 
                    'success'
                );
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            showToast('AI content generation failed. Please try again.', 'error');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Enhanced file validation for mobile
    const validateFile = (file) => {
        // Check file size (max 10MB for mobile compatibility)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('File too large. Please select files under 10MB.', 'error');
            return false;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Please select a valid image file (JPEG, PNG, GIF, WebP).', 'error');
            return false;
        }

        return true;
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const validFiles = Array.from(files).filter(validateFile);
            
            if (validFiles.length === 0) {
                return;
            }

            const imagesArray = validFiles.map(file => ({
                url: URL.createObjectURL(file),
                alt: file.name,
                isPrimary: false,
                file: file
            }));
            
            setFormData(prevData => ({
                ...prevData,
                Images: [...prevData.Images, ...imagesArray].slice(0, 4)
            }));
            
            showToast(`${validFiles.length} image(s) uploaded successfully!`, 'success');
        }
        
        // Clear the input to allow re-selection of the same file
        event.target.value = '';
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
            if (validateFile(files[0])) {
                setFormData(prev => ({ ...prev, AuthorImage: files[0] }));
                showToast('Author image updated successfully!', 'success');
            }
        }
        // Clear the input
        e.target.value = '';
    };

    const removeImage = (indexToRemove) => {
        // Clean up URL objects to prevent memory leaks
        const imageToRemove = formData.Images[indexToRemove];
        if (imageToRemove && imageToRemove.url) {
            URL.revokeObjectURL(imageToRemove.url);
        }
        
        setFormData(prevData => ({
            ...prevData,
            Images: prevData.Images.filter((_, index) => index !== indexToRemove)
        }));
        showToast('Image removed successfully!', 'success');
    };

    const removeAuthorImage = () => {
        if (formData.AuthorImage) {
            URL.revokeObjectURL(URL.createObjectURL(formData.AuthorImage));
        }
        setFormData(prev => ({ ...prev, AuthorImage: null }));
        const fileInput = document.querySelector('input[name="AuthorImage"]');
        if (fileInput) fileInput.value = '';
        showToast('Author image removed successfully!', 'success');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Title.trim()) newErrors.Title = "Title is required";
        if (!formData.Topic.trim()) newErrors.Topic = "Topic/Category is required";
        if (!formData.Content.trim()) newErrors.Content = "Content is required";
        if (!formData.Author.trim()) newErrors.Author = "Author name is required";
        if (formData.Images.length === 0) newErrors.Images = "At least one blog image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadData = async (formDataToSend) => {
        try {
            console.log("Uploading data...");
            
            // Enhanced fetch options for mobile compatibility
            const response = await fetch('https://mern-intern-xi.vercel.app/api/blog/upload', {
                method: 'POST',
                body: formDataToSend,
                // Don't set Content-Type header - let browser set it with boundary for FormData
                // credentials: 'include', // Uncomment if your API requires credentials
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Data uploaded successfully:", data);
            showToast("Blog uploaded successfully!", 'success');
            
            // Clean up URL objects
            formData.Images.forEach(image => {
                if (image.url) {
                    URL.revokeObjectURL(image.url);
                }
            });
            
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
            showToast(`Error uploading blog: ${error.message}`, 'error');
        }
    };

    const urlToFile = async (url, filename = 'default-avatar.png') => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
            }
            const blob = await response.blob();
            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error('Error converting URL to file:', error);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showToast("Please fill in all required fields!", 'error');
            return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        
        // Append text fields
        formDataToSend.append('Title', formData.Title.trim());
        formDataToSend.append('Topic', formData.Topic.trim());
        formDataToSend.append('Content', formData.Content.trim());
        formDataToSend.append('Author', formData.Author.trim());

        // Handle author image
        if (formData.AuthorImage instanceof File) {
            formDataToSend.append('AuthorImage', formData.AuthorImage);
        } else {
            try {
                const defaultImageFile = await urlToFile(DEFAULT_USER_IMAGE, 'default-avatar.png');
                if (defaultImageFile) {
                    formDataToSend.append('AuthorImage', defaultImageFile);
                }
            } catch (error) {
                console.error('Error handling default image:', error);
            }
        }

        // Handle blog images
        formData.Images.forEach((imageObj, index) => {
            if (imageObj.file instanceof File) {
                formDataToSend.append('Images', imageObj.file);
            }
        });

        // Debug FormData contents (remove in production)
        console.log('FormData contents:');
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

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
            const validFiles = Array.from(files).filter(validateFile);
            
            if (validFiles.length === 0) {
                return;
            }

            const imagesArray = validFiles.map(file => ({
                url: URL.createObjectURL(file),
                alt: file.name,
                isPrimary: false,
                file: file
            }));
            
            setFormData(prevData => ({
                ...prevData,
                Images: [...prevData.Images, ...imagesArray].slice(0, 4)
            }));
            
            showToast(`${validFiles.length} image(s) uploaded successfully!`, 'success');
        }
    };

    return (
        <div className='min-h-screen mt-22 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-12 px-4 relative'>
            
            {/* Toast Notification */}
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.isVisible} 
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            
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
                    {isMobile() && (
                        <p className='text-sm text-yellow-400 mt-2'>📱 Mobile optimized for better upload experience</p>
                    )}
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="w-5 h-5 text-purple-400" />
                                <label className="text-lg font-semibold text-white">Blog Images</label>
                                <span className="text-sm text-gray-400">({formData.Images.length}/4)</span>
                                <span className="text-sm text-red-400">*Required</span>
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
                                        : errors.Images 
                                            ? 'border-red-400 bg-red-500/10'
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
                                        key={formData.Images.length} // Force re-render
                                    />
                                    <label htmlFor="imageUpload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-300 mb-2">
                                            <span className="font-semibold text-purple-400">Tap to select images</span>
                                            {!isMobile() && <span> or drag and drop</span>}
                                        </p>
                                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>
                            )}
                            {errors.Images && <p className="text-red-400 text-sm mt-1">{errors.Images}</p>}
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
                                    <label className="text-lg font-semibold text-white">Category</label>
                                </div>
                                <input
                                    type="text"
                                    name="Topic"
                                    placeholder="Enter any category (e.g., Technology, Travel, Food, etc.)"
                                    value={formData.Topic}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-900/50 text-white placeholder-gray-400 ${errors.Topic
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                />
                                {errors.Topic && <p className="text-red-400 text-sm mt-1">{errors.Topic}</p>}
                                <p className="text-xs text-gray-400 mt-1">
                                    💡 You can enter any category of your choice
                                </p>
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
                                    placeholder="Write your blog content here or leave empty and click 'Generate AI' to create content based on your title..."
                                    value={formData.Content}
                                    onChange={handleInputChange}
                                    rows={8}
                                    className={`w-full px-4 py-3 pb-16 rounded-xl border-2 transition-all outline-none resize-none bg-gray-900/50 text-white placeholder-gray-400 ${errors.Content
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-600/50 focus:border-purple-400'
                                        }`}
                                />

                                {/* AI Generate Button inside content box */}
                                <button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={isGeneratingAI || !formData.Title.trim()}
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
                                💡 Tip: Enter a title first, then either write content and improve it with AI, or leave it empty to generate completely new content based on your title!
                            </p>
                        </div>

                        {/* Author Image Section - Now Optional */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-purple-400" />
                                <label className="text-lg font-semibold text-white">Author Image</label>
                                <span className="text-sm text-gray-400">(Optional - Default image will be used if not provided)</span>
                            </div>
                            
                            {/* Preview of selected or default image */}
                            <div className="flex items-center gap-4 mb-3">
                                <div className="relative">
                                    <img
                                        src={formData.AuthorImage ? URL.createObjectURL(formData.AuthorImage) : DEFAULT_USER_IMAGE}
                                        alt="Author preview"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/50"
                                    />
                                    {formData.AuthorImage && (
                                        <button
                                            type="button"
                                            onClick={removeAuthorImage}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm text-gray-300">
                                    {formData.AuthorImage ? 'Custom image selected' : 'Using default user image'}
                                </div>
                            </div>

                            <input
                                type="file"
                                name="AuthorImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-600/50 focus:border-purple-400 transition-all outline-none bg-gray-900/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                💡 Leave empty to use the default user avatar
                            </p>
                        </div>

                        <button
                            type="submit"
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogUpload;