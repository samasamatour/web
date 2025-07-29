/* eslint-disable react-refresh/only-export-components */
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WhatsApp } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import CarRental from "@/components/CarRental";
import { createClient } from "@/lib/supabase/server";
import { Destination } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDestination(id: string): Promise<Destination | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedDestinations(currentId: string): Promise<Destination[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .neq('id', currentId)
    .limit(3);

  if (error || !data) {
    return [];
  }

  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    return {
      title: 'Destination Not Found | Sama Sama Tour',
    };
  }

  const metaDescription = `Explore ${destination.title} in ${destination.location}, Indonesia with Sama Sama Tour. ${destination.description.slice(0, 120)}... Book now from ${destination.price}!`;
  const metaKeywords = `${destination.location} tour, ${destination.title}, Indonesia travel, ${destination.location} vacation, ${destination.location} holiday, travel agency Indonesia`;

  return {
    title: `${destination.title} - ${destination.location} | Sama Sama Tour`,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      type: 'website',
      title: `${destination.title} - ${destination.location} | Sama Sama Tour`,
      description: metaDescription,
      images: [
        {
          url: destination.image,
          width: 1200,
          height: 630,
          alt: destination.title,
        },
      ],
      url: `https://samamatour.com/destination/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${destination.title} - ${destination.location} | Sama Sama Tour`,
      description: metaDescription,
      images: [destination.image],
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  const relatedDestinations = await getRelatedDestinations(id);

  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in the ${destination.title} (${destination.location}) package for ${destination.price}. Can I get more details?`
  );

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
    "geo": destination.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": destination.coordinates.lat,
      "longitude": destination.coordinates.lng
    } : undefined,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Navigation */}
      <div className="bg-brand-primary text-white py-4">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-brand-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
        <Image 
          src={destination.image} 
          alt={destination.title} 
          fill
          className="object-cover"
          priority
          sizes="100vw"
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
              
              <h3 className="text-xl font-semibold mb-3">What&apos;s Included</h3>
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
            {relatedDestinations.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
                <div className="space-y-4">
                  {relatedDestinations.map(relatedTour => (
                    <Link key={relatedTour.id} href={`/destination/${relatedTour.id}`}>
                      <div className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                        <div className="relative w-20 h-20">
                          <Image 
                            src={relatedTour.image} 
                            alt={relatedTour.title} 
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{relatedTour.title}</h4>
                          <p className="text-sm text-gray-500">{relatedTour.location}</p>
                          <p className="text-sm font-medium text-brand-primary">{relatedTour.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton phoneNumber="6282236037774" />
    </div>
  );
}