import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

interface MatchCardProps {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  currentPlayers: number;
  maxPlayers: number;
  skillLevel: string;
  price: number;
}

const MatchCard = ({
  title,
  sport,
  location,
  date,
  time,
  organizer,
  currentPlayers,
  maxPlayers,
  skillLevel,
  price,
}: MatchCardProps) => {
  const spotsLeft = maxPlayers - currentPlayers;
  const isAlmostFull = spotsLeft <= 2;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-sport hover:-translate-y-1 bg-gradient-card border-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/20 text-primary">
              {sport}
            </Badge>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          {isAlmostFull && (
            <Badge variant="destructive" className="text-xs">
              Almost Full
            </Badge>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={organizer.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {organizer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">by {organizer.name}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {skillLevel}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="font-medium">{currentPlayers}/{maxPlayers}</span>
            <span className="text-muted-foreground ml-1">players</span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary">₹{price}</span>
            <span className="text-muted-foreground text-xs">/person</span>
          </div>
        </div>

        {/* Progress bar for player slots */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className="bg-gradient-hero h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPlayers / maxPlayers) * 100}%` }}
          />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-gradient-energy shadow-energy hover:shadow-energy/80 transition-shadow"
          disabled={spotsLeft === 0}
        >
          {spotsLeft === 0 ? "Match Full" : `Join Match (${spotsLeft} spots left)`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;