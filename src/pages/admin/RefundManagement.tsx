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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type OrderStatus = "confirmed" | "completed" | "cancelled";
type RefundStatus = "requested" | "verified" | "processing_bank" | "sent" | "completed" | "rejected" | null;

interface Order {
  id: string;
  train: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  status: OrderStatus;
  price: number;
  refundStatus: RefundStatus;
}

const RefundManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "TRX001",
      train: "Argo Bromo Anggrek",
      origin: "Jakarta",
      destination: "Surabaya",
      date: "2025-10-20",
      time: "08:00",
      passengers: 2,
      status: "confirmed",
      price: 700000,
      refundStatus: null,
    },
    {
      id: "TRX002",
      train: "Bima",
      origin: "Yogyakarta",
      destination: "Jakarta",
      date: "2025-09-15",
      time: "10:30",
      passengers: 1,
      status: "completed",
      price: 320000,
      refundStatus: "processing_bank",
    },
    {
      id: "TRX003",
      train: "Turangga",
      origin: "Bandung",
      destination: "Surabaya",
      date: "2025-08-10",
      time: "14:00",
      passengers: 3,
      status: "cancelled",
      price: 750000,
      refundStatus: "completed",
    },
    {
      id: "TRX004",
      train: "Gajayana",
      origin: "Malang",
      destination: "Jakarta",
      date: "2025-11-01",
      time: "16:00",
      passengers: 1,
      status: "cancelled",
      price: 480000,
      refundStatus: "requested",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<RefundStatus>(null);
  const [notes, setNotes] = useState("");

  const statusColors: Record<string, string> = {
    requested: "bg-info",
    verified: "bg-primary",
    processing_bank: "bg-warning",
    sent: "bg-accent",
    completed: "bg-success",
    rejected: "bg-destructive"
  };


  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? { ...order, refundStatus: newStatus } : order
        )
      );

      toast.success(`Refund status updated to ${newStatus}`);
      setNewStatus(null);
      setNotes("");
      setSelectedOrder(null);
    }
  };

  const refundRequests = orders.filter((order) => order.refundStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Refund Management</h1>
        <p className="text-muted-foreground mt-2">
          Process and track refund requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
          <CardDescription>Manage customer refund requests and update statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
               <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundRequests.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">User Name</div>
                    <div className="text-sm text-muted-foreground">user@example.com</div>
                  </TableCell>
                  <TableCell>Rp {order.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {order.refundStatus && (
                      <Badge className={statusColors[order.refundStatus]}>
                        {order.refundStatus.replace("_", " ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Refund Status</DialogTitle>
                          <DialogDescription>
                            Update the status for refund on order {order.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>New Status</Label>
                            <Select
                              value={newStatus || ""}
                              onValueChange={(value) => setNewStatus(value as RefundStatus)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="requested">Requested</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="processing_bank">Processing Bank</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="notes">Admin Notes</Label>
                            <Textarea
                              id="notes"
                              placeholder="Add notes about this status update..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUpdateStatus}>Update Status</Button>
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

export default RefundManagement;