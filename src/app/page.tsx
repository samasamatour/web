import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { createClient } from "@/lib/supabase/server";
import { Destination, Testimonial } from "@/types/database";

async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }

  return data || [];
}

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const [destinations, testimonials] = await Promise.all([
    getDestinations(),
    getTestimonials()
  ]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Destinations */}
      <Destinations destinations={destinations} />
      
      {/* About Us */}
      <About />
      
      {/* Testimonials */}
      <Testimonials testimonials={testimonials} />
      
      {/* Contact */}
      <Contact />
      
      {/* Footer */}
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton phoneNumber="6282236037774" />
    </div>
  );
}