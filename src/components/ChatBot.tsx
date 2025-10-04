import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Train } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  role: "user" | "bot";
  content: string;
  alternative_routes?: AlternativeRoute[];
}

interface AlternativeRoute {
  origin: string;
  destination: string;
  routes: {
    train_name: string;
    train_number: string;
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    duration: string;
  }[];
  total_price: number;
  total_duration: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hello! I'm your KAI booking assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const sessionIdRef = useRef<string>("");
  const [alternativeRoutes, setAlternativeRoutes] = useState<
    AlternativeRoute[]
  >([]);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID();
    }
  }, []);

  const quickActions = [
    "Check my refunds",
    "Find alternative route",
    "See latest delays",
    "Book a ticket",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setAlternativeRoutes([]); // Clear previous alternative routes

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversation_history: newMessages,
          session_id: sessionIdRef.current,
          language: navigator.language,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const botResponse = await response.json();

      const botMessage: Message = {
        role: "bot",
        content: botResponse.content,
      };

      if (botResponse.alternative_routes) {
        setAlternativeRoutes(botResponse.alternative_routes);
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching from API:", error);
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I'm having trouble connecting to the server.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    // Use a timeout to ensure the input state is updated before sending
    setTimeout(() => handleSend(), 0);
  };

  return (
    <>
      {/* Chat bubble trigger */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:scale-110 transition-transform"
          variant="hero"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
              <span className="font-semibold text-primary-foreground">
                KAI Assistant
              </span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {alternativeRoutes.length > 0 && (
                <div className="space-y-2">
                  {alternativeRoutes.map((route, index) => (
                    <Card key={index} className="p-3">
                      <div className="font-semibold flex items-center gap-2 mb-2">
                        <Train className="h-4 w-4" />
                        Alternative Route {index + 1}
                      </div>
                      {route.routes.map((segment, sIndex) => (
                        <div key={sIndex} className="text-xs mb-1">
                          - {segment.train_name} ({segment.origin} to{" "}
                          {segment.destination})
                        </div>
                      ))}
                      <div className="text-xs text-muted-foreground mt-2">
                        Total Duration: {route.total_duration}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Price: Rp{" "}
                        {route.total_price.toLocaleString("id-ID")}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        asChild
                      >
                        <Link
                          to={`/alternative-booking?route=${encodeURIComponent(
                            JSON.stringify(route)
                          )}`}
                          target="_blank"
                        >
                          Book This Route
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" variant="hero">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;