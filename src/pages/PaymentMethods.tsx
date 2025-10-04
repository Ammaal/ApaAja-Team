import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentMethods = () => {
  const { toast } = useToast();
  const [paymentMethods] = useState([
    {
      id: 1,
      type: "Credit Card",
      brand: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "E-Wallet",
      brand: "GoPay",
      identifier: "john.doe@email.com",
      isDefault: false,
    },
    {
      id: 3,
      type: "E-Wallet",
      brand: "OVO",
      identifier: "+62 812 3456 7890",
      isDefault: false,
    },
  ]);

  const handleAddPayment = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method addition coming soon!",
    });
  };

  const handleRemovePayment = (id: number) => {
    toast({
      title: "Payment Method Removed",
      description: "Payment method has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
              <p className="text-muted-foreground">Manage your saved payment methods</p>
            </div>
            <Button onClick={handleAddPayment}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{method.brand}</h3>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.type === "Credit Card"
                          ? `•••• •••• •••• ${method.last4}`
                          : method.identifier}
                      </p>
                      {method.expiry && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires {method.expiry}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePayment(method.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
