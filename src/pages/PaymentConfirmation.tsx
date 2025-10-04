import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Download, FileText, Home } from "lucide-react";
import { Order } from "@/data/orders";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const amount = searchParams.get("amount") || "0";
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const currentOrder = allOrders.find((o: Order) => o.id === orderId);
      if (currentOrder) {
        setOrder(currentOrder);
      }
    }
  }, [orderId]);

  const handleDownloadInvoice = () => {
    if (!order) {
      alert("Invoice details could not be loaded.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Train Vista Invoice", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 105, 30, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 35, {
      align: "center",
    });

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(16);
    doc.text("Booking Details", 20, 60);
    doc.setFontSize(12);
    doc.text(`Train: ${order.trainName}`, 20, 70);
    doc.text(`Route: ${order.origin} to ${order.destination}`, 20, 80);
    doc.text(
      `Travel Date: ${new Date(order.date + "T00:00:00").toLocaleDateString()}`,
      20,
      90
    );
    doc.text(`Departure Time: ${order.time}`, 20, 100);
    doc.text(`Passengers: ${order.passengers}`, 20, 110);

    doc.setFontSize(16);
    doc.text("Payment Details", 20, 130);
    doc.setFontSize(12);
    doc.text("Total Amount Paid:", 20, 140);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Rp ${order.price.toLocaleString()}`, 190, 140, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    doc.text("Thank you for choosing Train Vista!", 105, 280, {
      align: "center",
    });

    doc.save(`invoice-${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            {isSuccess ? (
              <>
                <div className="flex justify-center mb-6">
                  <CheckCircle className="h-20 w-20 text-success" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-8">
                  Your booking has been confirmed
                </p>

                <div className="bg-secondary/50 rounded-lg p-6 mb-8">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-3xl font-bold text-accent">
                      Rp {parseInt(amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID: {orderId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleDownloadInvoice} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Link to="/my-orders">
                    <Button variant="outline" className="w-full" size="lg">
                      <FileText className="h-4 w-4 mr-2" />
                      View My Bookings
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="ghost" className="w-full" size="lg">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <XCircle className="h-20 w-20 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                <p className="text-muted-foreground mb-8">
                  There was an issue processing your payment
                </p>

                <div className="bg-destructive/10 rounded-lg p-6 mb-8">
                  <p className="text-sm">
                    Please check your payment details and try again. If the problem persists,
                    contact our support team.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Try Again
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full" size="lg">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;