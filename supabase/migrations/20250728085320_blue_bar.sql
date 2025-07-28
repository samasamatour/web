/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `text` (text)
      - `avatar` (text)
      - `rating` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  text text NOT NULL,
  avatar text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO testimonials (name, location, text, avatar, rating) VALUES
('Sarah Johnson', 'Australia', 'Our Bali tour with Sama Sama was absolutely amazing! The guide was knowledgeable and accommodating. We explored hidden beaches and authentic local restaurants that we would never have found on our own.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80', 5),
('David Chen', 'Singapore', 'Raja Ampat was a dream destination for me, and Sama Sama Tour made it perfect. The diving spots were incredible, accommodations were comfortable, and everything was well organized.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80', 5),
('Emma Wilson', 'United Kingdom', 'Our Yogyakarta cultural tour exceeded expectations. Watching the sunrise at Borobudur was magical. Our guide was passionate and informative about the history and culture of each site.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80', 4);