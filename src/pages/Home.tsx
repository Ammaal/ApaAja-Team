import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TrainSearchForm from "@/components/TrainSearchForm";
import { Card } from "@/components/ui/card";
import { Train, Clock, Shield, MessageSquare } from "lucide-react";
import { mockTrains } from "@/data/trains";

const Home = () => {
  const delayedTrains = mockTrains.filter((train) => train.status === "Delayed");

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "var(--gradient-hero)",
          }}
        />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
              Journey Made Simple
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book your train tickets with confidence. Track refunds, get delay alerts, and join our community.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <TrainSearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose KAI Book?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Train className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Search and book tickets in minutes with our streamlined process
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Refund Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your refund status in real-time with detailed progress updates
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Delay Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications about train delays and schedule changes
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-info/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-info" />
                </div>
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow travelers and share experiences
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Travel?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied travelers who trust KAI Book for their journeys
          </p>
          <Link to="/search-results?origin=Jakarta&destination=Surabaya&date=2025-10-15&passengers=1">
            <button className="btn-hero px-8 py-3 rounded-lg text-lg font-semibold">
              Explore Routes
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;