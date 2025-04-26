
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCoach } from "@/contexts/CoachContext";
import { Send, Bot, User } from "lucide-react";

const sampleQuestions = [
  "What are round-ups?",
  "How do I invite friends?",
  "Can I save for a specific goal?",
  "What features come with Sprout?"
];

const Coach = () => {
  const { coachMessages, addCoachMessage } = useCoach();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachMessages]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    addCoachMessage({
      sender: "user",
      text: message,
    });
    
    setMessage("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 10000);
  };
  
  const handleSampleQuestion = (question: string) => {
    setMessage(question);
    
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const isTypingIndicator = (text: string) => text === "...";

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Coach 🤖</h1>
        <p className="text-gray-600">Your financial and investment assistant</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-230px)] flex flex-col animate-slide-up">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {coachMessages.map((msg, index) => {
            if (msg.sender === "coach" && isTypingIndicator(msg.text)) return null;
            
            return (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "coach" && (
                  <div className="w-8 h-8 rounded-full bg-sprout-blue/20 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-sprout-blue text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-sprout-lavender/20 flex items-center justify-center ml-2 flex-shrink-0">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}
          
          {(isTyping || coachMessages.some(msg => msg.sender === "coach" && isTypingIndicator(msg.text))) && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-sprout-blue/20 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="rounded-2xl px-4 py-2 bg-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
        
        {coachMessages.length <= 1 && (
          <div className="p-4 border-t border-gray-100">
            <h3 className="font-semibold mb-3">Popular Questions</h3>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestion(question)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask Coach about investments, savings, or market data..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-sprout-blue hover:bg-sprout-blue/90"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;
