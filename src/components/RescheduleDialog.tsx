import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Order } from "@/data/orders";

interface RescheduleDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (orderId: string, newDate: string, newTime: string) => void;
}

const RescheduleDialog = ({
  order,
  isOpen,
  onClose,
  onReschedule,
}: RescheduleDialogProps) => {
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (order) {
      setNewDate(new Date(order.date));
      setNewTime(order.time);
    }
  }, [order]);

  const handleConfirm = () => {
    if (order && newDate) {
      const year = newDate.getFullYear();
      const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
      const day = newDate.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onReschedule(order.id, formattedDate, newTime);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Your Trip</DialogTitle>
          <DialogDescription>
            Select a new date and time for your journey.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">New Date</label>
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <label htmlFor="time" className="text-sm font-medium">
              New Time
            </label>
            <Input
              id="time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;