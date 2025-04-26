import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const appFeatures: { [key: string]: string } = {
  Battery: 'Your battery level shows how much charge is remaining, along with the estimated driving range.',
  'Motor Temp': 'Motor temperature indicates the heat level of your EV’s motor; keeping it in a normal range ensures good performance.',
  Distance: 'Distance tracks how far you have traveled on your current trip, shown in kilometers.',
  Payload: 'Payload is the total weight your vehicle is carrying including cargo and passengers. It is important to stay within safe limits.',
  'Route Planner':
    'The Route Planner helps you plan and optimize your trip, including suggesting charging stops and most efficient routes.',
  'Power System Maintenance':
    'Maintaining your power system involves monitoring battery health, motor temperature, and scheduling regular checkups.',
  'Safety Suite':
    'The Safety Suite monitors your driving safety metrics like obstacle avoidance and emergency braking, keeping you protected.',
  'Eco Insights':
    'Eco Insights track your environmental impact, energy efficiency, and CO₂ savings compared with traditional vehicles.',
};

const commonReplies: { [key: string]: string } = {
  hi: '👋 Hello! How can I assist you with your EV today?',
  hello: '👋 Hello! How can I assist you with your EV today?',
  hey: '👋 Hi there! What can I do for your EV today?',
  bye: 'Goodbye! Have a great day! 😊',
  'see you later': 'See you later! Drive safely! 🚗💨',
  thanks: "You're welcome! Let me know if you need anything else.",
  'thank you': "You're welcome! I'm here to help anytime.",
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([
    {
      text: "Hi! 👋 I'm your EV assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'app' | 'casual'>('app');
  const [selectedFeature, setSelectedFeature] = useState<string>('');

  const fetchResponseFromHuggingFace = async (input: string): Promise<string> => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
        { inputs: input },
        {
          headers: {
            Authorization: 'Bearer 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',
          },
        }
      );
      setIsLoading(false);

      if (response.data && response.data.generated_text) {
        return response.data.generated_text;
      } else {
        console.error('Unexpected API response format:', response.data);
        return "Sorry, I couldn't process your request.";
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching response from Hugging Face:', error.response || error.message);
      return 'An error occurred while fetching the response. Please try again later.';
    }
  };

  const handleUserMessage = async (text: string) => {
    const cleaned = text.toLowerCase().trim();

    if (commonReplies[cleaned]) {
      setMessages((prev) => [
        ...prev,
        { text, isUser: true },
        { text: commonReplies[cleaned], isUser: false },
      ]);
      return;
    }

    if (mode === 'app') {
      setMessages((prev) => [
        ...prev,
        { text: text, isUser: true },
        { text: 'Please select a feature from the dropdown.', isUser: false },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { text, isUser: true }]);
    const responseText = await fetchResponseFromHuggingFace(text);
    setMessages((prev) => [...prev, { text: responseText, isUser: false }]);
  };

  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    if (!feature) return;

    setMessages((prev) => [
      ...prev,
      { text: feature, isUser: true },
      { text: appFeatures[feature], isUser: false },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await handleUserMessage(inputValue);
    setInputValue('');
  };

  const handleModeChange = (newMode: 'app' | 'casual') => {
    setMode(newMode);
    setSelectedFeature('');
    setInputValue('');
  };

  const handleClose = () => {
    setMessages([
      {
        text: "Hi! 👋 I'm your EV assistant. How can I help you today?",
        isUser: false,
      },
    ]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg bg-cyber-purple hover:bg-cyber-bright-purple transition-colors duration-200 z-[100]"
        aria-label="Open chat"
      >
        <MessageCircle />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-xl bg-background border-cyber-purple z-[100] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-border">
        <h3 className="font-semibold text-foreground">EV Assistant</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClose}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="p-3 border-b border-border">
            <label htmlFor="mode-select" className="block mb-1 font-medium">
              Select Mode:
            </label>
            <select
              id="mode-select"
              value={mode}
              onChange={(e) => handleModeChange(e.target.value as 'app' | 'casual')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="app">App Functionality</option>
              <option value="casual">Casual Talk</option>
            </select>
          </div>

          {mode === 'app' && (
            <div className="p-3 border-b border-border">
              <label htmlFor="feature-select" className="block mb-1 font-medium">
                Select Feature:
              </label>
              <select
                id="feature-select"
                value={selectedFeature}
                onChange={(e) => handleFeatureSelect(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Choose a feature --</option>
                {Object.keys(appFeatures).map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3 h-96 overflow-y-auto flex flex-col gap-2 bg-background">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.isUser
                    ? 'ml-auto bg-cyber-purple text-white'
                    : 'mr-auto bg-muted text-foreground'
                } rounded-lg p-2 max-w-[80%]`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-muted rounded-lg p-2 max-w-[80%]">
                Typing...
              </div>
            )}
          </div>

          {mode === 'casual' && (
            <form onSubmit={handleSubmit} className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                />
                <Button type="submit" size="sm" disabled={isLoading}>
                  Send
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </Card>
  );
};

export default ChatBot;