import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertTriangle, Train, MapPin } from "lucide-react";

const Delays = () => {
  // Mock delay notifications
  const delays = [
    {
      id: 1,
      train: "Argo Bromo Anggrek",
      route: "Jakarta → Surabaya",
      lastStation: "Cirebon",
      originalETA: "16:30",
      delayMinutes: 45,
      estimatedETA: "17:15",
      reason: "Technical maintenance at station",
      timestamp: "2025-10-02 14:30",
      severity: "moderate",
    },
    {
      id: 2,
      train: "Gajayana",
      route: "Jakarta → Malang",
      lastStation: "Yogyakarta",
      originalETA: "22:00",
      delayMinutes: 120,
      estimatedETA: "00:00",
      reason: "Weather conditions affecting track visibility",
      timestamp: "2025-10-02 18:45",
      severity: "high",
    },
    {
      id: 3,
      train: "Mutiara Selatan",
      route: "Bandung → Surabaya",
      lastStation: "Semarang",
      originalETA: "19:30",
      delayMinutes: 15,
      estimatedETA: "19:45",
      reason: "Slight schedule adjustment",
      timestamp: "2025-10-02 17:00",
      severity: "low",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "Significant Delay";
      case "moderate":
        return "Moderate Delay";
      case "low":
        return "Minor Delay";
      default:
        return "Delay";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Train Delay Notifications</h1>
          <p className="text-muted-foreground">
            Real-time updates on train delays and schedule changes
          </p>
        </div>

        <Alert className="mb-6 border-info bg-info/10">
          <AlertTriangle className="h-4 w-4 text-info" />
          <AlertTitle className="text-info">Live Updates Active</AlertTitle>
          <AlertDescription>
            You will receive instant notifications when any of your booked trains experience delays.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {delays.map((delay) => (
            <Card key={delay.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <Train className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{delay.train}</h3>
                    <p className="text-sm text-muted-foreground">{delay.route}</p>
                  </div>
                </div>
                <Badge className={getSeverityColor(delay.severity)}>
                  {getSeverityLabel(delay.severity)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Station</p>
                    <p className="font-semibold">{delay.lastStation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Original ETA</p>
                    <p className="font-semibold line-through opacity-60">{delay.originalETA}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">New Estimated ETA</p>
                    <p className="font-semibold text-warning">{delay.estimatedETA}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="font-semibold text-sm">Delay: {delay.delayMinutes} minutes</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Reason:</strong> {delay.reason}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {delay.timestamp}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {delays.length === 0 && (
          <Card className="p-12 text-center">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Train className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Trains On Time</h3>
            <p className="text-muted-foreground">
              There are currently no reported delays. Have a pleasant journey!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Delays;
