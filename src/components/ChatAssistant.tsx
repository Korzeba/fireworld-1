'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/10 backdrop-blur-lg text-orange-500">
      <div className="flex-none p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-orange-500">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 text-lg font-medium ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white ml-12'
                  : 'bg-white/5 text-orange-500 mr-12'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-lg p-4 text-orange-500 mr-12 text-lg font-medium">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex-none p-4 border-t border-white/10">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-w-0 p-3 bg-white/5 border border-white/10 rounded-lg text-orange-500 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex-none p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 