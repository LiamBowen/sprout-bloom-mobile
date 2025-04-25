
import { createContext, useContext, useState, ReactNode } from "react";
import { fetchLivePrice } from "@/integrations/finnhub/client";

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

  const addCoachMessage = async (message: CoachMessage) => {
    setCoachMessages(prevMessages => [...prevMessages, message]);

    if (message.sender === "user") {
      // Set typing indicator
      setCoachMessages(prevMessages => [
        ...prevMessages,
        { sender: "coach", text: "..." }
      ]);

      try {
        // Process the user's message
        const userQuery = message.text.toLowerCase();
        let response = "";

        // Check if asking about specific stock or asset price
        const priceMatch = userQuery.match(/(?:price|value|worth|cost|quote) (?:of|for) ([a-zA-Z0-9\s&]+)/) || 
                           userQuery.match(/how much (?:is|does) ([a-zA-Z0-9\s&]+) cost/) ||
                           userQuery.match(/(?:what's|what is) ([a-zA-Z0-9\s&]+) (?:at|trading at|price)/);
        
        // Check if asking about specific asset in more general terms
        const assetMatch = userQuery.match(/(?:about|info on|tell me about|thoughts on) ([a-zA-Z0-9\s&]+)/);
        
        // If asking about a specific price
        if (priceMatch) {
          const asset = priceMatch[1].trim();
          try {
            const price = await fetchLivePrice(asset);
            response = `The current price of ${asset} is £${price.toFixed(2)}. Would you like to know more about this investment?`;
          } catch (error) {
            console.error("Error fetching price:", error);
            response = `I couldn't fetch the current price for ${asset}. Would you like information about other investment options?`;
          }
        }
        // If asking about an asset in general
        else if (assetMatch) {
          const asset = assetMatch[1].trim();
          try {
            const price = await fetchLivePrice(asset);
            response = `${asset} is currently trading at £${price.toFixed(2)}. `;
            
            // Add additional context based on the asset type
            if (asset.toLowerCase().includes("etf")) {
              response += "ETFs (Exchange Traded Funds) offer a way to invest in a diversified basket of assets. They typically have lower fees than mutual funds and can be a good option for passive investing strategies.";
            } else if (asset.toLowerCase().includes("crypto") || asset.toLowerCase().includes("bitcoin") || asset.toLowerCase().includes("eth")) {
              response += "Cryptocurrencies are highly volatile investments that can offer substantial returns but come with significant risk. They're typically considered a high-risk portion of a diversified portfolio.";
            } else {
              response += "When considering any investment, it's important to think about how it fits into your overall financial goals and risk tolerance.";
            }
          } catch (error) {
            console.error("Error fetching asset info:", error);
            response = `I'd be happy to provide information about ${asset}, but I couldn't fetch the current data. Is there something specific about this investment you'd like to know?`;
          }
        }
        // Investment strategy questions
        else if (userQuery.includes("portfolio") || userQuery.includes("diversify") || userQuery.includes("allocation")) {
          response = "A well-diversified portfolio typically includes a mix of different asset classes like stocks, bonds, and perhaps alternative investments. The right allocation depends on your age, financial goals, and risk tolerance. Would you like me to help you understand what mix might work for your situation?";
        }
        // Savings questions
        else if (userQuery.includes("save") || userQuery.includes("savings") || userQuery.includes("interest")) {
          response = "When it comes to savings, it's important to consider both your short-term needs and long-term goals. High-yield savings accounts currently offer around 3-5% interest, while investments may provide higher returns with increased risk. How much do you currently have saved, and what are you saving for?";
        }
        // Risk assessment
        else if (userQuery.includes("risk") || userQuery.includes("safe") || userQuery.includes("volatile")) {
          response = "Every investment carries some level of risk. Generally, stocks and cryptocurrencies are more volatile (higher risk and potential return), while bonds and savings accounts are more stable (lower risk and return). Your risk tolerance should guide your investment choices. Would you describe yourself as conservative, moderate, or aggressive with your investments?";
        }
        // Investment timing
        else if (userQuery.includes("when") || userQuery.includes("timing") || userQuery.includes("market")) {
          response = "While timing the market perfectly is nearly impossible, consistent investing over time (dollar-cost averaging) often yields good results. The best time to invest is typically when you have money you won't need in the near future. Would you like to learn more about dollar-cost averaging?";
        }
        // Fallback to general investment advice
        else {
          const generalResponses = [
            "Investing early, even small amounts, can lead to significant growth over time due to compound interest. For example, £100 invested monthly with a 7% annual return could grow to over £120,000 in 30 years.",
            "A diversified portfolio that includes different asset classes (stocks, bonds, real estate) can help manage risk while pursuing growth. What's your current investment mix?",
            "For new investors, index funds or ETFs can be an excellent starting point as they provide instant diversification and typically have low fees. Would you like me to explain more about index investing?",
            "When evaluating investments, consider factors beyond just potential returns: fees, tax implications, and how they fit into your overall financial plan all matter.",
            "Round-ups are a great way to start investing without feeling the impact on your budget. By rounding up purchases to the nearest pound, you can gradually build your investment portfolio."
          ];
          response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
        }

        // Remove the typing indicator and add the actual response
        setCoachMessages(prevMessages => {
          // Remove the last message if it's the typing indicator
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          // Add the actual response
          return [...filteredMessages, { sender: "coach", text: response }];
        });
      } catch (error) {
        console.error("Error generating coach response:", error);
        // Remove the typing indicator and add an error message
        setCoachMessages(prevMessages => {
          // Remove the last message if it's the typing indicator
          const filteredMessages = prevMessages.filter((msg, i, arr) => 
            !(i === arr.length - 1 && msg.sender === "coach" && msg.text === "...")
          );
          
          // Add an error message
          return [...filteredMessages, { 
            sender: "coach", 
            text: "I'm having trouble providing information at the moment. Please try again later." 
          }];
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
