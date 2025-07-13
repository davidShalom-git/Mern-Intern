import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const Details = () => {
    const [blogDetails, setBlogDetails] = useState(null);
    const { id } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBlogDetails = async () => {
        try {
            const response = await fetch(`http://localhost:2000/api/blog/get/${id}`)
            if (!response.ok) {
                throw new Error('Failed to Fetch Blog Details')
            }

            const data = await response.json();
            console.log(data);
            if (!data || !data.getSingleBlog) {
                throw new Error('Blog not found');
            }

            setBlogDetails(data.getSingleBlog);
        } catch (error) {
            console.error('Error fetching blog details:', error);
        }
    }

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
    }, [id])

    // Handle both old single image format and new multiple images format
    const getImages = () => {
        if (blogDetails?.Images && blogDetails.Images.length > 0) {
            return blogDetails.Images;
        } else if (blogDetails?.Image) {
            // Backward compatibility - convert single image to array format
            return [{ url: blogDetails.Image, alt: blogDetails.Title }];
        }
        return [];
    };

    const images = getImages();

    return (
        <>
            <div className="container mx-auto mt-28 px-4 py-8">
                {blogDetails ? (
                    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-4">{blogDetails.Title}</h1>
                        <p className="text-gray-700 mb-6">{blogDetails.Content}</p>
                        
                        {/* Image Gallery */}
                        {images.length > 0 && (
                            <div className="mb-6">
                                {/* Main Image Display */}
                                <div className="relative mb-4">
                                    <img 
                                        src={images[selectedImageIndex]?.url || images[selectedImageIndex]} 
                                        alt={images[selectedImageIndex]?.alt || blogDetails.Title} 
                                        className="w-full h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openModal(selectedImageIndex)}
                                    />
                                    <button
                                        onClick={() => openModal(selectedImageIndex)}
                                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                    
                                    {/* Navigation arrows for main image */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImageIndex === index 
                                                        ? 'border-blue-500 ring-2 ring-blue-300' 
                                                        : 'border-gray-200 hover:border-gray-400'
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

                        <p className="mt-4 text-sm text-gray-500">Topic: {blogDetails.Topic}</p>
                        <p className="text-sm text-gray-400">Created: {new Date(blogDetails.createdAt).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Modal for fullscreen image view */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-screen p-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <X size={32} />
                        </button>
                        
                        <img
                            src={images[selectedImageIndex]?.url || images[selectedImageIndex]}
                            alt={images[selectedImageIndex]?.alt || blogDetails.Title}
                            className="max-w-full max-h-full object-contain"
                        />
                        
                        {/* Modal navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                                >
                                    <ChevronLeft size={40} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                                >
                                    <ChevronRight size={40} />
                                </button>
                            </>
                        )}
                        
                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Details;