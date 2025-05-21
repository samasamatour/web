
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WhatsApp } from "./WhatsAppButton";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Contact Us</h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Have a question or ready to start planning your dream vacation? Get in touch with our team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-brand-light p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-left mb-1">Full Name</label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-left mb-1">Email Address</label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-left mb-1">Phone Number</label>
                <Input id="phone" placeholder="Your phone number" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-left mb-1">Subject</label>
                <Input id="subject" placeholder="What is this about?" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-left mb-1">Message</label>
                <Textarea id="message" placeholder="Your message" rows={4} />
              </div>
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 mb-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Our Office</h4>
                    <p className="text-muted-foreground mt-1">Jl. Sunset Road No. 88, Kuta, Bali 80361, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Phone Number</h4>
                    <p className="text-muted-foreground mt-1">+62 812-3456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-muted-foreground mt-1">info@samamatour.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium mb-4">Quick response on WhatsApp</h4>
              <WhatsApp 
                phoneNumber="628123456789" 
                message="Hello, I would like to inquire about your tour packages."
                size="lg"
                className="w-full"
              >
                Chat with Us on WhatsApp
              </WhatsApp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
