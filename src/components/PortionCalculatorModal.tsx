import React, { useState } from 'react';
import { X, Users, Calculator, Info, Wine, Coffee, Utensils, Check } from 'lucide-react';

interface PortionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestCount: number;
  onApplyGuestCount?: (newCount: number) => void;
}

export const PortionCalculatorModal: React.FC<PortionCalculatorModalProps> = ({
  isOpen,
  onClose,
  guestCount: initialGuestCount,
  onApplyGuestCount,
}) => {
  const [guests, setGuests] = useState(initialGuestCount || 12);
  const [durationHours, setDurationHours] = useState(3);
  const [eventType, setEventType] = useState<'cocktail' | 'dinner' | 'bbq'>('cocktail');

  if (!isOpen) return null;

  // Exact catering industry portioning formulas
  const appetizerPiecesPerPerson = eventType === 'cocktail' ? 5 : eventType === 'dinner' ? 3 : 2;
  const totalAppetizers = guests * appetizerPiecesPerPerson;
  const proteinLbsPerGuest = eventType === 'bbq' ? 0.6 : eventType === 'dinner' ? 0.45 : 0.25;
  const totalProteinLbs = Math.round(guests * proteinLbsPerGuest * 10) / 10;
  const drinksPerHourPerGuest = 1.25;
  const totalDrinksNeeded = Math.ceil(guests * durationHours * drinksPerHourPerGuest);
  const wineBottles = Math.ceil((totalDrinksNeeded * 0.5) / 5); // 5 glasses per bottle
  const beerCans = Math.ceil(totalDrinksNeeded * 0.3);
  const nonAlcoholicSodasOrWaters = Math.ceil(totalDrinksNeeded * 0.2);
  const iceLbs = Math.ceil(guests * 1.5);
  const dinnerPlates = Math.ceil(guests * 1.5);
  const cocktailNapkins = Math.ceil(guests * 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#F8F5F2] border border-[#E8E2D9] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-white px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B08D57] text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                CymbalMart Smart Portion & Quantity Calculator
              </h3>
              <p className="text-[11px] text-[#6B655D]">
                Industry standard catering formulas customized for your guest count.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#8C847B] hover:text-[#1A1A1A] hover:bg-[#F3EDE2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Controls */}
          <div className="grid grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-[#E8E2D9]">
            <div>
              <label className="block text-[11px] font-semibold text-[#524B43] mb-1">Guests</label>
              <input
                type="number"
                min="2"
                max="150"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#F8F5F2] border border-[#D6C5B0] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#524B43] mb-1">Party Duration</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-[#F8F5F2] border border-[#D6C5B0] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A]"
              >
                <option value={2}>2 Hours (Quick social)</option>
                <option value={3}>3 Hours (Standard)</option>
                <option value={4}>4 Hours (Long evening)</option>
                <option value={5}>5+ Hours (All-day)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#524B43] mb-1">Style</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full bg-[#F8F5F2] border border-[#D6C5B0] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A]"
              >
                <option value="cocktail">Cocktail & Grazing</option>
                <option value="dinner">Sit-down Dinner</option>
                <option value="bbq">Backyard BBQ / Feast</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Utensils className="w-3 h-3 text-[#B08D57]" /> Appetizer Pieces
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{totalAppetizers} pcs</div>
              <div className="text-[10px] text-[#6B655D]">({appetizerPiecesPerPerson} per guest)</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Utensils className="w-3 h-3 text-[#B08D57]" /> Main Protein / Meat
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{totalProteinLbs} lbs</div>
              <div className="text-[10px] text-[#6B655D]">({proteinLbsPerGuest} lbs / guest)</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Wine className="w-3 h-3 text-purple-600" /> Wine (750ml)
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{wineBottles} bottles</div>
              <div className="text-[10px] text-[#6B655D]">(~{wineBottles * 5} glasses total)</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Wine className="w-3 h-3 text-amber-600" /> Beer / Ciders
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{beerCans} cans</div>
              <div className="text-[10px] text-[#6B655D]">({Math.ceil(beerCans / 6)} six-packs)</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Coffee className="w-3 h-3 text-blue-600" /> Sparkling Waters & Sodas
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{nonAlcoholicSodasOrWaters} cans</div>
              <div className="text-[10px] text-[#6B655D]">({Math.ceil(nonAlcoholicSodasOrWaters / 12)} twelve-packs)</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
              <div className="text-[11px] text-[#8C847B] font-medium flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-600" /> Party Ice Bags
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{iceLbs} lbs</div>
              <div className="text-[10px] text-[#6B655D]">({Math.ceil(iceLbs / 10)} x 10lb bags)</div>
            </div>
          </div>

          {/* Tableware Rules */}
          <div className="bg-[#EFE9DF] rounded-xl p-3.5 text-xs text-[#524B43] space-y-1.5 border border-[#DDD3C4]">
            <div className="font-semibold text-[#1A1A1A]">CymbalMart Tableware & Supply Rules of Thumb:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Dinner / Grazing Plates:</strong> 1.5x guest count ({dinnerPlates} plates) for seconds & dessert.</li>
              <li><strong>Cocktail Napkins:</strong> 3x guest count ({cocktailNapkins} napkins) for appetizers and drinks.</li>
              <li><strong>Glassware:</strong> 2 cups or glasses per person minimum to avoid glass mixing.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white px-6 py-3.5 border-t border-[#E8E2D9] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6B655D] hover:text-[#1A1A1A]"
          >
            Close
          </button>
          {onApplyGuestCount && (
            <button
              onClick={() => {
                onApplyGuestCount(guests);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-xs"
            >
              Update Party to {guests} Guests
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
