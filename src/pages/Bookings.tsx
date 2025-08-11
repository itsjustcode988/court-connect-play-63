import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Phone, MessageCircle } from "lucide-react";

// Mock data for user bookings
const mockBookings = {
  upcoming: [
    {
      id: "1",
      type: "facility",
      facilityName: "Elite Badminton Center",
      sport: "Badminton",
      date: "Today",
      time: "6:00 PM - 8:00 PM",
      location: "Koramangala, Bangalore",
      court: "Court 2",
      price: 800,
      status: "confirmed",
    },
    {
      id: "2",
      type: "match",
      matchTitle: "Weekend Football Fun",
      sport: "Football",
      date: "Tomorrow",
      time: "7:00 AM - 8:30 AM",
      location: "Champions Football Turf, Indiranagar",
      organizer: "Priya Singh",
      players: "18/22",
      price: 150,
      status: "confirmed",
    },
  ],
  past: [
    {
      id: "3",
      type: "facility",
      facilityName: "Ace Tennis Academy",
      sport: "Tennis",
      date: "Yesterday",
      time: "8:00 AM - 10:00 AM",
      location: "HSR Layout, Bangalore",
      court: "Court 1",
      price: 600,
      status: "completed",
    },
    {
      id: "4",
      type: "match",
      matchTitle: "Basketball Scrimmage",
      sport: "Basketball",
      date: "Last Sunday",
      time: "5:00 PM - 7:00 PM",
      location: "Power Basketball Court, Whitefield",
      organizer: "Sneha Patel",
      players: "10/10",
      price: 175,
      status: "completed",
    },
  ],
};

const BookingCard = ({ booking }: { booking: any }) => {
  const isUpcoming = booking.status === "confirmed";
  
  return (
    <Card className="group transition-all duration-300 hover:shadow-card-hover bg-gradient-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {booking.sport}
            </Badge>
            <CardTitle className="text-lg">
              {booking.type === "facility" ? booking.facilityName : booking.matchTitle}
            </CardTitle>
          </div>
          <Badge 
            variant={booking.status === "confirmed" ? "default" : "secondary"}
            className={booking.status === "confirmed" ? "bg-primary" : ""}
          >
            {booking.status === "confirmed" ? "Confirmed" : "Completed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{booking.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{booking.time}</span>
          </div>
        </div>

        {booking.type === "facility" && booking.court && (
          <div className="text-sm text-muted-foreground">
            <strong>Court:</strong> {booking.court}
          </div>
        )}

        {booking.type === "match" && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <strong>Organizer:</strong> {booking.organizer}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{booking.players} players</span>
            </div>
          </div>
        )}

        <div className="text-lg font-semibold text-primary">
          ₹{booking.price} {booking.type === "match" ? "per person" : "total"}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isUpcoming ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button variant="destructive" size="sm">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1">
              Book Again
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Rate & Review
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const Bookings = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              My{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your facility bookings and match participations
            </p>
          </div>
        </div>
      </section>

      {/* Bookings Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({mockBookings.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Past ({mockBookings.past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {mockBookings.upcoming.length > 0 ? (
                <div className="grid gap-6">
                  {mockBookings.upcoming.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No upcoming bookings
                  </p>
                  <Button className="bg-gradient-energy shadow-energy">
                    Browse Facilities
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {mockBookings.past.length > 0 ? (
                <div className="grid gap-6">
                  {mockBookings.past.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No past bookings found
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Bookings;