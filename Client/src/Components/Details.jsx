import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Calendar, User, Tag } from 'lucide-react';

const Details = ({ blogId }) => {
    const [blogDetails, setBlogDetails] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get ID from props, URL parameters, or default for demo
    const getCurrentId = () => {
        // Try to get ID from props first
        if (blogId) return blogId;

        // Try to get from URL parameters if available
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const idFromUrl = urlParams.get('id');
            if (idFromUrl) return idFromUrl;

            // Try to get from URL path (e.g., /blog/123)
            const pathParts = window.location.pathname.split('/');
            const idFromPath = pathParts[pathParts.length - 1];
            if (idFromPath && idFromPath !== 'blog' && idFromPath !== '') return idFromPath;
        } catch (e) {
            console.log('URL parsing not available');
        }

        // Default ID for demo purposes
        return '674b5c7f4f5c123456789abc';
    };

    const id = getCurrentId();

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://mern-intern-xi.vercel.app/api/blog/get/${id}`);

            if (!response.ok) {
                throw new Error('Failed to Fetch Blog Details');
            }

            const data = await response.json();

            if (!data || !data.getSingleBlog) {
                throw new Error('Blog not found');
            }

            setBlogDetails(data.getSingleBlog);
        } catch (error) {
            console.error('Error fetching blog details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (index) => setSelectedImageIndex(index);
    const openModal = (index) => { setSelectedImageIndex(index); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);
    const nextImage = () => {
        if (blogDetails?.Images) {
            setSelectedImageIndex((prev) => (prev + 1) % blogDetails.Images.length);
        }
    };
    const prevImage = () => {
        if (blogDetails?.Images) {
            setSelectedImageIndex((prev) => (prev - 1 + blogDetails.Images.length) % blogDetails.Images.length);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBlogDetails();
        }
    }, [id]);

    const getImages = () => {
        if (blogDetails?.Images && blogDetails.Images.length > 0) {
            return blogDetails.Images;
        } else if (blogDetails?.Image) {
            return [{ url: blogDetails.Image, alt: blogDetails.Title }];
        }
        return [];
    };

    const formatContent = (content) => {
        if (!content) return [];
        // Split content by sentences and group them into paragraphs
        const sentences = content.split(/(?<=[.!?])\s+/);
        const paragraphs = [];

        for (let i = 0; i < sentences.length; i += 2) {
            const paragraph = sentences.slice(i, i + 2).join(' ').trim();
            if (paragraph.length > 0) {
                paragraphs.push(paragraph);
            }
        }

        return paragraphs;
    };

    const images = getImages();
    const paragraphs = formatContent(blogDetails?.Content);

    return (
        <>
            {/* Background Overlays */}
            <div className="fixed z-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto pt-20 px-4 py-8 relative z-10 flex justify-center min-h-screen">
                {loading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
                            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-500/20"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center min-h-screen text-center">
                        <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30 max-w-md">
                            <X size={48} className="text-red-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-red-300 mb-2">Error Loading Blog</h2>
                            <p className="text-red-200 mb-4">{error}</p>
                            <button
                                onClick={fetchBlogDetails}
                                className="bg-red-500/30 hover:bg-red-500/50 text-white px-6 py-2 rounded-lg transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : blogDetails ? (
                    <div className="relative z-20 max-w-5xl w-full mx-auto">
                        {/* Enhanced Header Section */}
                        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/20 rounded-3xl p-8 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4 leading-tight">
                                        {blogDetails.Title}
                                    </h1>

                                    {/* Meta Information */}
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-400/30">
                                            <Tag size={16} className="text-purple-300" />
                                            <span className="text-purple-200 text-sm font-medium">{blogDetails.Topic}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
                                            <Calendar size={16} className="text-blue-300" />
                                            <span className="text-blue-200 text-sm">{new Date(blogDetails.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Author Section */}
                                <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30">
                                    {blogDetails.AuthorImage && (
                                        <img
                                            src={blogDetails.AuthorImage}
                                            alt={blogDetails.Author || 'Author'}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/50 shadow-lg ring-2 ring-purple-300/20"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={16} className="text-gray-400" />
                                            <p className="text-white font-semibold">{blogDetails.Author}</p>
                                        </div>
                                        <p className="text-gray-400 text-sm">Author</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Image Gallery */}
                        {images.length > 0 && (
                            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/10 rounded-3xl p-8 mb-8">
                                <div className="relative mb-6">
                                    <div className="relative overflow-hidden rounded-2xl border border-gray-600/50 shadow-2xl">
                                        <img
                                            src={images[selectedImageIndex]?.url || images[selectedImageIndex]}
                                            alt={images[selectedImageIndex]?.alt || blogDetails.Title}
                                            className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-all duration-500"
                                            onClick={() => openModal(selectedImageIndex)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                        <button
                                            onClick={() => openModal(selectedImageIndex)}
                                            className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-gray-800/90 transition-all shadow-lg hover:scale-110"
                                        >
                                            <ZoomIn size={20} />
                                        </button>

                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-gray-800/90 transition-all shadow-lg hover:scale-110"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-gray-800/90 transition-all shadow-lg hover:scale-110"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {images.length > 1 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${selectedImageIndex === index
                                                    ? 'border-purple-400 ring-2 ring-purple-300/50 shadow-lg shadow-purple-500/25'
                                                    : 'border-gray-600/50 hover:border-gray-500'
                                                    }`}
                                                onClick={() => handleImageClick(index)}
                                            >
                                                <img
                                                    src={img.url || img}
                                                    alt={img.alt || `${blogDetails.Title} ${index + 1}`}
                                                    className="w-full h-24 object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Enhanced Content Section with Proper Paragraph Spacing */}
                        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/10 rounded-3xl p-8">
                            <div className="prose prose-invert max-w-none">
                                <div className="space-y-8"> {/* Moderate spacing like Word document */}
                                    {paragraphs.length > 0 ? (
                                        paragraphs.map((paragraph, index) => (
                                            <div
                                                key={index}
                                                className="group"
                                            >
                                                <p className="text-gray-200 leading-relaxed text-lg font-light tracking-wide first-letter:text-3xl first-letter:font-semibold first-letter:text-purple-300 first-letter:mr-1 first-letter:float-left first-letter:leading-[0.8] hover:text-white transition-colors duration-300 mb-6"> {/* Reduced mb to 6 for Word-like spacing */}
                                                    {paragraph.trim()}
                                                </p>
                                                {index < paragraphs.length - 1 && (
                                                    <div className="mt-4 mb-4 flex justify-center"> {/* Reduced margins for subtle separation */}
                                                        <div className="flex items-center gap-2"> {/* Reduced gap */}
                                                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-purple-400/30"></div> {/* Smaller, more subtle separator */}
                                                            <div className="w-1.5 h-1.5 bg-purple-400/30 rounded-full"></div> {/* Smaller dot */}
                                                            <div className="w-8 h-px bg-gradient-to-r from-purple-400/30 to-transparent"></div> {/* Smaller, more subtle separator */}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-200 leading-relaxed text-lg font-light tracking-wide first-letter:text-3xl first-letter:font-semibold first-letter:text-purple-300 first-letter:mr-1 first-letter:float-left first-letter:leading-[0.8]">
                                            {blogDetails.Content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center min-h-screen text-center">
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30 max-w-md">
                            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Tag size={32} className="text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-300 mb-2">No Blog Found</h2>
                            <p className="text-gray-400 mb-4">The requested blog post could not be found.</p>
                            <p className="text-sm text-gray-500">Blog ID: {id}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative max-w-6xl max-h-screen p-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-purple-300 z-10 bg-gray-900/70 backdrop-blur-sm rounded-xl p-3 transition-all hover:scale-110 shadow-lg"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={images[selectedImageIndex]?.url || images[selectedImageIndex]}
                            alt={images[selectedImageIndex]?.alt || blogDetails.Title}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-purple-300 bg-gray-900/70 backdrop-blur-sm rounded-xl p-3 transition-all hover:scale-110 shadow-lg"
                                >
                                    <ChevronLeft size={40} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-purple-300 bg-gray-900/70 backdrop-blur-sm rounded-xl p-3 transition-all hover:scale-110 shadow-lg"
                                >
                                    <ChevronRight size={40} />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-xl font-medium">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Details;