import Navbar from "@/components/Navbar";
import RefundProgressBar from "@/components/RefundProgressBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  Download,
  MapPin,
  QrCode,
  Users,
  AlertTriangle,
  Train,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Order } from "@/data/orders";
// import { mockTrains } from "@/data/trains"; // This is no longer needed for delay checks
import RescheduleDialog from "@/components/RescheduleDialog";

const MyOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders directly from our new backend endpoint
        const response = await fetch("http://127.0.0.1:8000/api/my-orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders from the backend.");
        }
        const fetchedOrders: Order[] = await response.json();
        // Sort orders by date, newest first
        const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(sortedOrders);

      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "API Connection Error",
          description: "Could not connect to the server to fetch your orders.",
          variant: "destructive",
        });
      }
    };

    fetchOrders();
  }, [toast]);

  // This effect for train delays is based on mock data and can be removed or adapted later.
  /*
  useEffect(() => {
    orders.forEach((order) => {
      const train = mockTrains.find((t) => t.id === order.trainId);
      if (train && train.status === "Delayed") {
        toast({
          title: "Train Delay Alert",
          description: `Your train, ${train.name}, is delayed. ${train.delayInfo}`,
          variant: "destructive",
        });
      }
    });
  }, [orders, toast]);
  */

  const handleDownloadTicket = () => {
    toast({
      title: "Download Started",
      description: "Your e-ticket is being downloaded.",
    });
  };

  const handleViewQR = () => {
    toast({
      title: "QR Code",
      description: "Scan this QR code at the station.",
    });
  };

  const handleCancelAndRefund = (orderId: string) => {
    // Note: This now only updates the local state and won't persist on reload.
    // A proper implementation would require a backend API call.
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled", refundStatus: "requested" } : order
      )
    );
    toast({
      title: "Cancellation Requested",
      description: "Your booking cancellation has been requested.",
    });
  };

  const handleOpenRescheduleDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsRescheduleDialogOpen(true);
  };

  const handleConfirmReschedule = (orderId: string, newDate: string, newTime: string) => {
    // Note: This now only updates the local state and won't persist on reload.
    // A proper implementation would require a backend API call.
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, date: newDate, time: newTime } : order
    );
    setOrders(updatedOrders);
    setIsRescheduleDialogOpen(false);
    toast({
      title: "Reschedule Successful",
      description: "Your booking has been successfully rescheduled.",
    });
  };

   const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-info">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your train bookings
          </p>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              You have no orders yet.
            </Card>
          ) : (
            orders.map((order) => {
              // const train = mockTrains.find((t) => t.id === order.trainId); // No longer needed
              // const isDelayed = train && train.status === "Delayed"; // No longer needed

              return (
                <Card key={order.id} className="p-6">
                  {/* Delay information block is removed as it depends on mock data */}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{order.trainName}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order ID: {order.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleViewQR}>
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTicket}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {order.isAlternative && order.legs ? (
                  <div className="space-y-4">
                    {order.legs.map((leg, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Train className="h-5 w-5 text-primary" />
                          <h4 className="font-bold">{leg.trainName}</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Route
                              </p>
                              <p className="font-semibold">
                                {leg.origin} → {leg.destination}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Date & Time
                              </p>
                              <p className="font-semibold">
                                {
                                  new Date(
                                    leg.date + "T00:00:00"
                                  ).toLocaleDateString()}{" "}
                                {leg.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Route</p>
                        <p className="font-semibold">
                          {order.origin} → {order.destination}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Date & Time
                        </p>
                        <p className="font-semibold">
                          {new Date(
                            order.date + "T00:00:00"
                          ).toLocaleDateString()}{" "}
                          {order.time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Passengers</p>
                      <p className="font-semibold">{order.passengers}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Price</p>
                      <p className="font-semibold text-accent">
                        Rp {order.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {order.refundStatus && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold mb-4">Refund Status</h4>
                      <RefundProgressBar
                        currentStatus={order.refundStatus as any}
                      />
                    </div>
                  </>
                )}

                {order.status === "confirmed" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOpenRescheduleDialog(order)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleCancelAndRefund(order.id)}
                    >
                      Cancel & Request Refund
                    </Button>
                  </div>
                )}
              </Card>
            );
          }))}
        </div>
      </div>
      <RescheduleDialog
        order={selectedOrder}
        isOpen={isRescheduleDialogOpen}
        onClose={() => setIsRescheduleDialogOpen(false)}
        onReschedule={handleConfirmReschedule}
      />
    </div>
  );
};

export default MyOrders;