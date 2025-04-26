
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LegalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}

export const LegalDialog = ({ isOpen, onClose, type }: LegalDialogProps) => {
  const content = {
    terms: {
      title: "Terms & Conditions",
      description: (
        <div className="space-y-4 text-sm text-gray-600">
          <p>Last updated: April 26, 2025</p>
          <p>
            Welcome to Sprout (Beta). By accessing or using our application, you agree to these Terms and Conditions.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">1. Beta Testing Phase</h3>
            <p>
              This application is currently in beta testing. Features, functionality, and services may be incomplete,
              contain bugs, or undergo significant changes.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">2. Test Environment</h3>
            <p>
              All transactions and data are simulated. No real money is involved in this testing environment.
              The application uses sandbox APIs and test data.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">3. No Warranties</h3>
            <p>
              The application is provided "as is" without any warranties. We do not guarantee uninterrupted,
              secure, or error-free operation during this beta phase.
            </p>
          </div>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      description: (
        <div className="space-y-4 text-sm text-gray-600">
          <p>Last updated: April 26, 2025</p>
          <p>
            This Privacy Policy describes how we collect and use information during the beta testing of Sprout.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">1. Data Collection</h3>
            <p>
              During beta testing, we collect user feedback, usage patterns, and performance metrics
              to improve the application. All financial data is simulated.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">2. Test Data Usage</h3>
            <p>
              Test data and simulated transactions are used solely for development and testing purposes.
              No real financial transactions occur in this environment.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-black">3. Beta Testing Feedback</h3>
            <p>
              User feedback and testing results may be used to improve the application. Personal
              identification information is not shared with third parties.
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{content[type].title}</DialogTitle>
          <DialogDescription className="pt-4">
            {content[type].description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
