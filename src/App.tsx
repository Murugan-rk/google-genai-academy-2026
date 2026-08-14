import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Palette,
  Calendar,
  PieChart,
  Compass,
  Sparkles,
  Users,
  DollarSign,
  MapPin,
  PlusCircle,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PartyPlan, PartyDetails, ShoppingItem, TimelineTask } from './types';
import { PARTY_PRESETS } from './data/mockTemplates';
import { Header } from './components/Header';
import { PartyFormModal } from './components/PartyFormModal';
import { ShoppingListView } from './components/ShoppingListView';
import { ThemeConceptCard } from './components/ThemeConceptCard';
import { TimelineView } from './components/TimelineView';
import { BudgetAnalytics } from './components/BudgetAnalytics';
import { DepartmentAisleGuide } from './components/DepartmentAisleGuide';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { StoreCheckoutModal } from './components/StoreCheckoutModal';
import { ItemEditModal } from './components/ItemEditModal';
import { PortionCalculatorModal } from './components/PortionCalculatorModal';

type NavTab = 'shopping' | 'theme' | 'timeline' | 'budget' | 'aisles';

export const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('shopping');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial plan or default preset
  useEffect(() => {
    const saved = localStorage.getItem('cymbalmart_party_plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentPlan(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse saved party plan:', e);
      }
    }

    // Default to first preset
    handleGenerateNewPlan(PARTY_PRESETS[0].details, false);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('cymbalmart_party_plan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  const handleGenerateNewPlan = async (details: PartyDetails, showToastNotification = true) => {
    setIsLoadingPlan(true);
    try {
      const response = await fetch('/api/plan-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setCurrentPlan(data.plan);
        setIsFormModalOpen(false);
        if (showToastNotification) {
          showToast(`Generated CymbalMart party plan for ${details.guestCount} guests!`);
        }
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.error('Plan generation error:', err);
      showToast('Generated smart CymbalMart party plan using local portioning engine.', 'info');
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Item handlers
  const handleToggleItem = (id: string) => {
    if (!currentPlan) return;
    const updated = currentPlan.shoppingList.map((item) =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    setCurrentPlan({ ...currentPlan, shoppingList: updated });
  };

  const handleSaveItem = (item: ShoppingItem) => {
    if (!currentPlan) return;
    const exists = currentPlan.shoppingList.some((i) => i.id === item.id);
    let updatedList: ShoppingItem[];
    if (exists) {
      updatedList = currentPlan.shoppingList.map((i) => (i.id === item.id ? item : i));
      showToast(`Updated "${item.name}"`);
    } else {
      updatedList = [item, ...currentPlan.shoppingList];
      showToast(`Added "${item.name}" to shopping list`);
    }
    setCurrentPlan({ ...currentPlan, shoppingList: updatedList });
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!currentPlan) return;
    const itemToDelete = currentPlan.shoppingList.find((i) => i.id === id);
    const updated = currentPlan.shoppingList.filter((item) => item.id !== id);
    setCurrentPlan({ ...currentPlan, shoppingList: updated });
    if (itemToDelete) {
      showToast(`Removed "${itemToDelete.name}" from shopping list`, 'info');
    }
  };

  const handleSwapStoreBrands = () => {
    if (!currentPlan) return;
    let savings = 0;
    const updated = currentPlan.shoppingList.map((item) => {
      if (!item.name.includes('CymbalMart Value') && !item.name.includes('Everyday')) {
        const oldPrice = item.estimatedTotalPrice;
        const newUnitPrice = Math.round(item.estimatedUnitPrice * 0.8 * 100) / 100;
        const newTotalPrice = Math.round(item.estimatedTotalPrice * 0.8 * 100) / 100;
        savings += oldPrice - newTotalPrice;
        return {
          ...item,
          name: item.name
            .replace('Premium ', 'CymbalMart Everyday ')
            .replace('Artisanal ', 'CymbalMart Value '),
          estimatedUnitPrice: newUnitPrice,
          estimatedTotalPrice: newTotalPrice,
          notes: item.notes ? `${item.notes} (Swapped to CymbalMart store brand)` : 'Swapped to CymbalMart store brand',
        };
      }
      return item;
    });

    setCurrentPlan({ ...currentPlan, shoppingList: updated });
    showToast(`Store brand value swap applied! You saved ~$${Math.round(savings)}!`);
  };

  // Timeline handlers
  const handleToggleTask = (id: string) => {
    if (!currentPlan) return;
    const updated = currentPlan.timeline.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setCurrentPlan({ ...currentPlan, timeline: updated });
  };

  const handleAddTask = (task: TimelineTask) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      timeline: [...currentPlan.timeline, task],
    });
    showToast('Added milestone task to prep timeline');
  };

  const handleDeleteTask = (id: string) => {
    if (!currentPlan) return;
    const updated = currentPlan.timeline.filter((t) => t.id !== id);
    setCurrentPlan({ ...currentPlan, timeline: updated });
    showToast('Deleted task from timeline', 'info');
  };

  // AI chat list modification
  const handleAiUpdateShoppingList = (newList: ShoppingItem[], agentReply: string) => {
    if (!currentPlan) return;
    setCurrentPlan({ ...currentPlan, shoppingList: newList });
    showToast('AI Shopping Concierge updated your party list!');
  };

  const handleResetToPreset = () => {
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex flex-col text-[#1A1A1A] antialiased selection:bg-[#B08D57] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentPlan={currentPlan}
        onOpenNewParty={() => setIsFormModalOpen(true)}
        onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        isAiChatOpen={isAiChatOpen}
        onResetToSample={handleResetToPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Party Summary Banner (Non-promotional, focused operational metadata) */}
        {currentPlan && (
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold text-[#7A633F] tracking-wider">
                  {currentPlan.details.eventType}
                </span>
                <span className="text-[#D6C5B0]">•</span>
                <span className="text-xs font-semibold text-[#524B43]">{currentPlan.details.theme}</span>
              </div>
              <h1 className="font-serif font-bold text-2xl text-[#1A1A1A]">{currentPlan.details.title}</h1>
              <p className="text-xs text-[#6B655D] max-w-2xl">{currentPlan.themeConcept.vibeSummary}</p>
            </div>

            <div className="flex items-center gap-4 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9] text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B08D57]" />
                <div>
                  <span className="text-[10px] text-[#8C847B] block uppercase font-bold">Guests</span>
                  <strong className="text-[#1A1A1A]">{currentPlan.details.guestCount} Attending</strong>
                </div>
              </div>
              <div className="h-7 w-px bg-[#D6C5B0]" />
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#B08D57]" />
                <div>
                  <span className="text-[10px] text-[#8C847B] block uppercase font-bold">Target</span>
                  <strong className="text-[#1A1A1A]">${currentPlan.details.budget} Total</strong>
                </div>
              </div>
              <div className="h-7 w-px bg-[#D6C5B0]" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B08D57]" />
                <div>
                  <span className="text-[10px] text-[#8C847B] block uppercase font-bold">Venue</span>
                  <strong className="text-[#1A1A1A]">{currentPlan.details.locationType}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-[#E8E2D9] overflow-x-auto pb-px">
          <button
            id="tab-shopping-list"
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'shopping'
                ? 'border-[#B08D57] text-[#1A1A1A] bg-white rounded-t-xl'
                : 'border-transparent text-[#6B655D] hover:text-[#1A1A1A] hover:bg-white/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#B08D57]" />
            <span>Shopping List</span>
            {currentPlan && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                {currentPlan.shoppingList.length}
              </span>
            )}
          </button>

          <button
            id="tab-theme-vibes"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'theme'
                ? 'border-[#B08D57] text-[#1A1A1A] bg-white rounded-t-xl'
                : 'border-transparent text-[#6B655D] hover:text-[#1A1A1A] hover:bg-white/50'
            }`}
          >
            <Palette className="w-4 h-4 text-[#B08D57]" />
            <span>Theme & Drinks Concept</span>
          </button>

          <button
            id="tab-timeline-prep"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#B08D57] text-[#1A1A1A] bg-white rounded-t-xl'
                : 'border-transparent text-[#6B655D] hover:text-[#1A1A1A] hover:bg-white/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#B08D57]" />
            <span>Prep Timeline</span>
            {currentPlan && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                {currentPlan.timeline.filter((t) => !t.isCompleted).length} pending
              </span>
            )}
          </button>

          <button
            id="tab-budget-breakdown"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'budget'
                ? 'border-[#B08D57] text-[#1A1A1A] bg-white rounded-t-xl'
                : 'border-transparent text-[#6B655D] hover:text-[#1A1A1A] hover:bg-white/50'
            }`}
          >
            <PieChart className="w-4 h-4 text-[#B08D57]" />
            <span>Budget & Savings</span>
          </button>

          <button
            id="tab-aisle-guide"
            onClick={() => setActiveTab('aisles')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'aisles'
                ? 'border-[#B08D57] text-[#1A1A1A] bg-white rounded-t-xl'
                : 'border-transparent text-[#6B655D] hover:text-[#1A1A1A] hover:bg-white/50'
            }`}
          >
            <Compass className="w-4 h-4 text-[#B08D57]" />
            <span>In-Store Aisle Navigator</span>
          </button>
        </div>

        {/* Tab Content Views */}
        {currentPlan ? (
          <div>
            {activeTab === 'shopping' && (
              <ShoppingListView
                items={currentPlan.shoppingList}
                targetBudget={currentPlan.details.budget}
                onToggleItem={handleToggleItem}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setIsItemModalOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onAddItem={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                onSwapStoreBrands={handleSwapStoreBrands}
                onOpenPortionCalc={() => setIsPortionModalOpen(true)}
              />
            )}

            {activeTab === 'theme' && (
              <ThemeConceptCard theme={currentPlan.themeConcept} eventTitle={currentPlan.details.title} />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                tasks={currentPlan.timeline}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetAnalytics
                budget={currentPlan.budgetSummary}
                shoppingList={currentPlan.shoppingList}
                guestCount={currentPlan.details.guestCount}
                onApplySavingsTip={(tip) => {
                  setIsAiChatOpen(true);
                }}
              />
            )}

            {activeTab === 'aisles' && (
              <DepartmentAisleGuide items={currentPlan.shoppingList} onToggleItem={handleToggleItem} />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B08D57] text-white flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">No Party Plan Loaded</h3>
              <p className="text-xs text-[#6B655D]">Create a custom party or select one of our curated CymbalMart presets.</p>
            </div>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#B08D57] text-white text-xs font-semibold shadow-xs hover:bg-[#9B7B4B] transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plan Your Event</span>
            </button>
          </div>
        )}
      </main>

      {/* Floating AI Concierge Button (Desktop and Mobile) */}
      {!isAiChatOpen && currentPlan && (
        <button
          id="floating-ai-agent-btn"
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1A1A1A] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold transition-all hover:scale-105 border border-white/20 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#B08D57] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>AI Shopping Concierge</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentPlan={currentPlan}
        onUpdateShoppingList={handleAiUpdateShoppingList}
      />

      {/* Party Intake Form Modal */}
      <PartyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={async (details) => {
          await handleGenerateNewPlan(details, true);
        }}
        isLoading={isLoadingPlan}
        initialDetails={currentPlan?.details}
      />

      {/* Item Edit/Add Modal */}
      <ItemEditModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        initialItem={editingItem}
      />

      {/* Portion Calculator Modal */}
      <PortionCalculatorModal
        isOpen={isPortionModalOpen}
        onClose={() => setIsPortionModalOpen(false)}
        guestCount={currentPlan?.details.guestCount || 12}
        onApplyGuestCount={(newCount) => {
          if (currentPlan) {
            handleGenerateNewPlan({
              ...currentPlan.details,
              guestCount: newCount,
            });
          }
        }}
      />

      {/* Checkout / Order Simulator Modal */}
      {currentPlan && (
        <StoreCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          plan={currentPlan}
        />
      )}
    </div>
  );
};
export default App;
