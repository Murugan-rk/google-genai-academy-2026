import React, { useState } from 'react';
import { X, Sparkles, Users, DollarSign, MapPin, Wine, Utensils, Check, HelpCircle, Layers } from 'lucide-react';
import { PartyDetails } from '../types';
import { PARTY_PRESETS } from '../data/mockTemplates';

interface PartyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: PartyDetails) => Promise<void>;
  isLoading: boolean;
  initialDetails?: PartyDetails;
}

const COMMON_DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Halal',
  'Kosher',
  'Low Sugar / Keto'
];

const EVENT_TYPES = [
  'Cocktail & Social',
  'Dinner Party',
  'Birthday Celebration',
  'Barbecue / Cookout',
  'Brunch & Bubbly',
  'Game Night',
  'Baby / Bridal Shower',
  'Holiday Feast',
  'Housewarming'
];

export const PartyFormModal: React.FC<PartyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialDetails,
}) => {
  const [details, setDetails] = useState<PartyDetails>(
    initialDetails || {
      title: 'Summer Patio Grazing Soirée',
      eventType: 'Cocktail & Social',
      theme: 'Warm Sunset & Artisanal Grazing',
      guestCount: 12,
      budget: 250,
      locationType: 'Home Patio / Living Room',
      dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Cracker Alternative'],
      vibesAndNotes: 'Warm ambient lighting, curated indie jazz, effortless finger foods with CymbalMart cheeses and craft spritzes.',
    }
  );

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (presetId: string) => {
    const preset = PARTY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setDetails({ ...preset.details });
    }
  };

  const handleToggleDietary = (option: string) => {
    setDetails((prev) => {
      const exists = prev.dietaryRestrictions.includes(option);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((d) => d !== option)
          : [...prev.dietaryRestrictions, option],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(details);
  };

  // Quick portion heuristics
  const estimatedAppetizers = details.guestCount * 4;
  const estimatedMeatLbs = Math.round(details.guestCount * 0.4 * 10) / 10;
  const estimatedWineBottles = Math.ceil(details.guestCount * 0.6);
  const estimatedNapkins = details.guestCount * 2.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#F8F5F2] border border-[#E8E2D9] rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">Plan a New Party with CymbalMart AI</h2>
              <p className="text-xs text-[#6B655D]">
                Enter event details or pick a curated template to generate instant store-mapped shopping lists & timelines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C847B] hover:text-[#1A1A1A] p-2 rounded-lg hover:bg-[#F3EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#524B43] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#B08D57]" />
                Curated CymbalMart Event Presets
              </label>
              <span className="text-[11px] text-[#8C847B]">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PARTY_PRESETS.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p.id)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EAE2D5] border-[#B08D57] shadow-xs'
                        : 'bg-white border-[#E8E2D9] hover:border-[#D6C5B0] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#1A1A1A] line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-[#6B655D] mt-0.5 line-clamp-2">{p.tagline}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#8C847B] font-medium pt-1 border-t border-[#F0EBE3]">
                      <span>{p.details.guestCount} guests</span>
                      <span className="text-[#7A633F] font-semibold">${p.details.budget}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E8E2D9] pt-4" />

          {/* Core Event Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5">Event Title</label>
              <input
                type="text"
                required
                value={details.title}
                onChange={(e) => setDetails({ ...details, title: e.target.value })}
                placeholder="e.g. Sunset Cocktail & Artisanal Grazing"
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5">Event Type</label>
              <select
                value={details.eventType}
                onChange={(e) => setDetails({ ...details, eventType: e.target.value })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#B08D57]" />
                  Guest Count
                </span>
                <span className="text-xs font-bold text-[#7A633F]">{details.guestCount} Guests</span>
              </label>
              <input
                type="number"
                min="2"
                max="100"
                required
                value={details.guestCount}
                onChange={(e) => setDetails({ ...details, guestCount: Math.max(1, Number(e.target.value)) })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#B08D57]" />
                  Target Budget ($)
                </span>
                <span className="text-xs font-bold text-[#7A633F]">
                  ~${Math.round(details.budget / (details.guestCount || 1))}/guest
                </span>
              </label>
              <input
                type="number"
                min="20"
                max="5000"
                step="10"
                required
                value={details.budget}
                onChange={(e) => setDetails({ ...details, budget: Math.max(10, Number(e.target.value)) })}
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5">Theme / Style</label>
              <input
                type="text"
                value={details.theme}
                onChange={(e) => setDetails({ ...details, theme: e.target.value })}
                placeholder="e.g. Modern Rustic, Pastel Boho, Tropical Retro"
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3730] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B08D57]" />
                Location / Setting
              </label>
              <input
                type="text"
                value={details.locationType}
                onChange={(e) => setDetails({ ...details, locationType: e.target.value })}
                placeholder="e.g. Home Patio, Dining Room, Backyard, Rooftop"
                className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>
          </div>

          {/* Portion Estimation preview box */}
          <div className="bg-[#EFE9DF] border border-[#DDD3C4] rounded-xl p-3.5 text-xs text-[#524B43]">
            <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
              Smart CymbalMart Guest Portioning for {details.guestCount} Guests
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-2">
              <div className="bg-white/70 rounded-lg p-2">
                <span className="text-[#8C847B] block">Appetizer Bites:</span>
                <span className="font-semibold text-[#1A1A1A]">~{estimatedAppetizers} pieces</span>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <span className="text-[#8C847B] block">Wine / Beverages:</span>
                <span className="font-semibold text-[#1A1A1A]">~{estimatedWineBottles} bottles</span>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <span className="text-[#8C847B] block">Meat / Proteins:</span>
                <span className="font-semibold text-[#1A1A1A]">~{estimatedMeatLbs} lbs</span>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <span className="text-[#8C847B] block">Paper Goods / Napkins:</span>
                <span className="font-semibold text-[#1A1A1A]">~{Math.round(estimatedNapkins)} count</span>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#3D3730] mb-2">
              Dietary Flags & Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_DIETARY_OPTIONS.map((option) => {
                const isSelected = details.dietaryRestrictions.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleToggleDietary(option)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-[#524B43] border-[#D6C5B0] hover:border-[#B08D57]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes & Specific Intent */}
          <div>
            <label className="block text-xs font-semibold text-[#3D3730] mb-1.5">
              Specific Instructions, Music Vibes, or Menu Ideas
            </label>
            <textarea
              rows={2}
              value={details.vibesAndNotes}
              onChange={(e) => setDetails({ ...details, vibesAndNotes: e.target.value })}
              placeholder="e.g. Include a sparkling signature mocktail, keep finger food easy to eat standing up, focus on store brand value."
              className="w-full bg-white border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none shadow-2xs transition-colors resize-none"
            />
          </div>

          {/* Footer & Actions */}
          <div className="border-t border-[#E8E2D9] pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6B655D] hover:text-[#1A1A1A] hover:bg-[#EAE2D5] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-plan-party-btn"
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white shadow-sm flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating CymbalMart Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Party Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
