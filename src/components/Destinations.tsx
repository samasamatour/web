
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsApp } from "./WhatsAppButton";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Destination {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  description: string;
}

const destinations: Destination[] = [
  {
    id: "bali",
    title: "Bali Paradise Tour",
    location: "Bali",
    price: "Rp 5.500.000",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Explore the magical island of Bali, visit sacred temples, beautiful beaches, and experience the unique culture. 5 days 4 nights package includes accommodation and transport."
  },
  {
    id: "lombok",
    title: "Lombok Adventure",
    location: "Lombok",
    price: "Rp 4.800.000",
    image: "https://images.unsplash.com/photo-1626331900236-8a1207c78e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Discover the pristine beaches of Lombok and the famous Gili Islands. 4 days 3 nights package with snorkeling experience and beach activities."
  },
  {
    id: "yogyakarta",
    title: "Historical Yogyakarta",
    location: "Yogyakarta",
    price: "Rp 3.200.000",
    image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Visit the ancient temples of Borobudur and Prambanan, explore the culture of Yogyakarta. 3 days 2 nights with guided tours and cultural experiences."
  },
  {
    id: "komodo",
    title: "Komodo Dragon Expedition",
    location: "Flores",
    price: "Rp 6.900.000",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "See the legendary Komodo dragons in their natural habitat, explore Pink Beach, and enjoy snorkeling in crystal clear waters. 5 days 4 nights full expedition."
  },
  {
    id: "raja-ampat",
    title: "Raja Ampat Diving",
    location: "Papua",
    price: "Rp 12.500.000",
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Explore one of the most biodiverse marine locations in the world. 7 days 6 nights package with diving sessions, island hopping, and local experiences."
  },
  {
    id: "toraja",
    title: "Cultural Toraja",
    location: "Sulawesi",
    price: "Rp 4.500.000",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    description: "Experience the unique culture of Toraja, see traditional burial sites, ancient villages and beautiful landscapes. 4 days 3 nights cultural immersion."
  },
];

const DestinationCard = ({ destination }: { destination: Destination }) => {
  const message = `Hello, I'm interested in the ${destination.title} (${destination.location}) package for ${destination.price}. Can I get more information?`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{destination.title}</CardTitle>
          <span className="px-2 py-1 bg-brand-primary text-white text-sm rounded-md">{destination.price}</span>
        </div>
        <span className="text-sm text-muted-foreground flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {destination.location}
        </span>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-left">{destination.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Link to={`/destination/${destination.id}`} className="flex-grow">
          <Button variant="outline" className="w-full">
            View Details <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <WhatsApp 
          phoneNumber="6282236037774"
          message={encodeURIComponent(message)}
          className="ml-2"
        >
          Contact
        </WhatsApp>
      </CardFooter>
    </Card>
  );
};

const Destinations = () => {
  return (
    <section id="destinations" className="py-20 bg-brand-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Popular Destinations</h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Explore our handpicked selection of the most beautiful destinations in Indonesia
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
