import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Calendar, Trophy, LogOut } from "lucide-react";
import EventForm from "@/components/event-form";
import { useState } from "react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">
            {user?.role === "organizer" 
              ? "Manage your coding contests and hackathons"
              : "Join exciting coding contests and hackathons"}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          {user?.role === "organizer" && (
            <Button onClick={() => setShowEventForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="cursor-pointer hover:bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {event.creatorId === user?.id ? (
                    <Trophy className="mr-2 h-5 w-5 text-primary" />
                  ) : (
                    <Calendar className="mr-2 h-5 w-5" />
                  )}
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-4 text-sm">
                  <p>
                    Start:{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    End:{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  {event.creatorId === user?.id && (
                    <p className="text-primary font-medium mt-2">
                      You are the organizer
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {user?.role === "organizer" && (
        <EventForm open={showEventForm} onOpenChange={setShowEventForm} />
      )}
    </div>
  );
}