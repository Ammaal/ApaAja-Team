import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  seatClass: "Executive" | "Business" | "Economy" | string;
  maxSeats: number;
  onSeatsSelected: (seats: string[]) => void;
  legId?: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  seatClass,
  maxSeats,
  onSeatsSelected,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const seats = useMemo(() => {
    const rows = seatClass === "Executive" ? 8 : seatClass === "Business" ? 10 : 12;
    const cols = 4;
    const generatedSeats: { id: string; status: "available" | "occupied" }[] = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seatId = `${row}${String.fromCharCode(65 + col)}`;
        // Randomly mark some seats as occupied for demo
        const isOccupied = Math.random() > 0.7;
        generatedSeats.push({
          id: seatId,
          status: isOccupied ? "occupied" : "available",
        });
      }
    }
    return generatedSeats;
  }, [seatClass]);


  const handleSeatClick = (seatId: string, status: string) => {
    if (status === "occupied") return;

    let newSelectedSeats: string[];
    if (selectedSeats.includes(seatId)) {
      newSelectedSeats = selectedSeats.filter((s) => s !== seatId);
    } else {
      if (selectedSeats.length >= maxSeats && maxSeats > 0) {
        // If max seats are already selected, replace the first one in the list (FIFO)
        newSelectedSeats = [...selectedSeats.slice(1), seatId];
      } else {
        newSelectedSeats = [...selectedSeats, seatId];
      }
    }

    setSelectedSeats(newSelectedSeats);
    onSeatsSelected(newSelectedSeats);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Select Your Seats</h3>
        <Badge variant="secondary">
          {selectedSeats.length} / {maxSeats} selected
        </Badge>
      </div>

      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary border rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground border rounded flex items-center justify-center">
            ✓
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted border rounded opacity-50" />
          <span>Occupied</span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {seats.map((seat) => (
            <Button
              key={seat.id}
              variant={selectedSeats.includes(seat.id) ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-10",
                seat.status === "occupied" && "opacity-50 cursor-not-allowed bg-muted",
                selectedSeats.includes(seat.id) && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleSeatClick(seat.id, seat.status)}
              disabled={seat.status === "occupied"}
            >
              {seat.id}
            </Button>
          ))}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm font-semibold mb-2">Selected Seats:</p>
          <p className="text-sm">{selectedSeats.join(", ")}</p>
        </div>
      )}
    </Card>
  );
};

export default SeatSelection;