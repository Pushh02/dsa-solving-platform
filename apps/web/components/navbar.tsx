"use client"; //ask pushkar about it
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
// import React, { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-customGreen text-lg font-bold">Coding Genius</div>

        {/* Mobile menu button */}
        <div className="block md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-black focus:outline-none"
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu for larger screens */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/problem"
            className="text-black relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Problem
          </Link>
          <Link
            href="/about"
            className="text-black relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Guided List
          </Link>
          <Link
            href="/services"
            className="text-black relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-black relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Contribute
          </Link>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } absolute top-16 left-0 right-0 bg-white p-4 md:hidden flex-col space-y-4`}
        >
          <Link href="/" className="text-black block text-lg">
            Problem
          </Link>
          <Link href="/about" className="text-black block text-lg">
            Guided List
          </Link>
          <Link href="/services" className="text-black block text-lg">
            About Us
          </Link>
          <Link href="/contact" className="text-black block text-lg">
            Contribute
          </Link>
        </div>

        <div className="hidden ">
          {" "}
          //md:flex
          <button className="  py-2 px-4 bg-customGreen text-white rounded-sm mr-1">
            Get Started
          </button>
        </div>
        <UserButton />
      </div>
    </nav>
  );
};

// Export the Navbar component with dynamic import to avoid SSR
export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
