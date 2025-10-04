import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, Calendar, DollarSign } from "lucide-react";

const TravelHistory = () => {
  const history = [
    {
      id: "TRX001",
      train: "Argo Bromo Anggrek",
      origin: "Jakarta",
      destination: "Surabaya",
      date: "2025-09-15",
      price: 700000,
      status: "completed",
    },
    {
      id: "TRX002",
      train: "Bima",
      origin: "Yogyakarta",
      destination: "Jakarta",
      date: "2025-08-10",
      price: 320000,
      status: "completed",
    },
    {
      id: "TRX003",
      train: "Turangga",
      origin: "Bandung",
      destination: "Surabaya",
      date: "2025-07-22",
      price: 750000,
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Travel History</h1>
          <p className="text-muted-foreground mb-8">View your past train journeys</p>

          <div className="space-y-4">
            {history.map((trip) => (
              <Card key={trip.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Train className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{trip.train}</h3>
                      <p className="text-sm text-muted-foreground">Order ID: {trip.id}</p>
                    </div>
                  </div>
                  <Badge className="bg-success">Completed</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Route</p>
                      <p className="font-semibold">
                        {trip.origin} → {trip.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-semibold">
                        {new Date(trip.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-semibold text-accent">
                        Rp {trip.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelHistory;
