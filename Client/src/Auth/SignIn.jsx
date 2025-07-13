import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import bg from '../assets/bg.jpg'

const SignUp = () => {
    const [formData, setFormData] = useState({
        Email: "",
        Password: ""
    })

    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const URL = 'http://localhost:2000/api/blog/login'
    const navigate = useNavigate()

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if (data && data.token) {
                localStorage.setItem('token', data.token)
                navigate('/home') // <-- Change this to your intended post-login route
            }
            
            return data;
        }
        catch (error) {
            console.log("Error in Signing In:", error)
        } finally {
            setIsLoading(false)
        }
        setFormData({
            Email: "",
            Password: ""
        })
    }

    const onChangeData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleLogin()

    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    const buttonVariants = {
        hover: {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.98 }
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{ 
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <motion.div 
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div 
                    className="text-center mb-8"
                    variants={itemVariants}
                >
                    <motion.h1 
                        className="text-4xl font-bold bg-gradient-to-r from-white via-blue-50 to-gray-100 bg-clip-text text-transparent mb-2 drop-shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        Join Our Blog
                    </motion.h1>
                    <motion.p 
                        className="text-white/95 text-lg drop-shadow-lg font-medium"
                        variants={itemVariants}
                    >
                        Start your writing journey today
                    </motion.p>
                </motion.div>

                {/* Form Container */}
                <motion.div 
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)" }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Glass morphism inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
                    
                    {/* Content container */}
                    <div className="relative z-10">
                    <form onSubmit={onSubmit} className="space-y-6">
                     

                        {/* Email Field */}
                        <motion.div 
                            className="space-y-2"
                            variants={itemVariants}
                        >
                            <label className="text-sm font-medium text-white/90 block drop-shadow-sm">
                                Email Address
                            </label>
                            <motion.div 
                                className="relative"
                                animate={{ 
                                    scale: focusedField === 'Email' ? 1.02 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={onChangeData}
                                    onFocus={() => setFocusedField('Email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full px-4 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/30 transition-all duration-300 text-white placeholder-white/60 shadow-inner"
                                    placeholder="Enter your email"
                                    required
                                />
                                <motion.div 
                                    className="absolute inset-0 rounded-xl border-2 border-blue-400/80 pointer-events-none shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: focusedField === 'Email' ? 1 : 0,
                                        scale: focusedField === 'Email' ? 1 : 0.8
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div 
                            className="space-y-2"
                            variants={itemVariants}
                        >
                            <label className="text-sm font-medium text-white/90 block drop-shadow-sm">
                                Password
                            </label>
                            <motion.div 
                                className="relative"
                                animate={{ 
                                    scale: focusedField === 'Password' ? 1.02 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={onChangeData}
                                    onFocus={() => setFocusedField('Password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full px-4 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/30 transition-all duration-300 text-white placeholder-white/60 shadow-inner"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <motion.div 
                                    className="absolute inset-0 rounded-xl border-2 border-blue-400/80 pointer-events-none shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: focusedField === 'Password' ? 1 : 0,
                                        scale: focusedField === 'Password' ? 1 : 0.8
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-xl text-white font-semibold rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden border border-white/20"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-400/60 to-purple-500/60 backdrop-blur-sm"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "0%" }}
                                    transition={{ duration: 0.5 }}
                                />
                                <span className="relative z-10 flex items-center justify-center drop-shadow-lg">
                                    {isLoading ? (
                                        <motion.div
                                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                    ) : (
                                        'Login'
                                    )}
                                </span>
                            </motion.button>
                        </motion.div>
                    </form>

                    {/* Login Link */}
                      <motion.div 
            className="text-center mt-6 pt-6 border-t border-white/20"
            variants={itemVariants}
        >
            <p className="text-white/80 drop-shadow-sm">
                No account?{' '}
                <motion.a
                    href="/sign" // <-- Change this to your signup route
                    className="text-blue-300 font-medium hover:text-blue-200 transition-colors drop-shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign up
                </motion.a>
            </p>
        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div 
                    className="text-center mt-8 text-white/80 text-sm drop-shadow-md"
                    variants={itemVariants}
                >
                    <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default SignUp