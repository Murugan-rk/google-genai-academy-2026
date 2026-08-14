import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Wine,
  Coffee,
  Music,
  Gamepad2,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  Utensils,
  Sun
} from 'lucide-react';
import { ThemeConcept } from '../types';

interface ThemeConceptCardProps {
  theme: ThemeConcept;
  eventTitle: string;
}

export const ThemeConceptCard: React.FC<ThemeConceptCardProps> = ({ theme, eventTitle }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(theme.invitationWording);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Vibe Summary Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A633F]">CymbalMart Theme Concept</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE2D5] text-[#1A1A1A] font-semibold">
                Atmosphere & Styling
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">{eventTitle}</h2>
            <p className="text-sm text-[#524B43] leading-relaxed max-w-3xl">{theme.vibeSummary}</p>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-6 pt-5 border-t border-[#F0EBE3]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#524B43] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#B08D57]" />
              Event Color Story
            </h3>
            <span className="text-[11px] text-[#8C847B]">Click swatch to copy hex</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {theme.colorPalette.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <button
                  key={color.hex}
                  onClick={() => handleCopyHex(color.hex)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#D6C5B0] text-left transition-all hover:scale-102"
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow-xs shrink-0 border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-[#1A1A1A] truncate">{color.name}</span>
                    <span className="text-[10px] text-[#8C847B] font-mono">{isCopied ? 'Copied!' : color.hex}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signature Drinks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cocktail */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Wine className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">Signature Cocktail</span>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{theme.signatureCocktail.name}</h3>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#524B43] mb-3.5 leading-relaxed">{theme.signatureCocktail.description}</p>

            <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#F0EBE3] space-y-2">
              <span className="text-[11px] font-bold text-[#524B43] uppercase block">Ingredients & Recipe:</span>
              <ul className="space-y-1 text-xs text-[#3D3730]">
                {theme.signatureCocktail.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {theme.signatureCocktail.recipeNotes && (
            <div className="mt-3 pt-3 border-t border-[#F0EBE3] text-[11px] text-[#7A633F]">
              <strong>Pitcher Prep:</strong> {theme.signatureCocktail.recipeNotes}
            </div>
          )}
        </div>

        {/* Mocktail */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Signature Mocktail</span>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{theme.signatureMocktail.name}</h3>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#524B43] mb-3.5 leading-relaxed">{theme.signatureMocktail.description}</p>

            <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#F0EBE3] space-y-2">
              <span className="text-[11px] font-bold text-[#524B43] uppercase block">Zero-Proof Ingredients:</span>
              <ul className="space-y-1 text-xs text-[#3D3730]">
                {theme.signatureMocktail.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {theme.signatureMocktail.recipeNotes && (
            <div className="mt-3 pt-3 border-t border-[#F0EBE3] text-[11px] text-emerald-900">
              <strong>Serving Tip:</strong> {theme.signatureMocktail.recipeNotes}
            </div>
          )}
        </div>
      </div>

      {/* Serving Style & Decor Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-4 h-4 text-[#B08D57]" />
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Food Serving & Grazing Layout</h3>
          </div>
          <p className="text-xs font-semibold text-[#7A633F] bg-[#FAF7F2] p-3 rounded-xl border border-[#F0EBE3] mb-3">
            {theme.foodServingStyle}
          </p>
          <div className="space-y-2 text-xs text-[#524B43]">
            {theme.decorHighlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Playlists & Music Mood */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-[#B08D57]" />
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Curated Playlist Suggestions</h3>
          </div>
          <div className="space-y-2">
            {theme.playlistSuggestions.map((pl, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F0EBE3] text-xs text-[#1A1A1A]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EAE2D5] text-[#7A633F] text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{pl}</span>
                </div>
                <span className="text-[10px] text-[#8C847B] font-semibold uppercase">Vibe</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games & Icebreakers + Invitation Copy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="w-4 h-4 text-[#B08D57]" />
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Icebreakers & Party Activities</h3>
          </div>
          <div className="space-y-2">
            {theme.gameIdeas.map((game, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F0EBE3] text-xs text-[#3D3730]">
                <div className="font-semibold text-[#1A1A1A]">{game}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitation Text Box */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B08D57]" />
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Ready-to-Send Invitation Wording</h3>
              </div>
              <button
                onClick={handleCopyInvite}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#D6C5B0] text-[#7A633F] transition-colors"
              >
                {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInvite ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#F0EBE3] text-xs text-[#524B43] leading-relaxed italic">
              "{theme.invitationWording}"
            </div>
          </div>

          <p className="text-[11px] text-[#8C847B] mt-3">
            Send via SMS, e-vite, group chat, or paper cards to confirm guest headcount.
          </p>
        </div>
      </div>
    </div>
  );
};
