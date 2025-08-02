import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Calendar, TrendingUp, ArrowUpDown } from 'lucide-react';
import Nav from './Nav';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTopic, setActiveTopic] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title, popular
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique topics from blogs dynamically
    const [availableTopics, setAvailableTopics] = useState(['All']);

    const sortOptions = [
        { value: 'newest', label: 'Most Recent', icon: Calendar },
        { value: 'oldest', label: 'Oldest First', icon: Calendar },
        { value: 'title', label: 'A-Z Title', icon: ArrowUpDown },
        { value: 'popular', label: 'Popular', icon: TrendingUp }
    ];

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://mern-intern-xi.vercel.app/api/blog');
            const data = await response.json();

            const blogData = Array.isArray(data) ? data : data.getBlogs || [];

            // Sort by newest first by default
            const sortedBlogs = blogData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setBlogs(sortedBlogs);
            
            // Extract unique topics dynamically
            const topics = ['All', ...new Set(blogData.map(blog => blog.Topic).filter(Boolean))];
            setAvailableTopics(topics);
            
            // Apply initial filtering and sorting
            applyFilters(sortedBlogs, 'All', 'newest', '');
        } catch (err) {
            setError(`Failed to fetch blogs: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (blogList, topic, sort, search) => {
        let filtered = [...blogList];

        // Filter by topic
        if (topic !== 'All') {
            filtered = filtered.filter(blog => blog.Topic === topic);
        }

        // Filter by search term
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(blog => 
                blog.Title?.toLowerCase().includes(searchLower) ||
                blog.Content?.toLowerCase().includes(searchLower) ||
                blog.Author?.toLowerCase().includes(searchLower) ||
                blog.Topic?.toLowerCase().includes(searchLower)
            );
        }

        // Sort filtered results
        switch (sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title':
                filtered.sort((a, b) => (a.Title || '').localeCompare(b.Title || ''));
                break;
            case 'popular':
                // For now, sort by newest (you can implement view count later)
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setFilteredBlogs(filtered);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        applyFilters(blogs, activeTopic, sortBy, searchTerm);
    }, [blogs, activeTopic, sortBy, searchTerm]);

    const handleTopicClick = (topic) => {
        setActiveTopic(topic);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setActiveTopic('All');
        setSortBy('newest');
        setSearchTerm('');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-300 font-medium">Loading amazing blogs...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md mx-auto bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center border border-gray-700/50">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-300 mb-6">{error}</p>
                <button 
                    onClick={fetchBlogs} 
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
            <Nav />
            
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
            </div>
            
            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4 relative z-10">
                <div className="container mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                        Discover Amazing
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Stories & Insights
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Explore our curated collection of blogs spanning technology, lifestyle, achievements, and more. 
                        Find inspiration in every story.
                    </p>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="container mx-auto px-4 mb-12 relative z-10">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search blogs by title, content, author, or topic..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Filter Toggle Button */}
                <div className="text-center mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white hover:bg-gray-700/60 transition-all duration-300"
                    >
                        <Filter className="w-5 h-5" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Filters Panel */}
                <div className={`transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 mb-8">
                        {/* Sort Options */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <ArrowUpDown className="w-5 h-5" />
                                Sort By
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {sortOptions.map(option => {
                                    const IconComponent = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortChange(option.value)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                                                sortBy === option.value
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                            }`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Topic Filter */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Categories
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {availableTopics.map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => handleTopicClick(topic)}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                                            activeTopic === topic
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                        }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {filteredBlogs.length} of {blogs.length} blogs
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* No Results */}
            {filteredBlogs.length === 0 && !loading && (
                <div className="container mx-auto px-4 py-20 text-center relative z-10">
                    <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No blogs found</h3>
                    <p className="text-gray-400 mb-6">
                        {searchTerm ? `No results for "${searchTerm}"` : `No blogs available for "${activeTopic}" topic.`}
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Blog Grid */}
            {filteredBlogs.length > 0 && (
                <div className="container mx-auto px-4 pb-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <div key={blog._id} className="group">
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border border-gray-700/50 transform hover:-translate-y-2">
                                    {/* New Badge for Recent Posts */}
                                    {index < 3 && sortBy === 'newest' && (
                                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            NEW
                                        </div>
                                    )}
                                    
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
                                            <div className="text-right">
                                                <div className="text-sm text-gray-400 font-medium">
                                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                    })}
                                                </div>
                                                {blog.Author && (
                                                    <div className="text-xs text-gray-500">
                                                        by {blog.Author}
                                                    </div>
                                                )}
                                            </div>
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
            )}
        </div>
    );
};

export default Blogs;