import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Home, ChartBar, LogOut, Trophy } from "lucide-react";

export default function NavBar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <div className="font-bold text-xl mr-6 bg-gradient-to-r from-primary via-accent to-primary/80 text-transparent bg-clip-text drop-shadow-sm">EventMaster</div>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="ghost" className="flex items-center">
              <ChartBar className="h-5 w-5 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user?.name} ({user?.role})
          </span>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
