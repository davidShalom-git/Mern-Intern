import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Nav from './Nav';

const Details = () => {
    const [blogDetails, setBlogDetails] = useState(null);
    const { id } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBlogDetails = async () => {
        try {
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
        fetchBlogDetails();
        // eslint-disable-next-line
    }, [id]);

    const getImages = () => {
        if (blogDetails?.Images && blogDetails.Images.length > 0) {
            return blogDetails.Images;
        } else if (blogDetails?.Image) {
            return [{ url: blogDetails.Image, alt: blogDetails.Title }];
        }
        return [];
    };
    const images = getImages();

    return (
        <>
         <Nav />
            {/* Background Overlays, z-0 */}
            <div className="fixed z-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto mt-28 px-4 py-8 relative z-10 flex justify-center">
                {blogDetails ? (
                    <div
                        className="relative z-20 max-w-4xl w-full mx-auto bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 shadow-2xl shadow-purple-500/10 rounded-2xl p-8"
                        style={{
                            backdropFilter: "blur(10px)" // enhanced blur for glassmorphic effect
                        }}
                    >
                        {/* Header with Author Info */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">{blogDetails.Title}</h1>
                                <p className="text-sm text-purple-300">Topic: {blogDetails.Topic}</p>
                                <p className="text-sm text-gray-400 mt-1">Created: {new Date(blogDetails.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            {/* Author Section */}
                            <div className="flex items-center space-x-3 ml-6">
                                <div className="text-right">
                                    <p className="text-sm text-gray-300 font-medium">{blogDetails.Author}</p>
                                    <p className="text-xs text-gray-500">Author</p>
                                </div>
                                {blogDetails.AuthorImage && (
                                    <img
                                        src={blogDetails.AuthorImage}
                                        alt={blogDetails.Author || 'Author'}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50 shadow-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="mb-6">
                                <div className="relative mb-4">
                                    <img
                                        src={images[selectedImageIndex]?.url || images[selectedImageIndex]}
                                        alt={images[selectedImageIndex]?.alt || blogDetails.Title}
                                        className="w-full h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-600/50"
                                        onClick={() => openModal(selectedImageIndex)}
                                    />
                                    <button
                                        onClick={() => openModal(selectedImageIndex)}
                                        className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800/80 transition-all"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800/80 transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800/80 transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                        ? 'border-purple-400 ring-2 ring-purple-300/50'
                                                        : 'border-gray-600/50 hover:border-gray-500'
                                                    }`}
                                                onClick={() => handleImageClick(index)}
                                            >
                                                <img
                                                    src={img.url || img}
                                                    alt={img.alt || `${blogDetails.Title} ${index + 1}`}
                                                    className="w-full h-20 object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 leading-relaxed text-base">{blogDetails.Content}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-screen p-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-purple-300 z-10 bg-gray-900/50 backdrop-blur-sm rounded-full p-2 transition-all"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={images[selectedImageIndex]?.url || images[selectedImageIndex]}
                            alt={images[selectedImageIndex]?.alt || blogDetails.Title}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-purple-300 bg-gray-900/50 backdrop-blur-sm rounded-full p-2 transition-all"
                                >
                                    <ChevronLeft size={40} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-purple-300 bg-gray-900/50 backdrop-blur-sm rounded-full p-2 transition-all"
                                >
                                    <ChevronRight size={40} />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-900/70 backdrop-blur-sm px-4 py-2 rounded-full">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Details;