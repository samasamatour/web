'use client';

import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Team Sama Sama Tour" 
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-primary p-4 rounded-lg shadow-lg hidden md:block">
              <p className="text-white font-heading font-bold text-xl">10+ Years Experience</p>
            </div>
          </div>
          
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">About Sama Sama Tour</h2>
            <p className="text-lg mb-6">
              Sama Sama Tour is a premier travel agency based in Indonesia, specializing in curated travel experiences 
              that showcase the beauty and culture of the Indonesian archipelago.
            </p>
            <p className="text-lg mb-6">
              With over 10 years of experience, our team of local experts crafts unique travel itineraries that 
              combine popular destinations with hidden gems, ensuring an authentic and memorable journey.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-brand-light p-4 rounded-lg text-center">
                <h3 className="text-4xl font-bold text-brand-primary mb-2">120+</h3>
                <p className="text-sm">Destinations</p>
              </div>
              <div className="bg-brand-light p-4 rounded-lg text-center">
                <h3 className="text-4xl font-bold text-brand-primary mb-2">15k+</h3>
                <p className="text-sm">Happy Travelers</p>
              </div>
              <div className="bg-brand-light p-4 rounded-lg text-center">
                <h3 className="text-4xl font-bold text-brand-primary mb-2">4.8</h3>
                <p className="text-sm">Review Score</p>
              </div>
              <div className="bg-brand-light p-4 rounded-lg text-center">
                <h3 className="text-4xl font-bold text-brand-primary mb-2">24/7</h3>
                <p className="text-sm">Customer Support</p>
              </div>
            </div>
            
            <Button 
              className="bg-brand-primary hover:bg-brand-primary/90"
              onClick={() => document.getElementById('contact')?.scrollIntoView()}
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;