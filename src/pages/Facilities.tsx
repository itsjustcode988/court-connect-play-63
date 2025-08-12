import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FacilityCard from "@/components/FacilityCard";
import { Search, Filter, MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const Facilities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useLocalStorage("facility-sport-filter", "all");
  const [sortBy, setSortBy] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const sports = ["badminton", "football", "tennis", "basketball", "cricket", "volleyball", "swimming"];

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading facilities:', error);
        toast.error('Failed to load facilities');
      } else {
        setFacilities(data || []);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = useMemo(() => {
    let filtered = facilities.filter((facility: any) => {
      const matchesSearch = facility.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           facility.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesSport = !selectedSport || selectedSport === "all" || facility.sport === selectedSport;
      return matchesSearch && matchesSport;
    });

    // Apply sorting
    if (sortBy === "rating") {
      filtered = filtered.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price-low") {
      filtered = filtered.sort((a: any, b: any) => a.price_per_hour - b.price_per_hour);
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a: any, b: any) => b.price_per_hour - a.price_per_hour);
    }

    return filtered;
  }, [facilities, debouncedSearchTerm, selectedSport, sortBy]);

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
                      <SelectItem value="all">All Sports</SelectItem>
                      {sports.map((sport) => (
                        <SelectItem key={sport} value={sport} className="capitalize">
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility: any) => (
              <FacilityCard 
                key={facility.id} 
                id={facility.id}
                name={facility.name}
                location={facility.location}
                image={facility.image_url || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"}
                rating={4.5} // Default rating since we don't have reviews yet
                price={facility.price_per_hour}
                sport={facility.sport}
                availability="Open" // Simplified for now
                maxPlayers={facility.sport === 'cricket' || facility.sport === 'football' ? 22 : 4}
              />
            ))}
          </div>
        )}

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
                setSelectedSport("all");
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