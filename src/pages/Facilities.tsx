import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FacilityCard from "@/components/FacilityCard";
import { Search, Filter, MapPin } from "lucide-react";

// Mock data - in real app this would come from your backend/API
const mockFacilities = [
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
  {
    id: "4",
    name: "Power Basketball Court",
    location: "Whitefield, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.7,
    price: 700,
    sport: "Basketball",
    availability: "5 AM - 10 PM",
    maxPlayers: 10,
  },
  {
    id: "5",
    name: "Dream Cricket Ground",
    location: "Electronic City, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.5,
    price: 2000,
    sport: "Cricket",
    availability: "6 AM - 8 PM",
    maxPlayers: 22,
  },
  {
    id: "6",
    name: "Shuttle Express",
    location: "Jayanagar, Bangalore",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    rating: 4.4,
    price: 750,
    sport: "Badminton",
    availability: "8 AM - 11 PM",
    maxPlayers: 4,
  },
];

const Facilities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [sortBy, setSortBy] = useState("");

  const sports = ["Badminton", "Football", "Tennis", "Basketball", "Cricket"];

  const filteredFacilities = mockFacilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !selectedSport || facility.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Discover Amazing{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Sports Facilities
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find and book premium sports facilities in your area
            </p>

            {/* Search and Filters */}
            <div className="bg-card rounded-xl p-6 shadow-card-hover">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search facilities or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{filteredFacilities.length} facilities found</span>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <FacilityCard key={facility.id} {...facility} />
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No facilities found matching your criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("");
                setSortBy("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Facilities;