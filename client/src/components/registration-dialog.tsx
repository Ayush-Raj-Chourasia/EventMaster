import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, UserCircle } from "lucide-react";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number;
  onCreateTeam: () => void;
}

export default function RegistrationDialog({
  open,
  onOpenChange,
  eventId,
  onCreateTeam,
}: RegistrationDialogProps) {
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/events/${eventId}/register`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/teams`],
      });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Successfully registered for the event",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Registration Type</DialogTitle>
          <DialogDescription>
            Select how you would like to participate in this event
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center"
            onClick={() => registerMutation.mutate()}
            disabled={registerMutation.isPending}
          >
            <UserCircle className="h-8 w-8 mb-2" />
            <span>Join as Individual</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center"
            onClick={() => {
              onOpenChange(false);
              onCreateTeam();
            }}
          >
            <Users className="h-8 w-8 mb-2" />
            <span>Create/Join Team</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
