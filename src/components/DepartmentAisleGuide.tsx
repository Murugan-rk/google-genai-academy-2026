import React, { useState } from 'react';
import {
  Store,
  MapPin,
  CheckCircle,
  Circle,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { ShoppingItem } from '../types';
import { STORE_DEPARTMENTS_CONFIG } from '../data/mockTemplates';

interface DepartmentAisleGuideProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
}

export const DepartmentAisleGuide: React.FC<DepartmentAisleGuideProps> = ({
  items,
  onToggleItem,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>(STORE_DEPARTMENTS_CONFIG[0].name);

  // Group items by exact department
  const deptItems: Record<string, ShoppingItem[]> = {};
  STORE_DEPARTMENTS_CONFIG.forEach((d) => {
    deptItems[d.name] = items.filter(
      (item) => (item.vendor || '').toLowerCase().includes(d.name.toLowerCase().replace('cymbalmart ', '')) ||
        (item.suggestedStore || '').toLowerCase().includes(d.name.toLowerCase().replace('cymbalmart ', ''))
    );
  });

  // Calculate stats
  const totalDepartmentsWithItems = Object.values(deptItems).filter((list) => list.length > 0).length;
  const activeList = deptItems[selectedDept] || [];
  const activeCompleted = activeList.filter((i) => i.isPurchased).length;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">In-Store CymbalMart Aisle Navigator</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Route Optimized
                </span>
              </div>
              <p className="text-xs text-[#6B655D]">
                Speed through checkout by following the sequential aisle route mapped directly to your party cart.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F2] px-3.5 py-2 rounded-xl border border-[#E8E2D9] text-xs">
            <Clock className="w-4 h-4 text-[#B08D57]" />
            <span>
              Est. In-Store Shopping Time: <strong>~18 mins</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sequential Route Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STORE_DEPARTMENTS_CONFIG.map((dept, idx) => {
          const list = deptItems[dept.name] || [];
          const isSelected = selectedDept === dept.name;
          const isDone = list.length > 0 && list.every((i) => i.isPurchased);

          return (
            <button
              key={dept.name}
              onClick={() => setSelectedDept(dept.name)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#EAE2D5] border-[#B08D57] shadow-sm'
                  : 'bg-white border-[#E8E2D9] hover:border-[#D6C5B0] hover:bg-[#FAF7F2]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#7A633F] border border-[#E8E2D9]">
                    Stop {idx + 1}
                  </span>
                  <span className="text-[10px] text-[#8C847B] font-mono">{dept.badge}</span>
                </div>
                <div className="font-semibold text-xs text-[#1A1A1A] line-clamp-1">
                  {dept.name.replace('CymbalMart ', '')}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0EBE3] flex items-center justify-between text-[11px]">
                <span className={list.length > 0 ? 'font-bold text-[#1A1A1A]' : 'text-[#8C847B]'}>
                  {list.length} {list.length === 1 ? 'item' : 'items'}
                </span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Department Details & Item Checklist */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
        <div className="bg-[#FAF7F2] p-5 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B08D57] text-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{selectedDept}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                  {STORE_DEPARTMENTS_CONFIG.find((d) => d.name === selectedDept)?.badge}
                </span>
              </div>
              <p className="text-xs text-[#6B655D]">
                {STORE_DEPARTMENTS_CONFIG.find((d) => d.name === selectedDept)?.description}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#6B655D] font-medium">
            Progress: <strong>{activeCompleted}</strong> of {activeList.length} items checked
          </div>
        </div>

        {/* Item List for Active Department */}
        {activeList.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#8C847B]">
            No items assigned to {selectedDept} in the current party plan.
          </div>
        ) : (
          <div className="divide-y divide-[#F0EBE3]">
            {activeList.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  item.isPurchased ? 'bg-[#FAF7F2]/60' : 'hover:bg-[#FAF7F2]/40'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => onToggleItem(item.id)}
                    className="mt-0.5 text-[#B08D57] hover:scale-110 transition-transform shrink-0"
                  >
                    {item.isPurchased ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#D6C5B0]" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span
                      className={`text-sm font-semibold ${
                        item.isPurchased ? 'line-through text-[#8C847B]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-[#6B655D] mt-0.5">
                      <span className="bg-[#F3EDE2] px-2 py-0.5 rounded text-[#3D3730] font-medium">
                        Qty: {item.quantity}
                      </span>
                      {item.notes && <span className="truncate max-w-md italic text-[#7A633F]">💡 {item.notes}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A]">
                    ${item.estimatedTotalPrice.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-[#8C847B]">@ ${item.estimatedUnitPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
