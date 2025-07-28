import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
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
      <FloatingWhatsAppButton phoneNumber="6282236037774" />
    </div>
  );
}