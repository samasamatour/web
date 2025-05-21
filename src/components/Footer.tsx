
import { Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-7 h-7 text-brand-primary" />
              <span className="text-xl font-heading font-bold">
                Sama Sama <span className="text-brand-primary">Tour</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-left">
              Your trusted partner for unforgettable travel experiences in Indonesia. Discover the beauty of our country with expert local guides.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-brand-primary" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-primary" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7V7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-primary" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M22 5.89C21.26 6.21 20.46 6.42 19.64 6.53C20.49 6.03 21.14 5.24 21.44 4.3C20.65 4.77 19.77 5.09 18.84 5.28C18.09 4.49 17.02 4 15.85 4C13.58 4 11.75 5.81 11.75 8.04C11.75 8.36 11.78 8.67 11.84 8.96C8.43998 8.79 5.41998 7.19 3.38998 4.74C3.03998 5.34 2.82998 6.03 2.82998 6.77C2.82998 8.18 3.55998 9.42 4.64998 10.13C3.98998 10.12 3.33998 9.93 2.79998 9.63V9.67C2.79998 11.63 4.21998 13.26 6.07998 13.64C5.74998 13.73 5.37998 13.77 4.99998 13.77C4.73998 13.77 4.46998 13.76 4.21998 13.7C4.74998 15.3 6.25998 16.48 8.04998 16.51C6.65998 17.6 4.88998 18.25 2.97998 18.25C2.64998 18.25 2.31998 18.24 1.98998 18.2C3.81998 19.36 5.96998 20.03 8.28998 20.03C15.84 20.03 19.95 13.84 19.95 8.5C19.95 8.32 19.95 8.15 19.94 7.98C20.76 7.41 21.45 6.7 22 5.89Z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-primary" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-left">Quick Links</h3>
            <ul className="space-y-2 text-left">
              <li><a href="#home" className="text-gray-300 hover:text-brand-primary transition-colors">Home</a></li>
              <li><a href="#destinations" className="text-gray-300 hover:text-brand-primary transition-colors">Destinations</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-brand-primary transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-brand-primary transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-brand-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-left">Popular Tours</h3>
            <ul className="space-y-2 text-left">
              <li><a href="#" className="text-gray-300 hover:text-brand-primary transition-colors">Bali Paradise Tour</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-primary transition-colors">Lombok Adventure</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-primary transition-colors">Historical Yogyakarta</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-primary transition-colors">Komodo Dragon Expedition</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-primary transition-colors">Raja Ampat Diving</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-left">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-left">Subscribe to our newsletter for special offers and latest updates.</p>
            <form className="flex">
              <input type="email" placeholder="Your email address" className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-900" />
              <button type="submit" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 14 0"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {currentYear} Sama Sama Tour. All Rights Reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-brand-primary text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-brand-primary text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-brand-primary text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
