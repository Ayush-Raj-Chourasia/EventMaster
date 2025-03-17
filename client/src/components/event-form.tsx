import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EventForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      maxTeamSize: 4,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest("POST", "/api/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      form.reset();
      toast({
        title: "Success",
        description: "Event created successfully",
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
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((data) =>
            createEventMutation.mutate(data)
          )}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="datetime-local"
              {...form.register("startDate")}
            />
            {form.formState.errors.startDate && (
              <p className="text-sm text-destructive">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              {...form.register("endDate")}
            />
            {form.formState.errors.endDate && (
              <p className="text-sm text-destructive">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
            <Input
              id="maxTeamSize"
              type="number"
              min="1"
              {...form.register("maxTeamSize", { valueAsNumber: true })}
            />
            {form.formState.errors.maxTeamSize && (
              <p className="text-sm text-destructive">
                {form.formState.errors.maxTeamSize.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createEventMutation.isPending}
          >
            {createEventMutation.isPending ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}