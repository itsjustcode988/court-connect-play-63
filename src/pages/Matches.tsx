import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchCard from "@/components/MatchCard";
import { Search, Plus, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Mock data - in real app this would come from your backend/API
const mockMatches = [
  {
    id: "1",
    title: "Weekend Badminton Fun",
    sport: "Badminton",
    location: "Elite Badminton Center, Koramangala",
    date: "Today",
    time: "6:00 PM - 8:00 PM",
    organizer: {
      name: "Rahul Sharma",
      avatar: "",
    },
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
    organizer: {
      name: "Priya Singh",
      avatar: "",
    },
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
    organizer: {
      name: "Amit Kumar",
      avatar: "",
    },
    currentPlayers: 2,
    maxPlayers: 4,
    skillLevel: "Beginner",
    price: 300,
  },
  {
    id: "4",
    title: "Basketball Scrimmage",
    sport: "Basketball",
    location: "Power Basketball Court, Whitefield",
    date: "Sunday",
    time: "5:00 PM - 7:00 PM",
    organizer: {
      name: "Sneha Patel",
      avatar: "",
    },
    currentPlayers: 8,
    maxPlayers: 10,
    skillLevel: "Intermediate",
    price: 175,
  },
  {
    id: "5",
    title: "Cricket Match - Need Bowlers",
    sport: "Cricket",
    location: "Dream Cricket Ground, Electronic City",
    date: "Saturday",
    time: "2:00 PM - 6:00 PM",
    organizer: {
      name: "Vikash Yadav",
      avatar: "",
    },
    currentPlayers: 16,
    maxPlayers: 22,
    skillLevel: "Intermediate",
    price: 250,
  },
  {
    id: "6",
    title: "Casual Badminton Evening",
    sport: "Badminton",
    location: "Shuttle Express, Jayanagar",
    date: "Friday",
    time: "7:30 PM - 9:30 PM",
    organizer: {
      name: "Anita Raj",
      avatar: "",
    },
    currentPlayers: 4,
    maxPlayers: 4,
    skillLevel: "Beginner",
    price: 225,
  },
];

const Matches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useLocalStorage("match-sport-filter", "all");
  const [skillLevel, setSkillLevel] = useLocalStorage("match-skill-filter", "all");
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const sports = ["Badminton", "Football", "Tennis", "Basketball", "Cricket"];
  const skillLevels = ["Beginner", "Intermediate", "Advanced"];

  const filteredMatches = useMemo(() => {
    return mockMatches.filter((match) => {
      const matchesSearch = match.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           match.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesSport = !selectedSport || selectedSport === "all" || match.sport === selectedSport;
      const matchesSkill = !skillLevel || skillLevel === "all" || match.skillLevel === skillLevel;
      return matchesSearch && matchesSport && matchesSkill;
    });
  }, [debouncedSearchTerm, selectedSport, skillLevel]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Join Amazing{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Sports Matches
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with players and join matches in your area
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gradient-energy shadow-energy">
                <Plus className="h-5 w-5 mr-2" />
                Create New Match
              </Button>
              <Button variant="outline" size="lg">
                <Users className="h-5 w-5 mr-2" />
                Find Playing Partners
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-card rounded-xl p-6 shadow-card-hover">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search matches or locations..."
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
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {skillLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
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
            <Users className="h-4 w-4" />
            <span>{filteredMatches.length} matches available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No matches found matching your criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("all");
                setSkillLevel("all");
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

export default Matches;