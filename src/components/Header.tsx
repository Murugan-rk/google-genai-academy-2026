import React from 'react';
import { Sparkles, ShoppingBag, PlusCircle, Printer, MessageSquare, CheckCircle2, RotateCcw } from 'lucide-react';
import { PartyPlan } from '../types';

interface HeaderProps {
  currentPlan: PartyPlan | null;
  onOpenNewParty: () => void;
  onOpenCheckout: () => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onResetToSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  onOpenNewParty,
  onOpenCheckout,
  onToggleAiChat,
  isAiChatOpen,
  onResetToSample,
}) => {
  const purchasedCount = currentPlan?.shoppingList.filter((i) => i.isPurchased).length || 0;
  const totalItemsCount = currentPlan?.shoppingList.length || 0;
  const totalSpent = currentPlan?.shoppingList
    .filter((i) => i.isPurchased)
    .reduce((sum, i) => sum + i.estimatedTotalPrice, 0) || 0;

  const totalEstimated = currentPlan?.shoppingList.reduce((sum, i) => sum + i.estimatedTotalPrice, 0) || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5F2]/95 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Plan Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#1A1A1A] tracking-tight">CymbalMart</span>
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                  Shopping Agent
                </span>
              </div>
              <p className="text-xs text-[#6B655D] font-medium truncate max-w-[280px] sm:max-w-md">
                {currentPlan ? currentPlan.details.title : 'AI-Powered Event Concierge & Shopping Engine'}
              </p>
            </div>
          </div>

          {/* Quick Chat trigger on mobile */}
          <button
            id="mobile-ai-chat-btn"
            onClick={onToggleAiChat}
            className="md:hidden p-2 rounded-lg bg-white border border-[#D6C5B0] text-[#1A1A1A] hover:bg-[#F3EDE2] transition-colors relative"
            title="Chat with AI Agent"
          >
            <MessageSquare className="w-5 h-5 text-[#B08D57]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </button>
        </div>

        {/* Live Status Indicators & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          {currentPlan && (
            <div className="hidden lg:flex items-center gap-3 bg-white/80 border border-[#E3DCCE] rounded-xl px-3.5 py-1.5 shadow-xs text-xs">
              <div className="flex items-center gap-1.5 text-[#524B43]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong className="text-[#1A1A1A]">{purchasedCount}</strong> of {totalItemsCount} carted
                </span>
              </div>
              <div className="h-3.5 w-px bg-[#D6C5B0]" />
              <div className="text-[#524B43]">
                Est. Total: <strong className="text-[#1A1A1A]">${Math.round(totalEstimated)}</strong>
              </div>
            </div>
          )}

          {/* Reset button */}
          <button
            id="header-preset-btn"
            onClick={onResetToSample}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-[#6B655D] hover:text-[#1A1A1A] hover:bg-[#EAE2D5]/70 transition-colors border border-transparent hover:border-[#D6C5B0]"
            title="Switch or Reload Party Presets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Presets
          </button>

          {/* Print button */}
          <button
            id="header-print-btn"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-[#6B655D] hover:text-[#1A1A1A] hover:bg-[#EAE2D5]/70 transition-colors border border-transparent hover:border-[#D6C5B0]"
            title="Print Shopping List & Timeline"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          {/* AI Chat Drawer Button */}
          <button
            id="header-ai-chat-btn"
            onClick={onToggleAiChat}
            className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs border ${
              isAiChatOpen
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#D6C5B0] hover:bg-[#FAF7F2]'
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${isAiChatOpen ? 'text-[#D6C5B0]' : 'text-[#B08D57]'}`} />
            <span>AI Concierge</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Plan New Event Button */}
          <button
            id="header-plan-new-btn"
            onClick={onOpenNewParty}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-[#D6C5B0] text-[#1A1A1A] hover:bg-[#FAF7F2] shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#B08D57]" />
            <span>New Event</span>
          </button>

          {/* Store Checkout / Pickup Button */}
          <button
            id="header-checkout-btn"
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CymbalMart Checkout</span>
            {purchasedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-[#7A633F] text-[10px] font-bold">
                {purchasedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
