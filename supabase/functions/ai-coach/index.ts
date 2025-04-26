
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Simple but effective coaching responses for financial questions
    const responses = {
      default: "I'm here to help you with any questions about investing, savings, or using the Sprout app. Feel free to ask anything!",
      
      // Investment basics
      investment: "Investing is putting money into assets like stocks or bonds with the goal of growing your wealth over time. With Sprout, you can start investing with any amount and we'll help guide you through the process.",
      
      stocks: "Stocks represent ownership in companies. When you buy a stock, you own a small piece of that company. Through Sprout, you can invest in stocks with guidance on diversification and risk management.",
      
      etf: "ETFs (Exchange-Traded Funds) are collections of many stocks or bonds in one package. They're a great way for beginners to invest because they offer instant diversification. Sprout offers several ETF options for different investment goals.",
      
      risk: "Investment risk is the possibility of losing money. Sprout helps manage risk through diversification and personalized investment strategies based on your goals and comfort level.",
      
      // Savings related
      savings: "Saving is setting aside money for future needs. Sprout offers high-yield savings accounts and helps you set and track savings goals.",
      
      interest: "Interest is what banks pay you for keeping money in savings accounts. Sprout's high-yield savings accounts offer competitive interest rates to help your money grow.",
      
      emergency: "An emergency fund is money saved for unexpected expenses. We recommend saving 3-6 months of expenses. Sprout can help you build this fund gradually.",
      
      // App specific
      features: "Sprout offers investment accounts, high-yield savings, goal tracking, automated investing, and personalized financial guidance - all in one easy-to-use app.",
      
      start: "To get started with Sprout: 1) Create an account, 2) Set your financial goals, 3) Choose your investment strategy, and 4) Start investing or saving with any amount you're comfortable with.",
      
      security: "Sprout uses bank-level security to protect your information and investments. All accounts are FDIC/SIPC insured up to standard limits."
    };

    // Simple keyword matching for responses
    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI coach function:', error);
    return new Response(JSON.stringify({ 
      response: "I'm here to help! Could you please rephrase your question?" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
