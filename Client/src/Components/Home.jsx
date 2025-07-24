import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from "react-router-dom";
import Nav from "./Nav";

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "FavBlogs";
  const timeoutRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    let currentIndex = 0;
    const typeEffect = () => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeEffect, 120);
      } else {
        timeoutRef.current = setTimeout(() => {
          setText('');
          currentIndex = 0;
          typeEffect();
        }, 2500);
      }
    };

    typeEffect();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const categories = [
    { 
      name: 'Tech', 
      gradient: 'from-violet-600 via-purple-600 to-blue-600',
      icon: '⚡',
      description: 'Latest in technology',
      hover: 'hover:shadow-violet-500/30'
    },
    { 
      name: 'Life', 
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: '🌿',
      description: 'Life experiences',
      hover: 'hover:shadow-emerald-500/30'
    },
    { 
      name: 'Food', 
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      icon: '🍴',
      description: 'Culinary adventures',
      hover: 'hover:shadow-orange-500/30'
    },
    { 
      name: 'Achievements', 
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      icon: '👑',
      description: 'Success stories',
      hover: 'hover:shadow-yellow-500/30'
    },
    { 
      name: 'Memories', 
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      icon: '💫',
      description: 'Cherished moments',
      hover: 'hover:shadow-pink-500/30'
    },
    { 
      name: 'Songs', 
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      icon: '🎼',
      description: 'Musical journeys',
      hover: 'hover:shadow-indigo-500/30'
    }
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative overflow-hidden">
      <Nav />
      {/* Enhanced Background Elements */}
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
      <motion.div 
        style={{ y }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4"
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {text}
            </span>
            <motion.span
              className="inline-block w-1 h-20 bg-gradient-to-b from-purple-400 to-pink-400 ml-2 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Where stories find their voice and memories become timeless. 
            <span className="block mt-2 text-purple-300">Join thousands of writers sharing their world.</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <Link to='/upload' className="relative z-10">Start Writing</Link>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
            <button className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 hover:scale-105">
               <Link to='/blogs' className="relative z-10">Stories</Link>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-purple-400 rounded-full mt-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Explore Categories
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover stories across different aspects of life and share your own experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className={`group relative cursor-pointer ${category.hover}`}
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full shadow-2xl transition-all duration-300 hover:bg-white/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                      {category.description}
                    </p>
                    <div className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300">
                      <span className="mr-2">Explore</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  About FavBlogs
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Welcome to FavBlogs, where memories come to life through words. Our platform is designed to help you capture, organize, and share your most treasured moments across different categories of life.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Whether it's a tech breakthrough, a life lesson, a delicious meal, or a cherished memory, we provide the perfect space for your stories to flourish and connect with readers worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-purple-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Easy to use</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Global community</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure platform</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-6xl mb-4 text-center">📖</div>
                  <h3 className="text-2xl font-bold text-center mb-4">Your Stories Matter</h3>
                  <p className="text-center text-gray-200">
                    Every story you share becomes part of a larger tapestry of human experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                What We Offer
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful tools and features to help you create, share, and discover amazing content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  ✍️
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    Write & Share
                  </h3>
                  <p className="text-gray-300">
                    Create beautiful blog posts with our intuitive editor and share them with the world instantly.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  🔍
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    Discover Content
                  </h3>
                  <p className="text-gray-300">
                    Explore thousands of stories across different categories and find content that resonates with you.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl"
          >
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Share Your Story?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of writers and readers. Start your blogging journey today and connect with people who share your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                <a href="/upload" className="relative z-10">Get Started</a>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 hover:scale-105">
                <a href="/about">Learn More</a>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="text-6xl mb-8 text-yellow-400">💫</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-200 italic mb-8 leading-relaxed">
              "Don't focus on having a great blog. Focus on producing a blog that's great for your readers."
            </blockquote>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default Home;