import React from 'react';
import {
  DollarSign,
  PieChart,
  TrendingDown,
  Users,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BudgetSummary, ShoppingItem } from '../types';

interface BudgetAnalyticsProps {
  budget: BudgetSummary;
  shoppingList: ShoppingItem[];
  guestCount: number;
  onApplySavingsTip?: (tipText: string) => void;
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({
  budget,
  shoppingList,
  guestCount,
  onApplySavingsTip,
}) => {
  const totalSpend = shoppingList.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);
  const targetBudget = budget.targetBudget || 250;
  const costPerGuest = Math.round((totalSpend / (guestCount || 1)) * 100) / 100;
  const isUnderBudget = totalSpend <= targetBudget;
  const variance = Math.abs(Math.round(totalSpend - targetBudget));

  // Compute live category breakdown from current shopping list items
  const categoryTotals: Record<string, number> = {
    food: 0,
    drinks: 0,
    decor: 0,
    supplies: 0,
    favors: 0,
    other: 0,
  };

  shoppingList.forEach((item) => {
    const cat = item.category.toLowerCase();
    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += item.estimatedTotalPrice;
    } else {
      categoryTotals.other += item.estimatedTotalPrice;
    }
  });

  const categoryColors: Record<string, { bar: string; badge: string; text: string }> = {
    food: { bar: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Food & Platters' },
    drinks: { bar: 'bg-purple-600', badge: 'bg-purple-50 text-purple-800 border-purple-200', text: 'Wine, Beer & Drinks' },
    decor: { bar: 'bg-amber-600', badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Decor & Lighting' },
    supplies: { bar: 'bg-blue-600', badge: 'bg-blue-50 text-blue-800 border-blue-200', text: 'Tableware & Supplies' },
    favors: { bar: 'bg-rose-600', badge: 'bg-rose-50 text-rose-800 border-rose-200', text: 'Party Favors' },
    other: { bar: 'bg-stone-500', badge: 'bg-stone-50 text-stone-800 border-stone-200', text: 'Other Items' },
  };

  return (
    <div className="space-y-6">
      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Spend */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C847B] uppercase tracking-wider">Total Estimated Spend</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#B08D57] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-bold text-2xl text-[#1A1A1A]">${Math.round(totalSpend * 100) / 100}</div>
            <div className="text-xs mt-1 flex items-center gap-1.5">
              {isUnderBudget ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ${variance} under target
                </span>
              ) : (
                <span className="text-amber-800 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> ${variance} over target
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cost Per Guest */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C847B] uppercase tracking-wider">Cost Per Guest</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#B08D57] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-bold text-2xl text-[#1A1A1A]">${costPerGuest}</div>
            <div className="text-xs text-[#6B655D] mt-1">Based on {guestCount} confirmed guests</div>
          </div>
        </div>

        {/* Target Budget */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C847B] uppercase tracking-wider">Budget Target</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#7A633F] flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-bold text-2xl text-[#1A1A1A]">${targetBudget}</div>
            <div className="text-xs text-[#6B655D] mt-1">
              Efficiency: {Math.round((totalSpend / targetBudget) * 100)}% allocated
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Spend Allocation */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Spend Allocation by Category</h3>
              <p className="text-xs text-[#6B655D]">Live breakdown calculated from active shopping cart items.</p>
            </div>
          </div>
        </div>

        {/* Stacked Visual Bar */}
        <div className="w-full h-3 rounded-full bg-[#EAE2D5] flex overflow-hidden mb-6">
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            if (amount <= 0 || totalSpend <= 0) return null;
            const pct = (amount / totalSpend) * 100;
            const style = categoryColors[cat] || categoryColors.other;
            return <div key={cat} style={{ width: `${pct}%` }} className={`${style.bar} h-full transition-all`} />;
          })}
        </div>

        {/* Category Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            if (amount <= 0) return null;
            const pct = totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0;
            const style = categoryColors[cat] || categoryColors.other;
            const count = shoppingList.filter((i) => i.category.toLowerCase() === cat).length;

            return (
              <div
                key={cat}
                className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.bar}`} />
                    <span className="text-xs font-bold text-[#1A1A1A]">{style.text}</span>
                  </div>
                  <span className="text-[11px] text-[#6B655D] block">
                    {count} items • {pct}% of total spend
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-sm text-[#1A1A1A]">${Math.round(amount * 100) / 100}</span>
                  <span className="block text-[10px] text-[#8C847B]">
                    (~${Math.round((amount / (guestCount || 1)) * 100) / 100}/guest)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Smart Savings Recommendations */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
              CymbalMart AI Smart Savings & Budget Hacks
            </h3>
            <p className="text-xs text-[#6B655D]">Automated recommendations to trim cost without sacrificing party quality.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {budget.savingsTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#F0EBE3] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#EAE2D5] text-[#7A633F] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-[#3D3730] leading-relaxed font-medium">{tip}</p>
              </div>

              {onApplySavingsTip && (
                <button
                  onClick={() => onApplySavingsTip(tip)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B08D57] hover:text-[#7A633F] self-end"
                >
                  <span>Ask AI Agent to apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
