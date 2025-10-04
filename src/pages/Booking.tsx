import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SeatSelection from "@/components/SeatSelection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, Calendar, Users } from "lucide-react";

interface Passenger {
  name: string;
  idNumber: string;
}

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const passengers = parseInt(searchParams.get("passengers") || "1");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengersInfo, setPassengersInfo] = useState<Passenger[]>(
    Array.from({ length: passengers }, () => ({ name: "", idNumber: "" }))
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const trainId = searchParams.get("train");
  const origin = searchParams.get("origin") || "Jakarta";
  const destination = searchParams.get("destination") || "Surabaya";
  const date = searchParams.get("date") || "2025-10-15";

  // Mock train data (in real app, fetch by trainId)
  const train = {
    name: "Argo Bromo Anggrek",
    type: "Executive",
    departure: "08:00",
    arrival: "16:30",
    price: 350000,
  };

  const totalPrice = train.price * passengers;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  const handlePassengerInfoChange = (index: number, field: keyof Passenger, value: string) => {
    const newPassengersInfo = [...passengersInfo];
    newPassengersInfo[index][field] = value;
    setPassengersInfo(newPassengersInfo);
  };

  const handleBooking = () => {
    if (selectedSeats.length !== passengers) {
      alert(`Please select ${passengers} seat(s) to continue.`);
      return;
    }

    for (const passenger of passengersInfo) {
      if (!passenger.name || !passenger.idNumber) {
        alert("Please fill in all passenger names and ID numbers.");
        return;
      }
    }

    const queryParams = new URLSearchParams({
      origin: origin,
      destination: destination,
      date: date,
      passengers: passengers.toString(),
      class: train.type,
      seats: selectedSeats.join(", "),
      ...passengersInfo.reduce((acc, passenger, index) => ({
        ...acc,
        [`p${index}_name`]: passenger.name,
        [`p${index}_id`]: passenger.idNumber,
      }), {})
    });
    navigate(`/checkout?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Review your details and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Details */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Journey Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Train className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{train.name}</h3>
                    <p className="text-sm text-muted-foreground">{train.type} Class</p>
                  </div>
                  <Badge className="ml-auto bg-success">Confirmed Seats</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold">{origin}</p>
                      <p className="text-sm">{train.departure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="font-semibold">{destination}</p>
                      <p className="text-sm">{train.arrival}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-semibold">
                        {new Date(date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Passengers</p>
                      <p className="font-semibold">{passengers}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Passenger Information</h2>
              <div className="space-y-4">
                {Array.from({ length: passengers }).map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`name-${index}`}>Full Name</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={passengersInfo[index].name}
                          onChange={(e) => handlePassengerInfoChange(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`id-${index}`}>ID Number</Label>
                        <Input
                          id={`id-${index}`}
                          placeholder="Enter ID number"
                          value={passengersInfo[index].idNumber}
                          onChange={(e) => handlePassengerInfoChange(index, "idNumber", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Seat Selection */}
            <SeatSelection
              seatClass={train.type}
              maxSeats={passengers}
              onSeatsSelected={setSelectedSeats}
            />

            <Button
              onClick={handleBooking}
              size="lg"
              className="w-full"
              disabled={selectedSeats.length !== passengers || passengersInfo.some(p => !p.name || !p.idNumber)}
            >
              Continue to Payment
            </Button>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Ticket Price ({passengers}x)</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax & Service</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">Rp {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {selectedSeats.length !== passengers && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Please select {passengers} seat(s) to continue
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;