import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsApp } from "./WhatsAppButton";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Destination } from "@/types/database";

const DestinationCard = ({ destination }: { destination: Destination }) => {
  const message = `Hello, I'm interested in the ${destination.title} (${destination.location}) package for ${destination.price}. Can I get more information?`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="aspect-[4/3] overflow-hidden relative">
        <Image 
          src={destination.image} 
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <p className="text-sm text-left">{destination.description.slice(0, 150)}...</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Link href={`/destination/${destination.id}`} className="flex-grow">
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

interface DestinationsProps {
  destinations: Destination[];
}

const Destinations = ({ destinations }: DestinationsProps) => {
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