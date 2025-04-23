
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Palmtree, Home, Car, Laptop, Plane, GraduationCap, Gift, Tent } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewGroupFundDialogProps {
  onCreateGroupFund: (name: string, emoji: string, target: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().min(1, "Icon is required"),
  target: z.string().min(1, "Target amount is required")
});

const NewGroupFundDialog = ({ onCreateGroupFund }: NewGroupFundDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emoji: "Palmtree",
      target: "",
    }
  });
  
  const availableIcons = [
    { name: "Palmtree", icon: Palmtree },
    { name: "Home", icon: Home },
    { name: "Car", icon: Car },
    { name: "Laptop", icon: Laptop },
    { name: "Plane", icon: Plane },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Gift", icon: Gift },
    { name: "Tent", icon: Tent },
  ];

  const handleCreateNewGroup = (values: z.infer<typeof formSchema>) => {
    onCreateGroupFund(values.name, values.emoji, values.target);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-action flex items-center justify-center gap-2 btn-tertiary">
          <Plus size={18} /> Create Group Fund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Fund</DialogTitle>
          <DialogDescription>Create a fund to save together with friends</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateNewGroup)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Trip 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose an Icon</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {availableIcons.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => form.setValue("emoji", name)}
                        className={`w-10 h-10 flex items-center justify-center rounded ${
                          field.value === name
                            ? "bg-sprout-lavender/20 border border-sprout-lavender"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (£)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Fund
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupFundDialog;
