import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const TicketConfirmation = () => {
  const [bookings, setBookings] = useState([
    { id: "BK12349", user: "Michael Chen", train: "Argo Bromo", route: "Jakarta - Surabaya", date: "2025-01-20", status: "pending", amount: "Rp 350.000" },
    { id: "BK12350", user: "Sarah Johnson", train: "Bima Express", route: "Jakarta - Yogyakarta", date: "2025-01-21", status: "pending", amount: "Rp 280.000" },
    { id: "BK12351", user: "David Lee", train: "Gajayana", route: "Jakarta - Malang", date: "2025-01-22", status: "confirmed", amount: "Rp 420.000" },
    { id: "BK12352", user: "Emma Wilson", train: "Argo Parahyangan", route: "Jakarta - Bandung", date: "2025-01-19", status: "declined", amount: "Rp 150.000" },
  ]);

  const handleApprove = (bookingId: string) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: "confirmed" }
        : booking
    ));
    toast.success(`Booking ${bookingId} has been approved`);
  };

  const handleDecline = (bookingId: string) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: "declined" }
        : booking
    ));
    toast.error(`Booking ${bookingId} has been declined`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ticket Confirmation</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve/decline ticket bookings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Bookings</CardTitle>
          <CardDescription>Manage ticket confirmation requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.train}</TableCell>
                  <TableCell>{booking.route}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    {booking.status === "pending" && (
                      <Badge variant="outline" className="bg-warning/10">Pending</Badge>
                    )}
                    {booking.status === "confirmed" && (
                      <Badge className="bg-success">Confirmed</Badge>
                    )}
                    {booking.status === "declined" && (
                      <Badge variant="destructive">Declined</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleApprove(booking.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecline(booking.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
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

export default TicketConfirmation;
