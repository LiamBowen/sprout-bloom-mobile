
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ConnectBankDialogProps {
  open: boolean;
  authUrl: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ConnectBankDialog = ({
  open,
  authUrl,
  onOpenChange,
  onConfirm
}: ConnectBankDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Bank</DialogTitle>
          <DialogDescription>
            You'll be redirected to TrueLayer to securely connect your bank account.
            No sensitive banking details will be stored in Sprout.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex items-center gap-2"
            disabled={!authUrl}
          >
            Continue to TrueLayer <ExternalLink size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
