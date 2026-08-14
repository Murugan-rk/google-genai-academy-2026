import React, { useState } from 'react';
import { X, Check, Trash2, PlusCircle } from 'lucide-react';
import { ShoppingItem, Category, Priority } from '../types';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ShoppingItem) => void;
  onDelete?: (id: string) => void;
  initialItem?: ShoppingItem | null;
}

const DEPARTMENTS = [
  'CymbalMart Produce & Fresh',
  'CymbalMart Deli & Prepared',
  'CymbalMart Bakery',
  'CymbalMart Wine & Spirits',
  'CymbalMart Pantry & Aisle',
  'CymbalMart Party Supplies',
];

const CATEGORIES: Category[] = ['food', 'drinks', 'decor', 'supplies', 'favors', 'entertainment', 'other'];

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialItem,
}) => {
  const isEditing = Boolean(initialItem);
  const [formData, setFormData] = useState<ShoppingItem>(
    initialItem || {
      id: 'item_' + Date.now(),
      name: '',
      category: 'food',
      vendor: 'CymbalMart Deli & Prepared',
      quantity: '1 pack',
      estimatedUnitPrice: 9.99,
      estimatedTotalPrice: 9.99,
      isPurchased: false,
      priority: 'essential',
      notes: '',
      suggestedStore: 'CymbalMart Deli & Prepared',
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#F8F5F2] border border-[#E8E2D9] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-white px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
            {isEditing ? 'Edit Shopping Item' : 'Add Item to CymbalMart List'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#8C847B] hover:text-[#1A1A1A] hover:bg-[#F3EDE2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3D3730] mb-1">Item Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. CymbalMart Artisanal Triple Cream Brie"
              className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2 text-sm text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1">Department</label>
              <select
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value, suggestedStore: e.target.value })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace('CymbalMart ', '')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1">Quantity</label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 2 platters, 3 bottles"
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.estimatedUnitPrice}
                onChange={(e) => {
                  const unit = Number(e.target.value);
                  setFormData({
                    ...formData,
                    estimatedUnitPrice: unit,
                    estimatedTotalPrice: Math.round(unit * 100) / 100,
                  });
                }}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1">Est. Total ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.estimatedTotalPrice}
                onChange={(e) => setFormData({ ...formData, estimatedTotalPrice: Number(e.target.value) })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D3730] mb-1">Priority</label>
            <div className="flex gap-2">
              {(['essential', 'recommended', 'optional'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
                    formData.priority === p
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#524B43] border-[#D6C5B0] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D3730] mb-1">Notes / Brand Tip</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Keep chilled, grab gluten-free label"
              className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="border-t border-[#E8E2D9] pt-4 flex items-center justify-between">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(formData.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#6B655D] hover:text-[#1A1A1A] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-xs"
              >
                {isEditing ? 'Save Changes' : 'Add to List'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
