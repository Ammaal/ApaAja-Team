import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, ArrowRight, Users, DollarSign, MapPin, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

// Matches the backend structure for alternative routes
export interface RouteLeg {
  id: string;
  from: string;
  to: string;
  trainName: string;
  category: string;
  duration: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  date: string;
}

export interface AlternativeRoute {
  id: string;
  route: string;
  totalDuration: string;
  transfers: number;
  totalPrice: number;
  legs: RouteLeg[];
}

// Matches the backend structure for direct routes
export interface DirectRoute {
  train_id: string;
  train_name: string;
  train_type: string;
  departure: { station_code: string; station_name: string; city: string; time: string; };
  arrival: { station_code: string; station_name: string; city: string; time: string; };
  duration: string;
  price: number;
  available_seats: number;
  date: string;
}


const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const [directRoutes, setDirectRoutes] = useState<DirectRoute[]>([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState<AlternativeRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [trainClass, setTrainClass] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);


  useEffect(() => {
    const fetchRoutes = async () => {
      if (!origin || !destination || !date) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/search-routes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ origin, destination, date }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }
        const data = await response.json();

        // Add unique IDs to alternative routes for rendering
        const alternativesWithIds = (data.alternative_routes || []).map((route: Omit<AlternativeRoute, 'id'>) => ({
          ...route,
          id: crypto.randomUUID(),
          legs: route.legs.map((leg: Omit<RouteLeg, 'id'>) => ({
            ...leg,
            id: crypto.randomUUID(),
          })),
        }));

        setDirectRoutes(data.direct_routes || []);
        setAlternativeRoutes(alternativesWithIds);

      } catch (error) {
        console.error("Error fetching routes:", error);
        setDirectRoutes([]);
        setAlternativeRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [origin, destination, date]);

  // Filter direct routes based on class and price
  const filteredDirectRoutes = directRoutes.filter((train) => {
    const classMatch = trainClass === "all" || train.train_type === trainClass;
    const priceMatch = train.price >= priceRange[0] && train.price <= priceRange[1];
    return classMatch && priceMatch;
  });

  if (!origin || !destination || !date) {
      return (
          <div className="min-h-screen bg-background">
              <Navbar />
              <div className="container mx-auto px-4 py-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Invalid Search</h2>
                  <p>Please go back to the homepage and start a new search.</p>
                  <Link to="/">
                      <Button variant="hero" className="mt-4">Go to Homepage</Button>
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold">{origin}</span>
              <ArrowRight className="h-4 w-4" />
              <span className="font-semibold">{destination}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{passengers} {parseInt(passengers) === 1 ? "passenger" : "passengers"}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Train Class Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Train Class</Label>
                  <Select value={trainClass} onValueChange={setTrainClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Economy">Economy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Price Range</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={10000}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Rp {priceRange[0].toLocaleString()}</span>
                      <span>Rp {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setTrainClass("all");
                    setPriceRange([0, 1000000]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Results */}
          <div className="lg:col-span-2 space-y-4">
             {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Available Trains</h2>
                        <p className="text-sm text-muted-foreground">
                            {filteredDirectRoutes.length} train{filteredDirectRoutes.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    {filteredDirectRoutes.length > 0 ? (
                        filteredDirectRoutes.map((train) => (
                            <Card key={train.train_id} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Train className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{train.train_name}</h3>
                                            <p className="text-sm text-muted-foreground">{train.train_type} Class</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Departure</p>
                                        <p className="text-xl font-bold">{train.departure.time}</p>
                                        <p className="text-xs text-muted-foreground">{train.departure.station_name}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Duration</p>
                                        <div className="flex items-center justify-center gap-2 my-1">
                                            <div className="h-1 flex-1 bg-primary/20 rounded" />
                                            <Clock className="h-4 w-4 text-primary" />
                                            <div className="h-1 flex-1 bg-primary/20 rounded" />
                                        </div>
                                        <p className="text-sm font-semibold">{train.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Arrival</p>
                                        <p className="text-xl font-bold">{train.arrival.time}</p>
                                        <p className="text-xs text-muted-foreground">{train.arrival.station_name}</p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-2xl font-bold text-accent">
                                                Rp {train.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{train.available_seats} seats left</span>
                                        </div>
                                    </div>
                                    <Link to={`/booking?route=${encodeURIComponent(JSON.stringify(train))}&passengers=${passengers}`}>
                                        <Button variant="hero">Book Now</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-6 text-center">
                            <p className="text-muted-foreground">No direct trains found for this route. Check the alternative routes section.</p>
                        </Card>
                    )}
                </>
            )}
          </div>

          {/* Alternative Routes Sidebar */}
           <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Alternative Routes</h3>
              {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
              ) : alternativeRoutes.length > 0 ? (
                alternativeRoutes.map((alt) => (
                  <Card key={alt.id} className="p-4 bg-secondary/50 mb-4">
                    <p className="font-bold text-md mb-2">{alt.route}</p>
                    <div className="space-y-2">
                      {alt.legs.map((leg) => (
                        <div key={leg.id} className="p-2 border rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">{leg.trainName}</p>
                            <Badge variant="outline">{leg.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{leg.from} → {leg.to}</p>
                          <div className="flex justify-between text-xs mt-1">
                            <span>{leg.duration}</span>
                            <span className="font-semibold">Rp {leg.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Duration</span>
                        <span className="font-semibold">{alt.totalDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transfers</span>
                        <span className="font-semibold">{alt.transfers}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-bold text-accent">Total Price</span>
                        <span className="font-bold text-accent text-lg">Rp {alt.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <Link to={`/alternative-booking?route=${encodeURIComponent(JSON.stringify(alt))}&passengers=${passengers}`}>
                      <Button variant="hero" size="sm" className="w-full mt-3">Book Now</Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No alternative routes found for this combination.</p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Can't find a direct train? Alternative routes might offer more options.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;