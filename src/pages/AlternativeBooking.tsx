import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SeatSelection from "@/components/SeatSelection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Train, MapPin } from "lucide-react";
import { toast } from "sonner";

// Define the interfaces to match the data structure from SearchResults
interface Passenger {
  name: string;
  idNumber: string;
}

interface RouteLeg {
  id: string;
  trainName:string;
  category: string;
  from: string;
  to: string;
  duration: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  date: string;
}

interface AlternativeRoute {
  id: string;
  route: string;
  totalDuration: string;
  transfers: number;
  totalPrice: number;
  legs: RouteLeg[];
  origin: string;
  destination: string;
}

const AlternativeBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [alternativeRoute, setAlternativeRoute] =
    useState<AlternativeRoute | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string[]>>(
    {}
  );
  const [passengersInfo, setPassengersInfo] = useState<Passenger[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const routeData = searchParams.get("route");
    const passengersCount = parseInt(searchParams.get("passengers") || "1");

    if (routeData) {
      try {
        const decodedRoute: AlternativeRoute = JSON.parse(decodeURIComponent(routeData));
        setAlternativeRoute(decodedRoute);
        setPassengers(passengersCount);
        setPassengersInfo(
          Array.from({ length: passengersCount }, () => ({
            name: "",
            idNumber: "",
          }))
        );
      } catch (error) {
        console.error("Failed to parse route data:", error);
      }
    }
  }, [searchParams]);

  // Use index as the legId
  const handleSeatsSelected = (legIndex: string, seats: string[]) => {
    setSelectedSeats((prev) => ({ ...prev, [legIndex]: seats }));
  };

  const handlePassengerInfoChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const newPassengersInfo = [...passengersInfo];
    newPassengersInfo[index][field] = value;
    setPassengersInfo(newPassengersInfo);
  };

  const handleBooking = async () => {
    if (!alternativeRoute) return;

    // Validation checks
    const allLegsSeatSelected = alternativeRoute.legs.every(
      (_, index) => selectedSeats[String(index)]?.length === passengers
    );

    if (!allLegsSeatSelected) {
      toast.error(`Please select ${passengers} seat(s) for each leg to continue.`);
      return;
    }

    if (passengersInfo.some((p) => !p.name || !p.idNumber)) {
      toast.error("Please fill in all passenger names and ID numbers.");
      return;
    }

    setIsBooking(true);
    const TotalPrice = alternativeRoute.totalPrice * passengers;

     const bookingData = {
      isAlternative: true, // Flag to identify alternative route booking
      route: alternativeRoute,
      passengers: passengers,
      passengersInfo: passengersInfo,
      selectedSeats: selectedSeats,
      totalPrice: TotalPrice, // Use grandTotal which includes tax
      legs: alternativeRoute.legs.map((leg, index) => ({
        ...leg,
        selectedSeats: selectedSeats[String(index)] || [],
      })),
      origin: alternativeRoute.origin,
      destination: alternativeRoute.destination,
      trainName: alternativeRoute.route, // Use the route description as a name
      price: grandTotal,
      date: alternativeRoute.legs[0]?.date, // Use the date from the first leg
    };

    try {
    navigate("/payment", { state: { bookingData } })
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsBooking(false);
    }
  };

  if (!alternativeRoute) {
    return <div className="container mx-auto p-4">Loading route details...</div>;
  }

  const totalPrice = alternativeRoute.totalPrice * passengers;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  const allSeatsSelected =
    alternativeRoute.legs.every(
      (_, index) =>
        selectedSeats[String(index)] && selectedSeats[String(index)].length === passengers
    ) && Object.keys(selectedSeats).length === alternativeRoute.legs.length;

  const allPassengerInfoFilled = passengersInfo.every(
    (p) => p.name && p.idNumber
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Complete Your Alternative Route Booking
          </h1>
          <p className="text-muted-foreground">
            Review your details for the multi-leg journey and proceed to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Journey Details</h2>
              <p className="text-lg font-semibold mb-2">
                {alternativeRoute.origin} to {alternativeRoute.destination}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>Total Duration: {alternativeRoute.totalDuration}</span>
                <span>Transfers: {alternativeRoute.transfers}</span>
              </div>
              <Separator />
              {alternativeRoute.legs.map((leg, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Train className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{leg.trainName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {leg.category} Class
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-semibold">{leg.from}</p>
                        <p className="text-sm">{leg.departureTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-semibold">{leg.to}</p>
                        <p className="text-sm">{leg.arrivalTime}</p>
                      </div>
                    </div>
                  </div>
                  {index < alternativeRoute.legs.length - 1 && (
                    <Separator className="my-4" />
                  )}
                  <h3 className="text-lg font-semibold my-4">
                    Select Seats for {leg.trainName}
                  </h3>
                  <SeatSelection
                    seatClass={leg.category || "Executive"}
                    maxSeats={passengers}
                    onSeatsSelected={(seats) => handleSeatsSelected(String(index), seats)}
                    legId={String(index)}
                  />
                </div>
              ))}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Passenger Information
              </h2>
              <div className="space-y-4">
                {Array.from({ length: passengers }).map((_, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <h3 className="font-semibold">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`name-${index}`}>Full Name</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={passengersInfo[index]?.name || ""}
                          onChange={(e) =>
                            handlePassengerInfoChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`id-${index}`}>ID Number</Label>
                        <Input
                          id={`id-${index}`}
                          placeholder="Enter ID number"
                          value={passengersInfo[index]?.idNumber || ""}
                          onChange={(e) =>
                            handlePassengerInfoChange(
                              index,
                              "idNumber",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              onClick={handleBooking}
              size="lg"
              className="w-full"
              disabled={!allSeatsSelected || !allPassengerInfoFilled || isBooking}
            >
              {isBooking ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>
                    Ticket Price ({passengers}x)
                  </span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax & Service</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">
                    Rp {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeBooking;