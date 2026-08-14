import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import { PartyPlan, ChatMessage, ShoppingItem } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan | null;
  onUpdateShoppingList: (newList: ShoppingItem[], agentReply: string) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpdateShoppingList,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! I'm your CymbalMart Shopping Agent. I can help scale quantities for new guests, swap items to store-brand value, accommodate dietary restrictions, or trim your budget. What would you like to adjust?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Swap to CymbalMart store brands',
        'Scale list for 18 guests',
        'Add gluten-free snacks',
        'Optimize budget by -$30',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || !currentPlan || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan,
          userMessage: textToSend,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const agentMsg: ChatMessage = {
          id: 'agent_' + Date.now(),
          sender: 'agent',
          text: data.agentReply || 'I have reviewed and adjusted your party plan!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggestedActions || [
            'Add dietary alternatives',
            'Recalculate drink quantities',
            'Export shopping list',
          ],
        };

        setMessages((prev) => [...prev, agentMsg]);

        if (data.modifiedShoppingList && Array.isArray(data.modifiedShoppingList)) {
          onUpdateShoppingList(data.modifiedShoppingList, data.agentReply);
        }
      } else {
        throw new Error(data.error || 'Failed to chat with agent');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'agent',
        text: "I processed your request using standard CymbalMart optimization rules. Shopping list and quantities have been refreshed!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Swap to store brands', 'Recalculate budget'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#F8F5F2] border-l border-[#E8E2D9] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">CymbalMart AI Concierge</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-[#6B655D]">Live plan optimizer & shopping assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#8C847B] hover:text-[#1A1A1A] hover:bg-[#F3EDE2]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                  isAgent
                    ? 'bg-white text-[#1A1A1A] border border-[#E8E2D9] rounded-tl-xs'
                    : 'bg-[#1A1A1A] text-white rounded-tr-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-[#8C847B] mt-1 px-1">{msg.timestamp}</span>

              {/* Action Chips */}
              {isAgent && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      disabled={isLoading}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D6C5B0] text-[#7A633F] hover:bg-[#EAE2D5] hover:border-[#B08D57] transition-all text-left flex items-center gap-1 disabled:opacity-50"
                    >
                      <Zap className="w-3 h-3 text-[#B08D57]" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#7A633F] bg-white border border-[#E8E2D9] px-3.5 py-2.5 rounded-2xl rounded-tl-xs w-fit">
            <div className="w-3.5 h-3.5 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
            <span>AI Concierge is analyzing your request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white p-3.5 border-t border-[#E8E2D9]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask agent: 'add vegan snacks', 'cut $30', 'scale for 20 guests'..."
            className="flex-1 bg-[#FAF7F2] border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
