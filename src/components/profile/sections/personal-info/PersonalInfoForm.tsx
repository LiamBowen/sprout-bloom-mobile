
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PersonalInfoFormProps {
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: Date | undefined;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const PersonalInfoForm = ({
  name,
  email,
  mobile,
  dateOfBirth,
  onNameChange,
  onEmailChange,
  onMobileChange,
  onDateChange,
  onSave,
  onCancel,
  loading
}: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600 block mb-1">Name</label>
        <Input 
          value={name} 
          onChange={e => onNameChange(e.target.value)} 
          className="max-w-sm" 
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Email</label>
        <Input 
          type="email"
          value={email} 
          onChange={e => onEmailChange(e.target.value)} 
          className="max-w-sm"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Mobile Number</label>
        <Input 
          type="tel"
          value={mobile} 
          onChange={e => onMobileChange(e.target.value)} 
          className="max-w-sm"
          placeholder="Enter your mobile number"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Date of Birth</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !dateOfBirth && "text-muted-foreground"
              )}
            >
              {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOfBirth}
              onSelect={onDateChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
