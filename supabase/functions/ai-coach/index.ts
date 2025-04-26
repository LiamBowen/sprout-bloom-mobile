import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const questionsAndAnswers = [
  {
    question: "What are round-ups?",
    answer: "Round-ups automatically round up your purchases to the nearest pound and invest the spare change. Spend £2.60 on coffee? We round it to £3 and invest the 40p for you."
  },
  {
    question: "What's a high-yield savings pot?",
    answer: "A high-yield savings pot is like a digital piggy bank that earns more interest than a regular savings account — helping you grow your money safely, while keeping it accessible."
  },
  {
    question: "What are lifestyle portfolios?",
    answer: "Lifestyle portfolios let you invest based on your values or interests — like climate-friendly funds, tech innovation, or social impact. It's investing that aligns with you."
  },
  {
    question: "What is auto-investing?",
    answer: "Auto-investing means setting up regular, automatic deposits into your portfolio — like £10 every week — so you grow your investments without needing to remember."
  },
  {
    question: "Can I pause round-ups?",
    answer: "Yes, you’re in control. You can pause or turn off round-ups at any time from your settings."
  },
  {
    question: "Is my money safe with Sprout?",
    answer: "Your investments are held with regulated partners, and your account is protected with bank-level encryption and security standards. Safety is our priority."
  },
  {
    question: "What’s the minimum to start?",
    answer: "You can start investing with as little as £1. No need for big deposits — just build a habit and let time do the work."
  },
  {
    question: "Do I have to pick stocks myself?",
    answer: "Nope! Sprout helps you choose portfolios based on your goals and interests. We take care of the research — you just set your vibe."
  },
  {
    question: "Are there any fees?",
    answer: "We offer a free basic plan, and an optional subscription (£3–5/month) for extra features like group savings, insights, and premium coaching."
  },
  {
    question: "Can I invite friends?",
    answer: "Yes! Sprout is social-first. You’ll be able to see what your friends are investing in (without exact amounts) and grow your finances together."
  },
  {
    question: "What if I don’t understand investing?",
    answer: "That’s exactly why we built Sprout. The app breaks everything down in plain English, with an AI coach to guide you through every step."
  },
  {
    question: "Can I save for specific goals?",
    answer: "Yes — you can create goal-based savings pots, like for a holiday or new laptop, and set automatic contributions to stay on track."
  },
  {
    question: "Is Sprout available outside the UK?",
    answer: "We're starting in the UK, but plan to expand to Europe, the US, and beyond as we grow."
  },
  {
    question: "Does investing affect my taxes?",
    answer: "It can, but many investments in the UK are tax-free up to £20,000/year in an ISA. We’ll guide you through the best setup for your situation."
  },
  {
    question: "How do group savings work?",
    answer: "Group saving lets you and friends/family contribute to a shared goal — like a trip or gift — and track progress together in one pot."
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const userInput = message.toLowerCase();

    // Find exact match first
    const exactMatch = questionsAndAnswers.find(qa =>
      userInput.includes(qa.question.toLowerCase())
    );

    // If no exact match, find most relevant answer based on keywords
    let response;
    if (exactMatch) {
      response = exactMatch.answer;
    } else {
      const matchingAnswers = questionsAndAnswers.filter(qa => {
        const keywords = qa.question.toLowerCase().split(' ');
        return keywords.some(word => word.length > 3 && userInput.includes(word));
      });

      if (matchingAnswers.length > 0) {
        // Return the first matching answer
        response = matchingAnswers[0].answer;
      } else {
        // Default response for no matches
        response = "I'm here to help you understand investing, savings, and how to make the most of Sprout! Could you please rephrase your question?";
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
