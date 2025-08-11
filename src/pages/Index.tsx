import Hero from "@/components/Hero";
import FacilityCard from "@/components/FacilityCard";
import MatchCard from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Featured facilities and matches
const featuredFacilities = [
  {
    id: "1",
    name: "Elite Badminton Center",
    location: "Koramangala, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.8,
    price: 800,
    sport: "Badminton",
    availability: "9 AM - 10 PM",
    maxPlayers: 4,
  },
  {
    id: "2",
    name: "Champions Football Turf",
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.6,
    price: 1200,
    sport: "Football",
    availability: "6 AM - 11 PM",
    maxPlayers: 22,
  },
  {
    id: "3",
    name: "Ace Tennis Academy",
    location: "HSR Layout, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.9,
    price: 600,
    sport: "Tennis",
    availability: "7 AM - 9 PM",
    maxPlayers: 4,
  },
];

const featuredMatches = [
  {
    id: "1",
    title: "Weekend Badminton Fun",
    sport: "Badminton",
    location: "Elite Badminton Center, Koramangala",
    date: "Today",
    time: "6:00 PM - 8:00 PM",
    organizer: { name: "Rahul Sharma", avatar: "" },
    currentPlayers: 3,
    maxPlayers: 4,
    skillLevel: "Intermediate",
    price: 200,
  },
  {
    id: "2",
    title: "Morning Football Match",
    sport: "Football",
    location: "Champions Football Turf, Indiranagar",
    date: "Tomorrow",
    time: "7:00 AM - 8:30 AM",
    organizer: { name: "Priya Singh", avatar: "" },
    currentPlayers: 18,
    maxPlayers: 22,
    skillLevel: "Advanced",
    price: 150,
  },
  {
    id: "3",
    title: "Tennis Singles Practice",
    sport: "Tennis",
    location: "Ace Tennis Academy, HSR Layout",
    date: "Today",
    time: "8:00 AM - 10:00 AM",
    organizer: { name: "Amit Kumar", avatar: "" },
    currentPlayers: 2,
    maxPlayers: 4,
    skillLevel: "Beginner",
    price: 300,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                PlayON
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The ultimate platform for sports enthusiasts to connect, play, and enjoy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-card shadow-card-hover">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book facilities instantly with real-time availability and confirmed reservations
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card shadow-card-hover">
              <div className="w-16 h-16 bg-gradient-energy rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Players</h3>
              <p className="text-muted-foreground">
                Connect with like-minded players and join matches based on your skill level
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card shadow-card-hover">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">
                Verified facilities and secure payments ensure a safe sporting experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Facilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Facilities</h2>
              <p className="text-muted-foreground">Premium sports venues near you</p>
            </div>
            <Link to="/facilities">
              <Button variant="outline">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFacilities.map((facility) => (
              <FacilityCard key={facility.id} {...facility} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Matches */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Matches</h2>
              <p className="text-muted-foreground">Join exciting games happening now</p>
            </div>
            <Link to="/matches">
              <Button variant="outline">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMatches.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Play ON?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of players who have found their perfect game. 
              Book facilities, create matches, and connect with your sports community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-energy shadow-energy">
                Start Playing Today
              </Button>
              <Button variant="outline" size="lg">
                Download Mobile App
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
