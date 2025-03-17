import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NavBar from "@/components/nav-bar";

import HomePage from "@/pages/home-page";
import EventPage from "@/pages/event-page";
import AuthPage from "@/pages/auth-page";
import AnalyticsPage from "@/pages/analytics-page";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";

  return (
    <>
      {!isAuthPage && <NavBar />}
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/events/:id" component={EventPage} />
        <ProtectedRoute path="/analytics" component={AnalyticsPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;