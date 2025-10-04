import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { mockTrains, Train } from "@/data/trains";

const TrainMonitoring = () => {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [delayInfo, setDelayInfo] = useState("");

  const handleUpdateDelay = () => {
    if (!selectedTrain) {
      toast.error("No train selected");
      return;
    }

    setTrains(
      trains.map((train) =>
        train.id === selectedTrain.id
          ? { ...train, status: "Delayed", delayInfo }
          : train
      )
    );

    toast.success(`Delay updated for ${selectedTrain.name}`);
    setDelayInfo("");
    setSelectedTrain(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Train Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Real-time tracking and status updates for all trains
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Trains</CardTitle>
          <CardDescription>Live status of all trains in operation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Train Name</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell className="font-medium">{train.id}</TableCell>
                  <TableCell>{train.name}</TableCell>
                  <TableCell>{train.route}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {train.departureTime}
                  </TableCell>
                  <TableCell>
                    {train.status === "On Time" ? (
                      <Badge variant="default" className="bg-success">
                        On Time
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" />
                        Delayed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTrain(train)}
                        >
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Train Status</DialogTitle>
                          <DialogDescription>
                            Update delay information for {train.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Delay Information</Label>
                            <Textarea
                              id="notes"
                              placeholder="Reason for delay..."
                              value={delayInfo}
                              onChange={(e) => setDelayInfo(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUpdateDelay}>Update Status</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainMonitoring;
