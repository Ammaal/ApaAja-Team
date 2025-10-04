import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Train, User, Bell, MessageSquare, Settings, CreditCard, History, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Train className="h-8 w-8 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">KAI Book</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className={!isActive("/") ? "text-primary-foreground hover:bg-primary/80" : ""}
              >
                Search Trains
              </Button>
            </Link>
            <Link to="/my-orders">
              <Button
                variant={isActive("/my-orders") ? "secondary" : "ghost"}
                className={!isActive("/my-orders") ? "text-primary-foreground hover:bg-primary/80" : ""}
              >
                My Orders
              </Button>
            </Link>
            <Link to="/delays">
              <Button
                variant={isActive("/delays") ? "secondary" : "ghost"}
                className={!isActive("/delays") ? "text-primary-foreground hover:bg-primary/80" : ""}
              >
                <Bell className="h-4 w-4" />
                Delays
              </Button>
            </Link>
            <Link to="/community">
              <Button
                variant={isActive("/community") ? "secondary" : "ghost"}
                className={!isActive("/community") ? "text-primary-foreground hover:bg-primary/80" : ""}
              >
                <MessageSquare className="h-4 w-4" />
                Community
              </Button>
            </Link>
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/travel-history" className="flex items-center cursor-pointer">
                  <History className="mr-2 h-4 w-4" />
                  <span>Travel History</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/payment-methods" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Payment Methods</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notification-preferences" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Notification Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="secondary">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
