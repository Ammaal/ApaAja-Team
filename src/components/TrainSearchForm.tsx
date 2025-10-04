import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const TrainSearchForm = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search-results?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}`);
  };

  return (
    <Card className="p-6 shadow-xl">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Origin Station
            </Label>
            <Input
              id="origin"
              placeholder="e.g., Jakarta"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Destination Station
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Surabaya"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Travel Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Passengers
            </Label>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="8"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full">
          <Search className="mr-2 h-5 w-5" />
          Search Trains
        </Button>
      </form>
    </Card>
  );
};

export default TrainSearchForm;
