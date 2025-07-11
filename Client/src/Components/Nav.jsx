import { useState } from "react";

const Nav = () => {
const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">FavBlogs</h1>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className="hidden md:flex space-x-6">
          <li><a href="#" className="hover:text-gray-400">Home</a></li>
          <li><a href="#" className="hover:text-gray-400">Blogs</a></li>
          <li><a href="#" className="hover:text-gray-400">Upload</a></li>
          <li><a href="#" className="hover:text-gray-400">About</a></li>
        </ul>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-4 mt-4">
          <li><a href="#" className="hover:text-gray-400">Home</a></li>
          <li><a href="#" className="hover:text-gray-400">Blogs</a></li>
          <li><a href="#" className="hover:text-gray-400">Upload</a></li>
          <li><a href="#" className="hover:text-gray-400">About</a></li>
        </ul>
      )}
    </nav>
    )
}

export default Nav;