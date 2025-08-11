import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Building, Smartphone, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingDetails {
  id: string;
  type: "facility" | "match";
  name: string;
  sport: string;
  date: string;
  time: string;
  location: string;
  price: number;
  duration?: string;
  players?: string;
}

// Mock booking data - in real app, this would come from the database
const mockBookingData: Record<string, BookingDetails> = {
  "facility-1": {
    id: "facility-1",
    type: "facility",
    name: "Elite Badminton Center",
    sport: "Badminton",
    date: "Today",
    time: "6:00 PM - 8:00 PM",
    location: "Koramangala, Bangalore",
    price: 800,
    duration: "2 hours",
  },
  "match-1": {
    id: "match-1",
    type: "match",
    name: "Weekend Football Fun",
    sport: "Football",
    date: "Tomorrow",
    time: "7:00 AM - 8:30 AM",
    location: "Champions Football Turf, Indiranagar",
    price: 150,
    players: "18/22",
  },
};

const Checkout = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const booking = bookingId ? mockBookingData[bookingId] : null;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Booking not found</p>
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to complete payment");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          amount: booking.price * 100, // Convert to cents
          currency: "inr",
          status: "pending",
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // In a real app, you would integrate with a payment gateway here
      // For demo purposes, we'll simulate a successful payment
      setTimeout(async () => {
        // Update order status
        await supabase
          .from("orders")
          .update({ status: "completed" })
          .eq("id", order.id);

        toast.success("Payment successful! Booking confirmed.");
        navigate("/bookings");
      }, 2000);

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const platformFee = Math.ceil(booking.price * 0.05); // 5% platform fee
  const total = booking.price + platformFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              Complete{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Payment
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-4 w-4" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Building className="h-4 w-4" />
                      <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                        Net Banking
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details (shown when card is selected) */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-muted-foreground">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {booking.sport}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{booking.type}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span>{booking.date}, {booking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-right">{booking.location}</span>
                    </div>
                    {booking.duration && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{booking.duration}</span>
                      </div>
                    )}
                    {booking.players && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Players:</span>
                        <span>{booking.players}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {booking.type === "facility" ? "Facility booking" : "Match fee"}
                    </span>
                    <span>₹{booking.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-energy shadow-energy"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${total}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By completing this payment, you agree to our Terms & Conditions
                  and Cancellation Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;