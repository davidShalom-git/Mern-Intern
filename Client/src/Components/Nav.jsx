import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'Upload', path: '/upload' },
        { name: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Listen for storage changes to update token state
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("storage", handleStorageChange);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Handle logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsMenuOpen(false); // Close mobile menu
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 z-50 transition-all duration-500 ${isScrolled ? "bg-gray-900/95 shadow-md text-white backdrop-blur-lg py-3 md:py-4" : "bg-gray-900 py-4 md:py-6 text-white"}`}>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
               <h1 className="text-4xl font-semibold">FavBlogs</h1>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} className="group flex flex-col gap-0.5 text-lg text-white">
                        {link.name}
                        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-purple-400" />
                    </Link>
                ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {token ? (
                    <button 
                        onClick={handleLogout}
                        className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white text-gray-900 hover:bg-gray-100"}`}
                    >
                        Logout
                    </button>
                ) : (
                    <Link 
                        to='/sign' 
                        className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white text-gray-900 hover:bg-gray-100"}`}
                    >
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 mr-3 md:hidden">
                <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-6 w-6 cursor-pointer text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-gray-900 text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-white transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-colors duration-200">
                        {link.name}
                    </Link>
                ))}

                {/* Mobile Login/Logout Button - Fixed to show proper state */}
                {token ? (
                    <button 
                        onClick={handleLogout}
                        className="bg-white text-gray-900 px-8 py-2.5 rounded-full transition-all duration-500 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                ) : (
                    <Link 
                        to='/sign' 
                        onClick={() => setIsMenuOpen(false)}
                        className="bg-white text-gray-900 px-8 py-2.5 rounded-full transition-all duration-500 hover:bg-gray-100"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Nav;