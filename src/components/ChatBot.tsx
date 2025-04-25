import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChatBotProps {
  battery: number;
  distance: string;
  obstacleAvoidance: boolean;
  emergencyBraking: boolean;
  pathFollowing: 'active' | 'inactive';
}

const ChatBot: React.FC<ChatBotProps> = ({
  battery,
  distance,
  obstacleAvoidance,
  emergencyBraking,
  pathFollowing,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: 'Hi! I\'m your EV assistant. How can I help you today?', isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleQuestionMatch = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('battery') || lowerInput.includes('charge')) {
      const formattedBattery = battery.toFixed(1);
      return `The current battery level is ${formattedBattery}%`;
    }
    if (lowerInput.includes('far') || lowerInput.includes('distance') || lowerInput.includes('range')) {
      return `The current distance covered is ${distance} km`;
    }
    if (lowerInput.includes('obstacle') || lowerInput.includes('avoidance')) {
      return `Obstacle avoidance is ${obstacleAvoidance ? 'enabled' : 'disabled'}`;
    }
    if (lowerInput.includes('emergency') || lowerInput.includes('braking')) {
      return `Emergency braking is ${emergencyBraking ? 'active' : 'inactive'}`;
    }
    if (lowerInput.includes('path') || lowerInput.includes('following')) {
      return `Path following is currently ${pathFollowing}`;
    }
    return "I'm not sure about that. Try asking about battery, distance, obstacle avoidance, emergency braking, or path following status.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    const botResponse = { text: handleQuestionMatch(inputValue), isUser: false };

    setMessages([...messages, userMessage, botResponse]);
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg bg-cyber-purple hover:bg-cyber-bright-purple transition-colors duration-200 z-[100]"
      >
        <MessageCircle />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-xl bg-background border-cyber-purple z-[100]">
      <div className="flex justify-between items-center p-3 border-b border-border">
        <h3 className="font-semibold text-foreground">EV Assistant</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="p-3 h-64 overflow-y-auto flex flex-col gap-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${message.isUser ? 'ml-auto bg-cyber-purple text-white' : 'mr-auto bg-muted'} rounded-lg p-2 max-w-[80%]`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your EV..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button type="submit" size="sm">
                Send
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};

export default ChatBot;