import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DeleteAllModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAllModal({ isOpen, onClose }: DeleteAllModalProps) {
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState("");

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/data/clear-all");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      onClose();
      setConfirmText("");
      toast({
        title: "Success",
        description: "All data has been cleared successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear data",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === "DELETE ALL") {
      deleteAllMutation.mutate();
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const isConfirmValid = confirmText === "DELETE ALL";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Clear All Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Warning: This action cannot be undone!</h4>
            <p className="text-sm text-red-700">
              This will permanently delete all:
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
              <li>Tasks and their details</li>
              <li>Team members</li>
              <li>Categories</li>
              <li>Time entries</li>
              <li>Activity history</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="confirmInput">
                Type <strong>DELETE ALL</strong> to confirm:
              </Label>
              <Input
                id="confirmInput"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE ALL"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmValid || deleteAllMutation.isPending}
              >
                {deleteAllMutation.isPending ? "Clearing..." : "Clear All Data"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}