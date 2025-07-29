"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-brand-primary" />
            <span className="text-xl font-heading font-bold text-brand-dark">
              Sama Sama <span className="text-brand-primary">Tour</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="font-medium hover:text-brand-primary transition-colors">Home</a>
            <a href="#destinations" className="font-medium hover:text-brand-primary transition-colors">Destinations</a>
            <a href="#about" className="font-medium hover:text-brand-primary transition-colors">About</a>
            <a href="#testimonials" className="font-medium hover:text-brand-primary transition-colors">Testimonials</a>
            <a href="#contact" className="font-medium hover:text-brand-primary transition-colors">Contact</a>
          </div>
          
          <div className="md:hidden">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;