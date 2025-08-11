import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-sports.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sports facilities and active players"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Sports Match
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book premium sports facilities and connect with players in your area. 
            From badminton courts to football turfs - your next game awaits.
          </p>

          {/* Search Section */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-card-hover mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter location"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sport type"
                  className="pl-10"
                />
              </div>
            </div>
            <Button size="lg" className="w-full bg-gradient-energy shadow-energy hover:shadow-energy/80 transition-shadow">
              <Search className="h-5 w-5 mr-2" />
              Find Facilities & Matches
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">10k+</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">50k+</div>
              <div className="text-sm text-muted-foreground">Matches Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-field-green">25+</div>
              <div className="text-sm text-muted-foreground">Sports</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;