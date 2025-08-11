import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Phone, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigate, Link } from "react-router-dom";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  facility?: {
    name: string;
    location: string;
    sport: string;
  };
  match?: {
    title: string;
    sport: string;
    location: string;
    organizer: {
      display_name: string;
    };
    current_participants: number;
    max_players: number;
    price_per_person: number;
  };
}

const BookingCard = ({ booking }: { booking: Booking }) => {
  const isUpcoming = booking.status === "confirmed" || booking.status === "pending";
  const bookingDate = new Date(booking.booking_date);
  const isToday = bookingDate.toDateString() === new Date().toDateString();
  const isTomorrow = bookingDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  const formatDate = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return bookingDate.toLocaleDateString();
  };

  const formatTime = () => {
    return `${booking.start_time} - ${booking.end_time}`;
  };
  
  return (
    <Card className="group transition-all duration-300 hover:shadow-card-hover bg-gradient-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {booking.facility?.sport || booking.match?.sport}
            </Badge>
            <CardTitle className="text-lg">
              {booking.facility?.name || booking.match?.title}
            </CardTitle>
          </div>
          <Badge 
            variant={booking.status === "confirmed" ? "default" : booking.status === "pending" ? "secondary" : "outline"}
            className={booking.status === "confirmed" ? "bg-primary" : ""}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{booking.facility?.location || booking.match?.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate()}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatTime()}</span>
          </div>
        </div>

        {booking.match && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <strong>Organizer:</strong> {booking.match.organizer.display_name}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{booking.match.current_participants}/{booking.match.max_players} players</span>
            </div>
          </div>
        )}

        <div className="text-lg font-semibold text-primary">
          ₹{booking.total_price} {booking.match ? "per person" : "total"}
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
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          facilities (
            name,
            location,
            sport
          )
        `)
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today && (booking.status === 'confirmed' || booking.status === 'pending');
  });

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today || booking.status === 'completed' || booking.status === 'cancelled';
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

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
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingBookings.length > 0 ? (
                <div className="grid gap-6">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No upcoming bookings
                  </p>
                  <Button className="bg-gradient-energy shadow-energy" asChild>
                    <Link to="/facilities">Browse Facilities</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastBookings.length > 0 ? (
                <div className="grid gap-6">
                  {pastBookings.map((booking) => (
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