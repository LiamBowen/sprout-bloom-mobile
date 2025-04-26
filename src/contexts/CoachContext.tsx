
import { createContext, useContext, useState, ReactNode } from "react";
import { fetchLivePrice } from "@/integrations/finnhub/client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CoachMessage {
  sender: "user" | "coach";
  text: string;
}

interface CoachContextType {
  coachMessages: CoachMessage[];
  addCoachMessage: (message: CoachMessage) => void;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      sender: "coach",
      text: "Hi there! I'm your financial coach. Ask me about investments, savings, or real-time market data to help you make informed decisions."
    }
  ]);
  const { toast } = useToast();

  const addCoachMessage = async (message: CoachMessage) => {
    setCoachMessages(prevMessages => [...prevMessages, message]);

    if (message.sender === "user") {
      // Set typing indicator
      setCoachMessages(prevMessages => [
        ...prevMessages,
        { sender: "coach", text: "..." }
      ]);

      try {
        // Call our AI coach edge function
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: { message: message.text }
        });

        if (error) throw error;

        // Remove the typing indicator and add the actual response
        setCoachMessages(prevMessages => {
          // Remove the last message if it's the typing indicator
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          // Add the actual response
          return [...filteredMessages, { 
            sender: "coach", 
            text: data.response
          }];
        });
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Remove typing indicator and add error message
        setCoachMessages(prevMessages => {
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          return [...filteredMessages, { 
            sender: "coach", 
            text: "I'm having trouble providing information at the moment. Please try again later." 
          }];
        });
        
        toast({
          title: "Connection Issue",
          description: "Having trouble connecting to the AI coach service. Please try again later.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <CoachContext.Provider value={{ coachMessages, addCoachMessage }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error("useCoach must be used within a CoachProvider");
  }
  return context;
};
