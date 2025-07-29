'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WhatsApp } from "./WhatsAppButton";
import { ArrowRight, CarFront } from "lucide-react";
import { Destination } from "@/types/database";
import Image from "next/image";

// Car rental options
const carOptions = [
  {
    id: "avanza",
    name: "Toyota Avanza",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    price: "Rp 500.000",
    passengers: 7,
    transmission: "Manual",
    ac: true,
    luggage: 3
  },
  {
    id: "innova",
    name: "Toyota Innova",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    price: "Rp 700.000",
    passengers: 7,
    transmission: "Automatic",
    ac: true,
    luggage: 4
  },
  {
    id: "hiace",
    name: "Toyota HiAce",
    image: "https://images.unsplash.com/photo-1545974452-caa213f76132?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    price: "Rp 1.200.000",
    passengers: 12,
    transmission: "Manual",
    ac: true,
    luggage: 8
  },
  {
    id: "alphard",
    name: "Toyota Alphard",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    price: "Rp 2.000.000",
    passengers: 7,
    transmission: "Automatic",
    ac: true,
    luggage: 4
  }
];

interface CarRentalProps {
  destination: Destination;
}

const CarRental = ({ destination }: CarRentalProps) => {
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  
  const toggleSelect = (carId: string) => {
    if (selectedCar === carId) {
      setSelectedCar(null);
    } else {
      setSelectedCar(carId);
    }
  };

  const getWhatsAppMessage = (carName: string, price: string) => {
    return encodeURIComponent(
      `Hello, I'm interested in renting a ${carName} (${price}/day) for my trip to ${destination.location} (${destination.title}). Could you provide more information?`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-primary/10 p-2 rounded-full">
          <CarFront className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold">Car Rental Options</h2>
      </div>
      
      <p className="text-gray-700 mb-6">
        Enhance your travel experience by renting a comfortable car with a driver. All prices are per day and include fuel and driver.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carOptions.map((car) => (
          <Card 
            key={car.id} 
            className={`overflow-hidden transition-all duration-300 hover:shadow-md ${selectedCar === car.id ? 'ring-2 ring-brand-primary' : ''}`}
          >
            <div className="aspect-video overflow-hidden relative">
              <Image 
                src={car.image} 
                alt={car.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{car.name}</h3>
                <span className="text-brand-primary font-semibold">{car.price}/day</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{car.passengers} Passengers</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>{car.ac ? 'AC Available' : 'No AC'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{car.luggage} Luggage</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={() => toggleSelect(car.id)}
                className={selectedCar === car.id ? "bg-brand-primary text-white border-brand-primary" : ""}
              >
                {selectedCar === car.id ? 'Selected' : 'Select'}
              </Button>
              <WhatsApp
                phoneNumber="6282236037774"
                message={getWhatsAppMessage(car.name, car.price)}
              >
                Inquire <ArrowRight className="h-4 w-4" />
              </WhatsApp>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarRental;