import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
// Note: Remove this import since we can't access local files in artifacts
// import bg from '../assets/bg.jpg'

const SignUp = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Password: ""
    })

    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [error, setError] = useState("") // Add error state

    const URL = 'https://mern-intern-xi.vercel.app/api/blog/register'
    const navigate = useNavigate()

    const handleSignUp = async () => {
        setIsLoading(true)
        setError("") // Clear previous errors
        
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            
            // Check if the response was successful
            if (response.ok) {
                // Store token if provided
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                
                // Navigate to main page on successful registration
                console.log("Registration successful, navigating to home...")
                navigate('/', { replace: true })
            } else {
                // Handle error cases
                const errorMessage = data.message || data.error || "Registration failed. Please try again."
                setError(errorMessage)
                console.error("Registration failed:", errorMessage)
            }
            
            return data;
        }
        catch (error) {
            console.log("Error in Signing Up:", error)
            setError("Network error. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const onChangeData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (error) setError("")
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleSignUp()
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
            className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
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

                <motion.div
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)" }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>

                    <div className="relative z-10">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-6">
                            <motion.div
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <label className="text-sm font-medium text-white/90 block drop-shadow-sm">
                                    Full Name
                                </label>
                                <motion.div
                                    className="relative"
                                    animate={{
                                        scale: focusedField === 'Name' ? 1.02 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        type="text"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={onChangeData}
                                        onFocus={() => setFocusedField('Name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full px-4 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/30 transition-all duration-300 text-white placeholder-white/60 shadow-inner"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    <motion.div
                                        className="absolute inset-0 rounded-xl border-2 border-blue-400/80 pointer-events-none shadow-lg"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: focusedField === 'Name' ? 1 : 0,
                                            scale: focusedField === 'Name' ? 1 : 0.8
                                        }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                            </motion.div>

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
                                            'Create Account'
                                        )}
                                    </span>
                                </motion.button>
                            </motion.div>
                        </form>

                        <motion.div
                            className="text-center mt-6 pt-6 border-t border-white/20"
                            variants={itemVariants}
                        >
                            <p className="text-white/80 drop-shadow-sm">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-400 hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

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