
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RoutePlanner from "./pages/RoutePlanner";
import SafetySuite from "./pages/SafetySuite";
import EcoInsights from "./pages/EcoInsights";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import UserProfile from "./components/UserProfile";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import React from "react";

// Auth gate for profile routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSupabaseAuth();
  // Show nothing while loading to prevent flicker
  if (loading) return null;
  return user ? children : <Navigate to="/auth" />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/route-planner" element={<RoutePlanner />} />
            <Route path="/safety-suite" element={<SafetySuite />} />
            <Route path="/eco-insights" element={<EcoInsights />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
