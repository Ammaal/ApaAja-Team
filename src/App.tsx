import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import AlternativeBooking from "./pages/AlternativeBooking";
import Booking from "./pages/Booking";
import MyOrders from "./pages/MyOrders";
import Delays from "./pages/Delays";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import TravelHistory from "./pages/TravelHistory";
import PaymentMethods from "./pages/PaymentMethods";
import NotificationPreferences from "./pages/NotificationPreferences";
import Checkout from "./pages/Checkout";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainMonitoring from "./pages/admin/TrainMonitoring";
import RefundManagement from "./pages/admin/RefundManagement";
import TicketConfirmation from "./pages/admin/TicketConfirmation";
import ForumModeration from "./pages/admin/ForumModeration";
import AdminLogs from "./pages/admin/AdminLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/alternative-booking" element={<AlternativeBooking />} />
            <Route path="/delays" element={<Delays />} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/travel-history" element={<ProtectedRoute><TravelHistory /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
            <Route path="/notification-preferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment-confirmation" element={<ProtectedRoute><PaymentConfirmation /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/train-monitoring" element={<ProtectedAdminRoute><AdminLayout><TrainMonitoring /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/refund-management" element={<ProtectedAdminRoute><AdminLayout><RefundManagement /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/ticket-confirmation" element={<ProtectedAdminRoute><AdminLayout><TicketConfirmation /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/forum-moderation" element={<ProtectedAdminRoute><AdminLayout><ForumModeration /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/logs" element={<ProtectedAdminRoute><AdminLayout><AdminLogs /></AdminLayout></ProtectedAdminRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;