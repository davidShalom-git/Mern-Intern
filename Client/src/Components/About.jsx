import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Nav from './Nav';
import { Link } from "react-router-dom";

const About = () => {
  const [text, setText] = useState('');
  const fullText = "David Shalom";
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
        }, 3000);
      }
    };

    typeEffect();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const skills = [
    { 
      name: 'React.js', 
      level: 80,
      gradient: 'from-cyan-400 to-blue-500',
      icon: '⚛️',
      description: 'Building dynamic UIs'
    },
    { 
      name: 'Node.js', 
      level: 70,
      gradient: 'from-green-500 to-emerald-600',
      icon: '🟢',
      description: 'Backend development'
    },
    { 
      name: 'MongoDB', 
      level: 70,
      gradient: 'from-green-600 to-green-800',
      icon: '🍃',
      description: 'Database management'
    },
    { 
      name: 'Express.js', 
      level: 80,
      gradient: 'from-gray-600 to-gray-800',
      icon: '⚡',
      description: 'Server-side framework'
    },
    { 
      name: 'React Native', 
      level: 60,
      gradient: 'from-blue-500 to-purple-600',
      icon: '📱',
      description: 'Mobile app development'
    },
    { 
      name: 'JavaScript', 
      level: 85,
      gradient: 'from-yellow-400 to-orange-500',
      icon: '🟨',
      description: 'Core programming language'
    }
  ];

  const projects = [
    {
      title: 'FavBlogs Platform',
      description: 'A full-stack blogging platform with modern UI and seamless user experience',
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      icon: '📝',
      gradient: 'from-purple-500 to-pink-500',
      link: ''
    },
    {
      title: 'Educational App',
      description: 'Cross-platform mobile application and real-time updates',
      tech: ['MERN','JWT AUTH'],
      icon: '🏫',
      gradient: 'from-blue-500 to-cyan-500',
      link: 'https://education-neon-mu.vercel.app/'
    },
    {
      title: 'Real Time Chat Application',
      description: 'Create an Account and Chat With Your Friends and Families..💬',
      tech: ['MERN Stack', 'Socket.io', 'JWT Auth'],
      icon: '💬',
      gradient: 'from-green-500 to-teal-500',
      link: 'https://chat-app-r2z9.onrender.com/'
    }
  ];

  const achievements = [
    { icon: '🏆', title: '20+ Projects', description: 'Successfully delivered' },
    { icon: '⭐', title: '1 Years', description: 'Industry experience' },
    { icon: '🚀', title: '4+', description: 'Mobile apps launched' }
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
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 pt-20"
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl mb-6 shadow-2xl">
              👨‍💻
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {text}
            </span>
            <motion.span
              className="inline-block w-1 h-16 bg-gradient-to-b from-purple-400 to-pink-400 ml-2 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            MERN Stack & Mobile App Developer
          </motion.p>

          <motion.p
            className="text-lg text-purple-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Crafting digital experiences that bridge innovation with functionality
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full">
              <span className="text-purple-300">React.js</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-full">
              <span className="text-green-300">Node.js</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
              <span className="text-blue-300">React Native</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-full">
              <span className="text-yellow-300">MongoDB</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* About Me Section */}
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
                  About Me
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Hi! I'm David Shalom, a passionate full-stack developer specializing in the MERN stack and mobile app development. With 1+ years of experience, I transform ideas into powerful digital solutions that make a real impact.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                My journey in tech started with a curiosity about how things work behind the scenes. Today, I build scalable web applications and cross-platform mobile apps that serve thousands of users worldwide.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                I believe in writing clean, maintainable code and creating user experiences that not only look great but also solve real problems. When I'm not coding, you'll find me exploring new technologies and contributing to open-source projects.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-xl font-bold text-purple-300 mb-1">{achievement.title}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    My Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To create innovative digital solutions that empower businesses and enhance user experiences through cutting-edge technology and thoughtful design.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-purple-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Full-Stack Development</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Mobile App Development</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>UI/UX Design</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Performance Optimization</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
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
                My Skills
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Expertise across the full development stack with a focus on modern technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{skill.name}</h3>
                    <p className="text-gray-400 text-sm">{skill.description}</p>
                  </div>
                  <div className="text-lg font-bold text-purple-300">{skill.level}%</div>
                </div>
                
                <div className="relative w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
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
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Some of the exciting projects I've worked on recently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 h-full hover:bg-white/10 transition-all duration-300 shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {project.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300">
                    <Link to={project.link} className="mr-2">View Projects...</Link>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
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
              Let's Build Something Amazing Together
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life with cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                <span className="relative z-10">Get In Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 hover:scale-105">
                <a href="https://pdflink.to/280823a3/">Resume</a>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default About;