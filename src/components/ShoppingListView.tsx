import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  DollarSign,
  Calculator,
  ChevronDown,
  ChevronUp,
  Store,
  BadgePercent
} from 'lucide-react';
import { ShoppingItem, Priority, Category } from '../types';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  targetBudget: number;
  onToggleItem: (id: string) => void;
  onEditItem: (item: ShoppingItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
  onSwapStoreBrands: () => void;
  onOpenPortionCalc: () => void;
}

type GroupBy = 'department' | 'category' | 'none';

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  targetBudget,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onSwapStoreBrands,
  onOpenPortionCalc,
}) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('department');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);
  const purchasedItems = items.filter((item) => item.isPurchased);
  const totalPurchased = purchasedItems.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);
  const progressPercent = totalEstimated > 0 ? Math.min(100, Math.round((totalPurchased / totalEstimated) * 100)) : 0;

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Grouping logic
  const groupedData: Record<string, ShoppingItem[]> = {};
  if (groupBy === 'department') {
    filteredItems.forEach((item) => {
      const key = item.vendor || 'CymbalMart Pantry & Aisle';
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(item);
    });
  } else if (groupBy === 'category') {
    filteredItems.forEach((item) => {
      const key = item.category.toUpperCase();
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(item);
    });
  } else {
    groupedData['All Items'] = filteredItems;
  }

  const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
    essential: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    recommended: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    optional: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Budget Progress Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">Curated CymbalMart Shopping List</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                {items.length} items
              </span>
            </div>
            <p className="text-xs text-[#6B655D] mt-0.5">
              Calculated quantities tailored to guest headcount and mapped to store aisles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Store Brand Value Swap Button */}
            <button
              id="swap-store-brand-btn"
              onClick={onSwapStoreBrands}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#D6C5B0] text-xs font-semibold text-[#7A633F] transition-colors"
              title="Substitute items with CymbalMart store brands to save ~20%"
            >
              <BadgePercent className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Apply Store Brand Savings (-20%)</span>
            </button>

            {/* Portion Calculator Button */}
            <button
              id="open-portion-calc-btn"
              onClick={onOpenPortionCalc}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#D6C5B0] text-xs font-medium text-[#524B43] transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Portion Rules</span>
            </button>

            {/* Add Item Button */}
            <button
              id="add-custom-item-btn"
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Live Shopping Progress */}
        <div className="mt-4 pt-4 border-t border-[#F0EBE3] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#524B43]">
              <span>Carted Progress ({purchasedItems.length}/{items.length} items)</span>
              <span className="font-bold text-[#1A1A1A]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EAE2D5] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B08D57] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-around bg-[#F8F5F2] rounded-xl p-2.5 text-xs">
            <div>
              <span className="text-[#8C847B] block text-[10px] uppercase font-bold">Cart Total</span>
              <span className="font-bold text-emerald-700 text-sm">${Math.round(totalPurchased * 100) / 100}</span>
            </div>
            <div className="h-6 w-px bg-[#D6C5B0]" />
            <div>
              <span className="text-[#8C847B] block text-[10px] uppercase font-bold">Est. Total</span>
              <span className="font-bold text-[#1A1A1A] text-sm">${Math.round(totalEstimated * 100) / 100}</span>
            </div>
            <div className="h-6 w-px bg-[#D6C5B0]" />
            <div>
              <span className="text-[#8C847B] block text-[10px] uppercase font-bold">Target Budget</span>
              <span className="font-bold text-[#7A633F] text-sm">${targetBudget}</span>
            </div>
          </div>

          <div className="text-right text-xs text-[#6B655D]">
            {totalEstimated <= targetBudget ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                ✓ Within budget by ${Math.round(targetBudget - totalEstimated)}
              </span>
            ) : (
              <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                ⚠ Over budget target by ${Math.round(totalEstimated - targetBudget)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Group Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8F5F2] p-2 rounded-xl border border-[#E8E2D9]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C847B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, ingredients, notes..."
            className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] outline-none shadow-2xs"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-[#8C847B] uppercase mr-1">Filter:</span>
          {(['all', 'essential', 'recommended', 'optional'] as const).map((pri) => (
            <button
              key={pri}
              onClick={() => setSelectedPriority(pri)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                selectedPriority === pri
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#524B43] border border-[#D6C5B0] hover:bg-[#FAF7F2]'
              }`}
            >
              {pri}
            </button>
          ))}
        </div>

        {/* Group By Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] font-semibold text-[#8C847B] uppercase mr-1">Group:</span>
          <div className="flex bg-white rounded-lg border border-[#D6C5B0] p-0.5">
            <button
              onClick={() => setGroupBy('department')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                groupBy === 'department' ? 'bg-[#EAE2D5] text-[#1A1A1A] font-bold' : 'text-[#6B655D] hover:text-[#1A1A1A]'
              }`}
            >
              Department
            </button>
            <button
              onClick={() => setGroupBy('category')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                groupBy === 'category' ? 'bg-[#EAE2D5] text-[#1A1A1A] font-bold' : 'text-[#6B655D] hover:text-[#1A1A1A]'
              }`}
            >
              Category
            </button>
            <button
              onClick={() => setGroupBy('none')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                groupBy === 'none' ? 'bg-[#EAE2D5] text-[#1A1A1A] font-bold' : 'text-[#6B655D] hover:text-[#1A1A1A]'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        {Object.keys(groupedData).length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-12 text-center text-[#6B655D]">
            <p className="text-sm font-medium">No shopping items match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPriority('all');
              }}
              className="mt-3 text-xs text-[#B08D57] font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          Object.entries(groupedData).map(([groupTitle, groupItems]) => {
            const isCollapsed = collapsedGroups[groupTitle];
            const groupTotal = groupItems.reduce((s, i) => s + i.estimatedTotalPrice, 0);
            const groupPurchased = groupItems.filter((i) => i.isPurchased).length;

            return (
              <div key={groupTitle} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(groupTitle)}
                  className="bg-[#FAF7F2] px-5 py-3 border-b border-[#E8E2D9] flex items-center justify-between cursor-pointer hover:bg-[#F3EDE2] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#B08D57]" />
                    <span className="font-semibold text-sm text-[#1A1A1A]">{groupTitle}</span>
                    <span className="text-[11px] text-[#6B655D] font-medium">
                      ({groupPurchased}/{groupItems.length} checked)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#1A1A1A]">${Math.round(groupTotal * 100) / 100}</span>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-[#8C847B]" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-[#8C847B]" />
                    )}
                  </div>
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#F0EBE3]">
                    {groupItems.map((item) => {
                      const pColor = priorityColors[item.priority] || priorityColors.essential;
                      return (
                        <div
                          key={item.id}
                          className={`p-4 transition-colors flex items-start gap-3.5 ${
                            item.isPurchased ? 'bg-[#FAF7F2]/60 opacity-75' : 'hover:bg-[#FAF7F2]/40'
                          }`}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => onToggleItem(item.id)}
                            className="mt-0.5 text-[#B08D57] hover:scale-110 transition-transform"
                            title={item.isPurchased ? 'Mark as needed' : 'Mark as carted'}
                          >
                            {item.isPurchased ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#D6C5B0]" />
                            )}
                          </button>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-sm font-semibold ${
                                    item.isPurchased ? 'line-through text-[#8C847B]' : 'text-[#1A1A1A]'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pColor.bg} ${pColor.text} ${pColor.border} uppercase`}
                                >
                                  {item.priority}
                                </span>
                                {item.vendor && groupBy !== 'department' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#6B655D]">
                                    {item.vendor.replace('CymbalMart ', '')}
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                                  ${item.estimatedTotalPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Subtext: Quantity & Notes */}
                            <div className="flex items-center justify-between text-xs text-[#6B655D] mt-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#3D3730] bg-[#F3EDE2] px-2 py-0.5 rounded-md">
                                  Qty: {item.quantity}
                                </span>
                                {item.estimatedUnitPrice > 0 && (
                                  <span className="text-[11px] text-[#8C847B]">
                                    (@ ${item.estimatedUnitPrice.toFixed(2)} ea)
                                  </span>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onEditItem(item)}
                                  className="p-1 rounded-md text-[#8C847B] hover:text-[#1A1A1A] hover:bg-[#EAE2D5] transition-colors"
                                  title="Edit item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="p-1 rounded-md text-[#8C847B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {item.notes && (
                              <p className="text-[11px] text-[#7A633F] bg-[#FAF7F2] px-2.5 py-1 rounded-lg mt-1.5 border border-[#F0EBE3]">
                                💡 {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
