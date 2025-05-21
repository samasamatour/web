
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

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
      "logo": "https://samamatour.com/logo.webp",
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
      <Helmet>
        <title>Sama Sama Tour - Explore Indonesia with Expert Local Guides</title>
        <meta name="description" content="Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides." />
        <meta name="keywords" content="Indonesia travel, Bali tour, Lombok vacation, Indonesian tour package, Raja Ampat, Komodo tour, travel agency Indonesia" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" />
        <meta name="theme-color" content="#1D9A8B" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sama Sama Tour - Explore Indonesia with Expert Local Guides" />
        <meta property="og:description" content="Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:url" content="https://samamatour.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sama Sama Tour - Explore Indonesia with Expert Local Guides" />
        <meta name="twitter:description" content="Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
      </Helmet>
      
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
      <FloatingWhatsAppButton phoneNumber="6282236037774" />
    </div>
  );
};

export default Index;
