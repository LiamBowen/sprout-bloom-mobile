
import { createContext, useContext, useState, ReactNode } from "react";

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
      text: "Hi there! I'm your financial coach. How can I help you today?"
    }
  ]);

  const addCoachMessage = (message: CoachMessage) => {
    setCoachMessages(prevMessages => [...prevMessages, message]);

    if (message.sender === "user") {
      setTimeout(() => {
        const responses = [
          "That's a great question! Investing early, even small amounts, can lead to significant growth over time due to compound interest.",
          "I recommend starting with a diversified portfolio that matches your risk tolerance.",
          "Saving regularly is key to financial success. Even £5 a week can grow significantly over time!",
          "Round-ups are a great way to save without noticing. They round up your purchases to the nearest pound and invest the difference.",
          "The best investment strategy is one you can stick with consistently over time."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setCoachMessages(prevMessages => [
          ...prevMessages,
          {
            sender: "coach",
            text: randomResponse
          }
        ]);
      }, 1500);
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
