import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Leaf } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LivePrice } from './LivePrice';

// Define form validation schema
const investmentFormSchema = z.object({
  asset: z.string({
    required_error: "Please select an investment asset",
  }),
  amount: z.string().min(1, "Please enter an investment amount"),
});

type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

const AddInvestment = ({ 
  onSuccess, 
  category, 
  riskLevel, 
  recommendedAssets 
}: { 
  onSuccess?: () => void;
  category: string;
  riskLevel: string;
  recommendedAssets: string[];
}) => {
  const { toast } = useToast();
  const { selectedPortfolio } = useApp();
  
  // Form definition
  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      asset: "",
      amount: "",
    },
  });
  
  const handleAddInvestment = (data: InvestmentFormValues) => {
    toast({
      title: "Investment added",
      description: `£${data.amount} added to ${data.asset} in your ${selectedPortfolio?.name || 'portfolio'}`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="text-sprout-green h-5 w-5" />
          Add Investment
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <h3 className="text-md font-semibold">{category} - {riskLevel}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select an asset from the recommended list below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddInvestment)} className="space-y-4">
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Investment Options</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {recommendedAssets.map((asset, index) => (
                        <FormItem key={index} className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                          <FormControl>
                            <RadioGroupItem value={asset} />
                          </FormControl>
                          <div className="flex justify-between w-full items-center">
                            <FormLabel className="font-normal cursor-pointer">{asset}</FormLabel>
                            <LivePrice symbol={asset} className="text-sm text-gray-600" />
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Amount (£)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount in GBP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full btn-action btn-primary mt-4"
              disabled={!form.formState.isValid}
            >
              Add Investment <ChevronRight size={18} />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddInvestment;
