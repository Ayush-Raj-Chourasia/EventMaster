import { useState } from "react";
import { Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Shield, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function TeamList({
  teams,
  eventId,
  isOrganizer,
}: {
  teams: Team[];
  eventId: number;
  isOrganizer: boolean;
}) {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });
  
  const joinTeamMutation = useMutation({
    mutationFn: async ({ teamId }: { teamId: number }) => {
      const res = await apiRequest(
        "POST",
        `/api/events/${eventId}/teams/${teamId}/join`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/teams`],
      });
      toast({
        title: "Success",
        description: "Successfully joined the team",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest(
        "POST",
        `/api/events/${eventId}/teams`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/teams`],
      });
      setShowCreateTeam(false);
      form.reset();
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <div className="space-y-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between p-2 rounded-lg border"
          >
            <div className="flex items-center">
              {team.leaderId === user?.id ? (
                <Shield className="h-4 w-4 mr-2 text-primary" />
              ) : (
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {team.name}
            </div>
            {!isOrganizer && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (team.leaderId === user?.id) {
                    // Handle Manage Team action
                    setSelectedTeam(team);
                    setShowManageTeam(true);
                  } else {
                    // Handle Join Team action
                    joinTeamMutation.mutate({ teamId: team.id });
                  }
                }}
              >
                {team.leaderId === user?.id ? "Manage Team" : "Join Team"}
              </Button>
            )}
          </div>
        ))}
      </div>

      {!isOrganizer && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowCreateTeam(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Team
        </Button>
      )}

      <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((data) =>
              createTeamMutation.mutate(data)
            )}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" {...form.register("name")} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createTeamMutation.isPending}
            >
              Create Team
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Team Dialog */}
      <Dialog open={showManageTeam} onOpenChange={setShowManageTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Team: {selectedTeam?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Team Members</h3>
              <div className="mt-2 space-y-2">
                {selectedTeam?.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center">
                      {member.id === selectedTeam.leaderId && (
                        <Shield className="h-4 w-4 mr-2 text-primary" />
                      )}
                      {member.name || member.username}
                    </div>
                    {member.id !== selectedTeam.leaderId && member.id !== user?.id && (
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    )}
                  </div>
                )) || (
                  <p className="text-muted-foreground">No members in this team yet.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Invite Team Members</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input 
                    id="invite-email" 
                    type="email" 
                    placeholder="Enter email address" 
                    className="mt-1"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const emailInput = document.getElementById('invite-email') as HTMLInputElement;
                    if (emailInput && emailInput.value) {
                      // Here you would implement the email sending functionality
                      toast({
                        title: "Invitation Sent",
                        description: `Invitation email sent to ${emailInput.value}`,
                      });
                      emailInput.value = '';
                    } else {
                      toast({
                        title: "Error",
                        description: "Please enter a valid email address",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Send Invitation
                </Button>
              </div>
            </div>

            <Button
              variant="default"
              className="w-full mt-4"
              onClick={() => setShowManageTeam(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}