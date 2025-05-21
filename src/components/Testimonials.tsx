
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Australia",
    text: "Our Bali tour with Sama Sama was absolutely amazing! The guide was knowledgeable and accommodating. We explored hidden beaches and authentic local restaurants that we would never have found on our own.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80",
    rating: 5,
  },
  {
    id: 2,
    name: "David Chen",
    location: "Singapore",
    text: "Raja Ampat was a dream destination for me, and Sama Sama Tour made it perfect. The diving spots were incredible, accommodations were comfortable, and everything was well organized.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "United Kingdom",
    text: "Our Yogyakarta cultural tour exceeded expectations. Watching the sunrise at Borobudur was magical. Our guide was passionate and informative about the history and culture of each site.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80",
    rating: 4,
  },
];

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
  testimonial: typeof testimonials[0];
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <StarRating rating={testimonial.rating} />
      <p className="mt-4 text-gray-600 italic">"{testimonial.text}"</p>
      <div className="flex items-center mt-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div className="text-left">
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
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
