import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Users } from "lucide-react";

interface FacilityCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
  sport: string;
  availability: string;
  maxPlayers: number;
}

const FacilityCard = ({
  name,
  location,
  image,
  rating,
  price,
  sport,
  availability,
  maxPlayers,
}: FacilityCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-sport hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {sport}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{availability}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>Max {maxPlayers}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            <span className="text-muted-foreground text-sm">/hour</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gradient-energy shadow-energy hover:shadow-energy/80 transition-shadow">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;