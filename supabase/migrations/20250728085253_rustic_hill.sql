/*
  # Create destinations table

  1. New Tables
    - `destinations`
      - `id` (text, primary key)
      - `title` (text)
      - `location` (text)
      - `price` (text)
      - `image` (text)
      - `description` (text)
      - `coordinates` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `destinations` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS destinations (
  id text PRIMARY KEY,
  title text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  coordinates jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to destinations"
  ON destinations
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO destinations (id, title, location, price, image, description, coordinates) VALUES
('bali', 'Bali Paradise Tour', 'Bali', 'Rp 5.500.000', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'Explore the magical island of Bali, visit sacred temples, beautiful beaches, and experience the unique culture. 5 days 4 nights package includes accommodation and transport. Visit Ubud, Kuta, Seminyak, Uluwatu Temple, and participate in traditional Balinese ceremonies. Enjoy delicious local cuisine and relax on pristine beaches with crystal clear waters.', '{"lat": -8.4095, "lng": 115.1889}'),
('lombok', 'Lombok Adventure', 'Lombok', 'Rp 4.800.000', 'https://images.unsplash.com/photo-1626331900236-8a1207c78e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'Discover the pristine beaches of Lombok and the famous Gili Islands. 4 days 3 nights package with snorkeling experience and beach activities. Explore Gili Trawangan, Gili Meno, and Gili Air with their beautiful coral reefs and marine life. Trek to Sendang Gile and Tiu Kelep waterfalls and learn about the Sasak culture.', '{"lat": -8.6500, "lng": 116.3300}'),
('yogyakarta', 'Historical Yogyakarta', 'Yogyakarta', 'Rp 3.200.000', 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'Visit the ancient temples of Borobudur and Prambanan, explore the culture of Yogyakarta. 3 days 2 nights with guided tours and cultural experiences. Walk through the Sultan''s Palace (Keraton), shop at Malioboro Road, and witness the spectacular Ramayana Ballet with Mount Merapi as backdrop. Experience the rich Javanese culture and history.', '{"lat": -7.7956, "lng": 110.3695}'),
('komodo', 'Komodo Dragon Expedition', 'Flores', 'Rp 6.900.000', 'https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'See the legendary Komodo dragons in their natural habitat, explore Pink Beach, and enjoy snorkeling in crystal clear waters. 5 days 4 nights full expedition. Trek through Rinca Island, witness spectacular views from Padar Island, and swim with manta rays. An adventure of a lifetime in one of Indonesia''s most unique national parks.', '{"lat": -8.5850, "lng": 119.4411}'),
('raja-ampat', 'Raja Ampat Diving', 'Papua', 'Rp 12.500.000', 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'Explore one of the most biodiverse marine locations in the world. 7 days 6 nights package with diving sessions, island hopping, and local experiences. Discover the underwater paradise with over 1,500 species of fish and 500 species of coral. Visit Wayag Island, Piaynemo, and the hidden gems of Misool. Perfect for divers and underwater photography enthusiasts.', '{"lat": -0.7893, "lng": 130.6695}'),
('toraja', 'Cultural Toraja', 'Sulawesi', 'Rp 4.500.000', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80', 'Experience the unique culture of Toraja, see traditional burial sites, ancient villages and beautiful landscapes. 4 days 3 nights cultural immersion. Visit Lemo Cliff Graves, Kete Kesu traditional village, and witness traditional ceremonies if available. Stay in traditional Tongkonan houses and learn about the fascinating Torajan beliefs and customs.', '{"lat": -2.8695, "lng": 119.7928}');