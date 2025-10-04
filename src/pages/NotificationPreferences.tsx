import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Train } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    pushBooking: true,
    pushDelay: true,
    pushRefund: true,
    emailBooking: true,
    emailDelay: false,
    emailRefund: true,
    smsBooking: false,
    smsDelay: true,
    smsRefund: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Notification Preferences</h1>
          <p className="text-muted-foreground mb-8">
            Manage how you receive updates and alerts
          </p>

          <div className="space-y-6">
            {/* Push Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Push Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-booking" className="cursor-pointer">
                    Booking Confirmations
                  </Label>
                  <Switch
                    id="push-booking"
                    checked={preferences.pushBooking}
                    onCheckedChange={() => handleToggle("pushBooking")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-delay" className="cursor-pointer">
                    Train Delays
                  </Label>
                  <Switch
                    id="push-delay"
                    checked={preferences.pushDelay}
                    onCheckedChange={() => handleToggle("pushDelay")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-refund" className="cursor-pointer">
                    Refund Updates
                  </Label>
                  <Switch
                    id="push-refund"
                    checked={preferences.pushRefund}
                    onCheckedChange={() => handleToggle("pushRefund")}
                  />
                </div>
              </div>
            </Card>

            {/* Email Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Email Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-booking" className="cursor-pointer">
                    Booking Confirmations
                  </Label>
                  <Switch
                    id="email-booking"
                    checked={preferences.emailBooking}
                    onCheckedChange={() => handleToggle("emailBooking")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-delay" className="cursor-pointer">
                    Train Delays
                  </Label>
                  <Switch
                    id="email-delay"
                    checked={preferences.emailDelay}
                    onCheckedChange={() => handleToggle("emailDelay")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-refund" className="cursor-pointer">
                    Refund Updates
                  </Label>
                  <Switch
                    id="email-refund"
                    checked={preferences.emailRefund}
                    onCheckedChange={() => handleToggle("emailRefund")}
                  />
                </div>
              </div>
            </Card>

            {/* SMS Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">SMS Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-booking" className="cursor-pointer">
                    Booking Confirmations
                  </Label>
                  <Switch
                    id="sms-booking"
                    checked={preferences.smsBooking}
                    onCheckedChange={() => handleToggle("smsBooking")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-delay" className="cursor-pointer">
                    Train Delays
                  </Label>
                  <Switch
                    id="sms-delay"
                    checked={preferences.smsDelay}
                    onCheckedChange={() => handleToggle("smsDelay")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-refund" className="cursor-pointer">
                    Refund Updates
                  </Label>
                  <Switch
                    id="sms-refund"
                    checked={preferences.smsRefund}
                    onCheckedChange={() => handleToggle("smsRefund")}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
