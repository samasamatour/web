
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const Index = () => {
  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Sama Sama Tour",
      "url": "https://samamatour.com",
      "logo": "https://samamatour.com/logo.png",
      "description": "Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages with expert local guides.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jl. Sunset Road No. 88",
        "addressLocality": "Kuta, Bali",
        "postalCode": "80361",
        "addressCountry": "ID"
      },
      "telephone": "+628123456789",
      "email": "info@samamatour.com"
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Destinations */}
      <Destinations />
      
      {/* About Us */}
      <About />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Contact */}
      <Contact />
      
      {/* Footer */}
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton phoneNumber="628123456789" />
    </div>
  );
};

export default Index;
