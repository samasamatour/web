
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { WhatsApp } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";
import CarRental from "@/components/CarRental";
import { Helmet } from "react-helmet-async";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the destination based on the ID from URL params
  const destination = destinations.find((d) => d.id === id);

  // Redirect to 404 if destination not found
  useEffect(() => {
    if (!destination && id) {
      navigate("/not-found");
    }
  }, [destination, id, navigate]);

  if (!destination) {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in the ${destination.title} (${destination.location}) package for ${destination.price}. Can I get more details?`
  );

  // Generate meta description based on destination
  const metaDescription = `Explore ${destination.title} in ${destination.location}, Indonesia with Sama Sama Tour. ${destination.description.slice(0, 120)}... Book now from ${destination.price}!`;
  const metaKeywords = `${destination.location} tour, ${destination.title}, Indonesia travel, ${destination.location} vacation, ${destination.location} holiday, travel agency Indonesia`;

  // Add structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": destination.title,
    "description": destination.description,
    "image": destination.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": destination.location,
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": destination.coordinates?.lat || -8.4095,
      "longitude": destination.coordinates?.lng || 115.1889
    },
    "priceRange": destination.price,
    "publicAccess": true,
    "offers": {
      "@type": "Offer",
      "price": destination.price.replace(/\D/g, ""),
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <Helmet>
        <title>{`${destination.title} - ${destination.location} | Sama Sama Tour`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={`https://samamatour.com/destination/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${destination.title} - ${destination.location} | Sama Sama Tour`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={destination.image} />
        <meta property="og:url" content={`https://samamatour.com/destination/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${destination.title} - ${destination.location} | Sama Sama Tour`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={destination.image} />
        <link rel="preload" as="image" href={destination.image} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Navigation */}
      <div className="bg-brand-primary text-white py-4">
        <div className="container mx-auto px-4 md:px-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-white hover:bg-brand-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.title} 
          className="w-full h-full object-cover"
          loading="eager"
          width="1200"
          height="800"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{destination.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{destination.location}</span>
              </div>
              <div className="bg-brand-primary text-white inline-block px-4 py-2 rounded-md text-lg font-semibold">
                {destination.price}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
              <p className="text-gray-700 mb-6">{destination.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">What's Included</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Accommodation in selected hotels</li>
                <li>All transportation during the tour</li>
                <li>Experienced local tour guide</li>
                <li>Entry tickets to attractions</li>
                <li>Daily breakfast and select meals</li>
                <li>Pick up and drop off service</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Itinerary</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((day) => (
                  <div key={day} className="border-l-2 border-brand-primary pl-4">
                    <h4 className="font-semibold text-lg">Day {day}</h4>
                    <p className="text-gray-700">
                      {day === 1 
                        ? "Arrival at your destination, hotel check-in, and welcome dinner." 
                        : day === 2 
                          ? "Explore the local attractions with our expert guide, traditional lunch experience." 
                          : "Free morning for shopping, afternoon activities, and farewell dinner."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Car Rental Section */}
            <CarRental destination={destination} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
              <p className="text-gray-700 mb-6">
                Contact our team to book this amazing tour experience or to get more information about availability and custom requests.
              </p>
              <WhatsApp
                phoneNumber="6282236037774"
                message={whatsappMessage}
                className="w-full mb-4"
              >
                Book via WhatsApp
              </WhatsApp>
              
              <div className="mt-6 p-4 bg-brand-light rounded-md">
                <h4 className="font-semibold">Need more information?</h4>
                <p className="text-sm text-gray-600 mb-2">Our team is ready to assist you with any questions.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@samamatour.com</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+62 822 3603 7774</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Tours */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
              <div className="space-y-4">
                {destinations
                  .filter(d => d.id !== id)
                  .slice(0, 3)
                  .map(relatedTour => (
                    <div key={relatedTour.id} className="flex gap-3">
                      <img 
                        src={relatedTour.image} 
                        alt={relatedTour.title} 
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{relatedTour.title}</h4>
                        <p className="text-sm text-gray-500">{relatedTour.location}</p>
                        <p className="text-sm font-medium text-brand-primary">{relatedTour.price}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton phoneNumber="6282236037774" />
    </div>
  );
};

// Destinations data (same as used in Destinations.tsx)
const destinations = [
  {
    id: "bali",
    title: "Bali Paradise Tour",
    location: "Bali",
    price: "Rp 5.500.000",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Explore the magical island of Bali, visit sacred temples, beautiful beaches, and experience the unique culture. 5 days 4 nights package includes accommodation and transport. Visit Ubud, Kuta, Seminyak, Uluwatu Temple, and participate in traditional Balinese ceremonies. Enjoy delicious local cuisine and relax on pristine beaches with crystal clear waters.",
    coordinates: { lat: -8.4095, lng: 115.1889 }
  },
  {
    id: "lombok",
    title: "Lombok Adventure",
    location: "Lombok",
    price: "Rp 4.800.000",
    image: "https://images.unsplash.com/photo-1626331900236-8a1207c78e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Discover the pristine beaches of Lombok and the famous Gili Islands. 4 days 3 nights package with snorkeling experience and beach activities. Explore Gili Trawangan, Gili Meno, and Gili Air with their beautiful coral reefs and marine life. Trek to Sendang Gile and Tiu Kelep waterfalls and learn about the Sasak culture.",
    coordinates: { lat: -8.6500, lng: 116.3300 }
  },
  {
    id: "yogyakarta",
    title: "Historical Yogyakarta",
    location: "Yogyakarta",
    price: "Rp 3.200.000",
    image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Visit the ancient temples of Borobudur and Prambanan, explore the culture of Yogyakarta. 3 days 2 nights with guided tours and cultural experiences. Walk through the Sultan's Palace (Keraton), shop at Malioboro Road, and witness the spectacular Ramayana Ballet with Mount Merapi as backdrop. Experience the rich Javanese culture and history.",
    coordinates: { lat: -7.7956, lng: 110.3695 }
  },
  {
    id: "komodo",
    title: "Komodo Dragon Expedition",
    location: "Flores",
    price: "Rp 6.900.000",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "See the legendary Komodo dragons in their natural habitat, explore Pink Beach, and enjoy snorkeling in crystal clear waters. 5 days 4 nights full expedition. Trek through Rinca Island, witness spectacular views from Padar Island, and swim with manta rays. An adventure of a lifetime in one of Indonesia's most unique national parks.",
    coordinates: { lat: -8.5850, lng: 119.4411 }
  },
  {
    id: "raja-ampat",
    title: "Raja Ampat Diving",
    location: "Papua",
    price: "Rp 12.500.000",
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Explore one of the most biodiverse marine locations in the world. 7 days 6 nights package with diving sessions, island hopping, and local experiences. Discover the underwater paradise with over 1,500 species of fish and 500 species of coral. Visit Wayag Island, Piaynemo, and the hidden gems of Misool. Perfect for divers and underwater photography enthusiasts.",
    coordinates: { lat: -0.7893, lng: 130.6695 }
  },
  {
    id: "toraja",
    title: "Cultural Toraja",
    location: "Sulawesi",
    price: "Rp 4.500.000",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Experience the unique culture of Toraja, see traditional burial sites, ancient villages and beautiful landscapes. 4 days 3 nights cultural immersion. Visit Lemo Cliff Graves, Kete Kesu traditional village, and witness traditional ceremonies if available. Stay in traditional Tongkonan houses and learn about the fascinating Torajan beliefs and customs.",
    coordinates: { lat: -2.8695, lng: 119.7928 }
  },
];

export default DetailPage;
