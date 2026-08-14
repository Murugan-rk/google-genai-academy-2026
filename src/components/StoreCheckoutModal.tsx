import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Store,
  CreditCard,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PartyPlan, ShoppingItem } from '../types';

interface StoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const StoreCheckoutModal: React.FC<StoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const items = plan.shoppingList;
  const subtotal = items.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);
  const memberDiscount = Math.round(subtotal * 0.05 * 100) / 100; // 5% CymbalMart Club savings
  const estTax = Math.round(subtotal * 0.0825 * 100) / 100;
  const deliveryFee = fulfillmentType === 'delivery' ? 5.99 : 0;
  const finalTotal = Math.round((subtotal - memberDiscount + estTax + deliveryFee) * 100) / 100;

  const handlePlaceOrder = () => {
    setIsOrdered(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#F8F5F2] border border-[#E8E2D9] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                {isOrdered ? 'CymbalMart Order Confirmation' : 'CymbalMart Express Checkout'}
              </h3>
              <p className="text-xs text-[#6B655D]">
                {plan.details.title} • {items.length} Curated Items
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#8C847B] hover:text-[#1A1A1A] hover:bg-[#F3EDE2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isOrdered ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                Order #CYM-{Math.floor(100000 + Math.random() * 900000)} Placed Successfully
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#1A1A1A]">Ready for {fulfillmentType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}!</h2>
              <p className="text-xs text-[#6B655D] max-w-md mx-auto">
                Your CymbalMart team is preparing your platters, bakery items, chilled drinks, and tableware in store.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-[#524B43]">
                <span>Fulfillment:</span>
                <strong className="text-[#1A1A1A] capitalize">{fulfillmentType === 'pickup' ? 'Curbside Express Pickup' : 'White Glove Home Delivery'}</strong>
              </div>
              <div className="flex justify-between text-[#524B43]">
                <span>Estimated Ready Time:</span>
                <strong className="text-[#1A1A1A]">Today, by 4:30 PM</strong>
              </div>
              <div className="flex justify-between text-[#524B43]">
                <span>Total Paid:</span>
                <strong className="text-[#1A1A1A] font-serif font-bold text-sm">${finalTotal}</strong>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-[#D6C5B0] text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Order Receipt
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Review Screen */
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Fulfillment Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524B43] mb-2">
                Fulfillment Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    fulfillmentType === 'pickup'
                      ? 'bg-white border-[#B08D57] shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E8E2D9] text-[#6B655D]'
                  }`}
                >
                  <Store className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">Store Curbside Pickup</div>
                    <div className="text-[11px] text-[#6B655D]">Free • Ready in 2 Hours</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'bg-white border-[#B08D57] shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E8E2D9] text-[#6B655D]'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">Direct Home Delivery</div>
                    <div className="text-[11px] text-[#6B655D]">+$5.99 • Chilled Packaging</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Itemized preview summary */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#1A1A1A] block">Order Summary ({items.length} Items)</span>
              <div className="max-h-40 overflow-y-auto divide-y divide-[#F0EBE3] pr-2">
                {items.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="font-medium text-[#1A1A1A] block truncate">{item.name}</span>
                      <span className="text-[11px] text-[#8C847B]">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#1A1A1A] shrink-0">${item.estimatedTotalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Math breakdown */}
              <div className="border-t border-[#F0EBE3] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#524B43]">
                  <span>Items Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>CymbalMart Member Savings (5%):</span>
                  <span>-${memberDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#524B43]">
                  <span>Estimated Tax:</span>
                  <span>${estTax.toFixed(2)}</span>
                </div>
                {fulfillmentType === 'delivery' && (
                  <div className="flex justify-between text-[#524B43]">
                    <span>Chilled Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#E8E2D9] pt-2 flex justify-between font-serif font-bold text-base text-[#1A1A1A]">
                  <span>Total Amount:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Satisfaction guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-[#6B655D] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Freshness Guarantee on all CymbalMart deli, bakery, and produce items.</span>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#6B655D] hover:text-[#1A1A1A]"
              >
                Continue Planning
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Place CymbalMart Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
