"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Base Unsplash image URL
  const imageBaseUrl = "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c";
  
  // URL parameters for optimized sizes
  const largeImageUrl = `${imageBaseUrl}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80`;
  const mobileImageUrl = `${imageBaseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
  
  useEffect(() => {
    // Preload image based on screen size
    const img = new Image();
    img.src = window.innerWidth < 768 ? mobileImageUrl : largeImageUrl;
    img.onload = () => setIsLoaded(true);
    
    // If it's already in cache, mark as loaded
    if (img.complete) setIsLoaded(true);
  }, [mobileImageUrl, largeImageUrl]);

  return (
    <section 
      id="home"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-16 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${window.innerWidth < 768 ? mobileImageUrl : largeImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Explore Indonesia with Us</h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 drop-shadow-md">
          Discover breathtaking destinations and unforgettable experiences with Sama Sama Tour
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Tours <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white hover:bg-white/20 text-white"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Us
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
};

export default Hero;