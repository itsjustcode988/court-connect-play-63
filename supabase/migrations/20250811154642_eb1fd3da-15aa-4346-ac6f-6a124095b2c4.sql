-- Create enum types for better data consistency
CREATE TYPE public.sport_type AS ENUM ('badminton', 'tennis', 'football', 'cricket', 'basketball', 'squash', 'table_tennis');
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'professional');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.match_status AS ENUM ('open', 'full', 'in_progress', 'completed', 'cancelled');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  preferred_sports sport_type[],
  skill_level skill_level DEFAULT 'beginner',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create facilities table
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sport sport_type NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL, -- in cents
  image_url TEXT,
  amenities TEXT[],
  operating_hours JSONB, -- {start: "06:00", end: "22:00"}
  contact_info JSONB, -- {phone: "...", email: "..."}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price INTEGER NOT NULL, -- in cents
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure no overlapping bookings for the same facility
  CONSTRAINT no_overlapping_bookings UNIQUE (facility_id, booking_date, start_time, end_time)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  sport sport_type NOT NULL,
  skill_level skill_level NOT NULL,
  location TEXT NOT NULL,
  match_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_players INTEGER NOT NULL CHECK (max_players > 0),
  price_per_person INTEGER NOT NULL DEFAULT 0, -- in cents
  status match_status DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match participants table
CREATE TABLE public.match_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(match_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Facilities policies (public read access)
CREATE POLICY "Everyone can view facilities" ON public.facilities
  FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Everyone can view open matches" ON public.matches
  FOR SELECT USING (true);

CREATE POLICY "Users can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their matches" ON public.matches
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their matches" ON public.matches
  FOR DELETE USING (auth.uid() = organizer_id);

-- Match participants policies
CREATE POLICY "Everyone can view match participants" ON public.match_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join matches" ON public.match_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave matches" ON public.match_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_facilities_sport ON public.facilities(sport);
CREATE INDEX idx_facilities_location ON public.facilities(location);
CREATE INDEX idx_bookings_user_date ON public.bookings(user_id, booking_date);
CREATE INDEX idx_bookings_facility_date ON public.bookings(facility_id, booking_date);
CREATE INDEX idx_matches_sport_date ON public.matches(sport, match_date);
CREATE INDEX idx_matches_location_date ON public.matches(location, match_date);
CREATE INDEX idx_match_participants_match ON public.match_participants(match_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample facilities data
INSERT INTO public.facilities (name, description, sport, location, address, price_per_hour, image_url, amenities) VALUES
('Elite Badminton Club', 'Premium badminton courts with professional lighting', 'badminton', 'Mumbai', '123 Sports Complex, Bandra West, Mumbai', 800, '/placeholder.svg', ARRAY['AC', 'Parking', 'Changing Rooms', 'Equipment Rental']),
('Champions Tennis Academy', 'Professional tennis courts for all skill levels', 'tennis', 'Delhi', '456 Tennis Lane, CP, New Delhi', 1200, '/placeholder.svg', ARRAY['Floodlights', 'Coaching Available', 'Pro Shop', 'Parking']),
('Victory Football Ground', 'Full-size football field with quality turf', 'football', 'Bangalore', '789 Sports Avenue, Koramangala, Bangalore', 2000, '/placeholder.svg', ARRAY['Changing Rooms', 'Parking', 'Refreshments', 'Seating']),
('Ace Cricket Ground', 'Professional cricket ground with nets', 'cricket', 'Chennai', '321 Cricket Road, T. Nagar, Chennai', 1500, '/placeholder.svg', ARRAY['Nets', 'Equipment', 'Parking', 'Scorer']);