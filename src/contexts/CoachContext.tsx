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
      text: "Hi! I'm your Sprout financial coach. I can help you understand investing, savings, and how to make the most of the Sprout app. What would you like to know?"
    }
  ]);
  const { toast } = useToast();

  const addCoachMessage = async (message: CoachMessage) => {
    setCoachMessages(prevMessages => [...prevMessages, message]);

    if (message.sender === "user") {
      setCoachMessages(prevMessages => [
        ...prevMessages,
        { sender: "coach", text: "..." }
      ]);

      try {
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: { message: message.text }
        });

        if (error) throw error;

        setCoachMessages(prevMessages => {
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          return [...filteredMessages, { 
            sender: "coach", 
            text: data.response
          }];
        });
      } catch (error) {
        console.error("Error getting coach response:", error);
        setCoachMessages(prevMessages => {
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          return [...filteredMessages, { 
            sender: "coach", 
            text: "I'm here to help! Could you please rephrase your question?" 
          }];
        });
        
        toast({
          title: "Connection Issue",
          description: "Having trouble connecting to the coach service. Please try again.",
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
