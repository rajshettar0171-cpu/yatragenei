import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, User, Sparkles, MapPin, AlertTriangle } from "lucide-react";
import type { ChatMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryId?: string;
}

export default function ChatModal({ isOpen, onClose, itineraryId }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Shimla travel assistant. Ask me about crowd levels, road conditions, alternative spots, or anything else about your trip!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        context: { itineraryId },
      });
      return response as ChatMessage;
    },
    onSuccess: (response: ChatMessage) => {
      setMessages((prev) => [...prev, response]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0" data-testid="dialog-chat">
        {/* Header */}
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Travel Assistant
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 h-[400px]">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${index}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Context Cards */}
                  {message.context && (
                    <div className="space-y-2 mt-2">
                      {message.context.spots && message.context.spots.length > 0 && (
                        <div className="space-y-2">
                          {message.context.spots.map((spot) => (
                            <div
                              key={spot.id}
                              className="bg-card border rounded-md p-3 text-sm"
                            >
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-medium">{spot.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {spot.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.context.alerts && message.context.alerts.length > 0 && (
                        <div className="space-y-2">
                          {message.context.alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm"
                            >
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-medium">{alert.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {alert.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`text-xs text-muted-foreground ${message.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Footer */}
        <div className="p-4 bg-muted/30">
          <div className="flex items-end gap-2">
            <Input
              placeholder="Ask about crowd levels, road conditions, alternatives..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate text-xs"
              onClick={() => setInput("Is Kufri crowded today?")}
            >
              Is Kufri crowded today?
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate text-xs"
              onClick={() => setInput("Alternative to Mall Road?")}
            >
              Alternative to Mall Road?
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate text-xs"
              onClick={() => setInput("Any road closures?")}
            >
              Any road closures?
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
