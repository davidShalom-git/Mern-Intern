import Nav from "./Nav";
import BlogTech from '../assets/blogTech.jpeg'
import BlogLF from '../assets/blogLF.jpg'
import BlogFood from '../assets/blogFood.jpg'
import BlogAch from '../assets/blogAch.jpg'
import BlogMem from '../assets/BlogMem.jpg'
import BlogSong from '../assets/BlogSong.jpg'
import upload from '../assets/uploadPNG.png'
import View from '../assets/ViewBlog.png'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation';
import { useEffect, useRef, useState } from "react";




const Home = () => {

  const [text, setText] = useState('');
  const fullText = "FavBlogs";
   const timeoutRef = useRef(null);

   useEffect(() => {
    let currentIndex = 0;
    const typeEffect = () => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeEffect, 150);
      } else {
        timeoutRef.current = setTimeout(() => {
          setText('');
          currentIndex = 0;
          typeEffect();
        }, 2000);
      }
    };

    typeEffect();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
    

      <div className="flex flex-col justify-center items-center mt-42 mb-28 mx-auto bg-black md:w-[50%] w-[95%] rounded-3xl ">
       <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                <span className="inline-block font-extrabold text-white pb-1 drop-shadow-sm mb-10 mt-5">
                  {text}
                </span>
              </motion.h1>
      </div>


      <p className="text-center mb-10 bg-black text-white rounded-full text-base md:text-xl w-[90%] md:w-[30%] mx-auto px-6 py-4 md:px-10 md:py-10">
        Categories
      </p>


      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div


          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }} className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {/* Category Card Template (Repeat with different images/titles) */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogTech}
                alt="Tech"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Tech
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

          {/* Life */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogLF}
                alt="Life"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Life
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

          {/* Food */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogFood}
                alt="Food"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Food
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

          {/* Achievements */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogAch}
                alt="Achievements"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Achievements
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

          {/* Memories */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogMem}
                alt="Memories"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Memories
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

          {/* Songs */}
          <div className="relative group focus-within:ring-2 focus-within:ring-black w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden cursor-pointer">
            <button className="absolute inset-0 w-full h-full focus:outline-none peer">
              <img
                src={BlogSong}
                alt="Songs"
                className="w-full h-full object-cover rounded-full transition duration-300 peer-focus:blur-sm group-hover:blur-sm"
              />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="opacity-0 peer-focus:opacity-100 group-hover:opacity-100 text-white font-semibold text-base md:text-4xl transition duration-300 relative">
                Songs
                <span className="block w-8 md:w-12 h-[2px] bg-black mt-1 mx-auto" />
              </h2>
            </div>
          </div>

        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}

        className="text-center my-6">
        <h1 className="text-3xl font-semibold">About Us</h1>
        <div className="w-24 h-1 bg-black mx-auto mt-2 rounded" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }} className="flex flex-col justify-center md:flex-row gap-10 shadow shadow-black mb-20 w-[90%] md:w-[70%] p-6 md:p-10 mx-auto">

        <div className="bg-black text-white p-6 md:p-8 w-full md:w-1/2 rounded-lg shadow-md">
          <p className="text-justify leading-relaxed mt-6 md:mt-10 text-sm md:text-base">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam, sapiente? Illo porro mollitia quod commodi,
            tempore adipisci quisquam laboriosam inventore minus laborum quasi quaerat velit, alias amet earum ipsa quo odit,
            debitis vel suscipit rem possimus facere corrupti. Architecto assumenda nesciunt ea reprehenderit? Vitae,
            reprehenderit quae explicabo itaque quia repellendus fugit id sapiente quod saepe quidem enim...
          </p>
        </div>


        <div className="flex justify-center items-center w-full md:w-1/3">
          <img
            src={BlogLF}
            alt="Blog visual"
            className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] object-cover rounded-lg shadow-md"
          />
        </div>
      </motion.div>

      <div className="text-center my-6">
        <h1 className="text-3xl font-semibold">What We do</h1>
        <div className="w-24 h-1 bg-black mx-auto mt-2 rounded" />
      </div>

      <motion.div initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }} className="flex flex-col justify-center md:flex-row gap-10 shadow shadow-black mb-20 w-[90%] md:w-[70%] p-6 md:p-10 mx-auto">

        <div className="flex justify-center items-center w-full md:w-1/3">
          <img
            src={BlogLF}
            alt="Blog visual"
            className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="bg-black text-white p-6 md:p-8 w-full md:w-1/2 rounded-lg shadow-md">
          <p className="text-justify leading-relaxed mt-6 md:mt-10 text-sm md:text-base">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam, sapiente? Illo porro mollitia quod commodi,
            tempore adipisci quisquam laboriosam inventore minus laborum quasi quaerat velit, alias amet earum ipsa quo odit,
            debitis vel suscipit rem possimus facere corrupti. Architecto assumenda nesciunt ea reprehenderit? Vitae,
            reprehenderit quae explicabo itaque quia repellendus fugit id sapiente quod saepe quidem enim...
          </p>
        </div>


      </motion.div>

      {/* Section Heading */}
      <div className="text-center my-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Let's Go</h1>
        <div className="w-24 h-1 bg-black mx-auto mt-2 rounded" />
      </div>

      {/* Upload and View Cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-28 px-4">
        {/* Upload */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}

          className="shadow shadow-black p-6 md:p-10 mb-10 w-full max-w-[300px]">
          <img
            src={upload}
            alt="Upload visual"
            className="w-full h-[250px] md:h-[300px] object-cover rounded-lg shadow-md"
          />
          <button className="flex mx-auto bg-black text-white mt-5 px-4 py-2 rounded-full hover:bg-gray-800 transition">
            Upload →
          </button>
        </motion.div>

        {/* View */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}

          className="shadow shadow-black p-6 md:p-10 mb-10 w-full max-w-[300px]">
          <img
            src={View}
            alt="View visual"
            className="w-full h-[250px] md:h-[300px] object-cover rounded-lg shadow-md"
          />
          <button className="flex mx-auto bg-black text-white mt-5 px-4 py-2 rounded-full hover:bg-gray-800 transition">
            View →
          </button>
        </motion.div>
      </div>

      {/* Blog Quote */}
      <p className="text-center mb-10 bg-black text-white text-base md:text-xl px-6 py-6 md:px-10 md:py-10 rounded-3xl w-[90%] md:w-[50%] mx-auto">
        “Don’t focus on having a great blog. Focus on producing a blog that’s great for your readers.”
      </p>





    </>
  )
}

export default Home;