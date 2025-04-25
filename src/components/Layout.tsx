
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Map, Shield, BarChart2, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ChatBot from "@/components/ChatBot";

// Layout for the simulator, routes, nav and sidebar
const Layout = () => {
  const location = useLocation();
  const { user, profile } = useSupabaseAuth();

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: BarChart2 },
    { name: "Route Planner", path: "/route-planner", icon: Map },
    { name: "Safety Suite", path: "/safety-suite", icon: Shield },
    { name: "Eco Insights", path: "/eco-insights", icon: Settings }
  ];

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <ThemeToggle />
        <ChatBot
          battery={75}
          distance="34 km"
          obstacleAvoidance={true}
          emergencyBraking={true}
          pathFollowing="active"
        />
      {/* Sidebar Navigation */}
      <div className="hidden md:flex w-64 flex-col bg-sidebar p-4 shadow-lg">
        <div className="mb-8 py-6 px-2">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-cyber-bright-purple">
            HoverRobotix
          </h1>
          <p className="text-xs text-muted-foreground">Simulator v1.0</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md transition-all",
                location.pathname === item.path
                  ? "bg-purple-600 dark:bg-cyber-purple text-white"
                  : "text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-secondary space-y-3">
          <div className="px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span>Online Mode: Simulation</span>
            </div>
          </div>
          {/* Profile or login */}
          <div className="flex items-center gap-3 px-4">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center group hover:text-cyber-bright-purple"
              >
                <User className="h-4 w-4 mr-1" />
                <span>{profile?.full_name || profile?.username || "Profile"}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center group hover:text-cyber-bright-purple"
              >
                <User className="h-4 w-4 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sidebar flex justify-around p-2 border-t border-secondary">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2",
              location.pathname === item.path
                ? "text-cyber-bright-purple"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
        {user ? (
          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center p-2",
              location.pathname === "/profile"
                ? "text-cyber-bright-purple"
                : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="flex flex-col items-center p-2 text-muted-foreground"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="h-full flex flex-col">
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
