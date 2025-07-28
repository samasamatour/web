"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Testimonial } from "@/types/database";
import Image from "next/image";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < rating ? "#F4A261" : "#D1D5DB"}
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: Testimonial;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <StarRating rating={testimonial.rating} />
      <p className="mt-4 text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
      <div className="flex items-center mt-6">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="rounded-full object-cover"
            sizes="48px"
          />
        </div>
        <div className="text-left">
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data || []);
      }
      
      setLoading(false);
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Read genuine reviews from our satisfied clients who have experienced
              our tours firsthand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-5 h-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Read genuine reviews from our satisfied clients who have experienced
            our tours firsthand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;