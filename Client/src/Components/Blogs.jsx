import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

    // 🔍 Filter blogs by topic
    const handleTopicClick = (topic) => {
        setActiveTopic(topic);
        if (topic === 'All') {
            setFilteredBlogs(blogs);
        } else {
            setFilteredBlogs(blogs.filter(blog => blog.Topic === topic));
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    if (error) return (
        <div className="max-w-sm mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Blogs</h3>
            <p className="text-red-600">{error}</p>
            <button onClick={fetchBlogs} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Again</button>
        </div>
    );

    if (filteredBlogs.length === 0) return (
        <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No blogs found for "{activeTopic}".</p>
        </div>
    );

    return (
        <div className="container mx-auto mt-28 px-4 py-8">
            <h1 className="text-5xl  font-extrabold text-center mb-20 text-gray-900 dark:text-white">Latest Blogs</h1>

            <div className='flex flex-wrap justify-center gap-4 mb-8'>
                {topics.map(topic => (
                    <button
                        key={topic}
                        onClick={() => handleTopicClick(topic)}
                        className={`text-lg rounded-full px-5 py-2 shadow ${activeTopic === topic
                            ? 'bg-white text-black'
                            : 'bg-black text-white hover:bg-white hover:text-black transition-all duration-300'
                            }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                {filteredBlogs.map(blog => (
                    <div key={blog._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                        <Link to={`/blogs/${blog._id}`}>
                            <img
                                className="rounded-t-lg w-full h-48 object-cover"
                                src={blog.Image}
                                alt={blog.Title}
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=250&fit=crop";
                                }}
                            />
                        </Link>

                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{blog.Topic}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Link to={`/blogs/${blog._id}`}>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {blog.Title}
                                </h5>
                            </Link>

                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{blog.Content}</p>
                            <Link to={`/blogs/${blog._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">Read more</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;