import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTopic, setActiveTopic] = useState('All');

    const topics = ['All', 'Technology', 'LifeStyle', 'Achievments', 'Food', 'Memories', 'Songs'];

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:2000/api/blog/get');
            const data = await response.json();

            const blogData = Array.isArray(data) ? data : data.getBlogs || [];

            setBlogs(blogData);
            setFilteredBlogs(blogData);
        } catch (err) {
            setError(`Failed to fetch blogs: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleTopicClick = (topic) => {
        setActiveTopic(topic);
        if (topic === 'All') {
            setFilteredBlogs(blogs);
        } else {
            setFilteredBlogs(blogs.filter(blog => blog.Topic === topic));
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading amazing blogs...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={fetchBlogs} 
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    if (filteredBlogs.length === 0) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No blogs found</h3>
                <p className="text-gray-600">No blogs available for "{activeTopic}" topic.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
            <Nav />
<div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
        
        {/* Floating orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      </div>
            
            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                        Discover Amazing
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                        Stories & Insights
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Explore our curated collection of blogs spanning technology, lifestyle, achievements, and more. 
                        Find inspiration in every story.
                    </p>
                </div>
            </div>

            {/* Topic Filter */}
            <div className="container mx-auto px-4 mb-16">
                <div className="flex flex-wrap justify-center gap-3">
                    {topics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handleTopicClick(topic)}
                            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                                activeTopic === topic
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map(blog => (
                        <div key={blog._id} className="group">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border border-gray-700/50 transform hover:-translate-y-2">
                                <Link to={`/blogs/${blog._id}`} className="block relative overflow-hidden">
                                    <img
                                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                                        src={blog.Image}
                                        alt={blog.Title}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=250&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-400/30">
                                            {blog.Topic}
                                        </span>
                                        <span className="text-sm text-gray-400 font-medium">
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    
                                    <Link to={`/blogs/${blog._id}`}>
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                                            {blog.Title}
                                        </h3>
                                    </Link>

                                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                                        {blog.Content}
                                    </p>
                                    
                                    <Link 
                                        to={`/blogs/${blog._id}`} 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
                                    >
                                        Read Article
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogs;