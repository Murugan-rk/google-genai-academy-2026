import { PartyDetails } from '../types';

export interface PartyPreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  icon: string;
  details: PartyDetails;
}

export const PARTY_PRESETS: PartyPreset[] = [
  {
    id: 'cocktail_grazing',
    name: 'Sunset Cocktail & Artisanal Grazing',
    tagline: 'Sophisticated charcuterie boards, craft spritzes, and warm ambient lounge vibes.',
    category: 'Cocktails & Social',
    icon: 'Wine',
    details: {
      title: 'Sunset Cocktail & Artisanal Grazing Soirée',
      eventType: 'Cocktail & Social',
      theme: 'Warm Sunset Lounge & Artisanal Grazing',
      guestCount: 14,
      budget: 280,
      locationType: 'Home Patio / Living Room',
      dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Cracker Alternative'],
      vibesAndNotes: 'Warm amber lighting, curated jazz vinyl, effortless grazing station with CymbalMart artisanal cheeses and sparkling cocktails.'
    }
  },
  {
    id: 'taco_fiesta',
    name: 'Craft Taco & Margarita Fiesta',
    tagline: 'Sizzling taco bar with fresh guacamole, spicy salsas, and citrus margaritas.',
    category: 'Dinner & Casual',
    icon: 'Flame',
    details: {
      title: 'Epic Craft Taco & Margarita Fiesta',
      eventType: 'Dinner Party',
      theme: 'Modern Mexican Street Food & Vibrant Fiesta',
      guestCount: 16,
      budget: 220,
      locationType: 'Backyard / Kitchen Island',
      dietaryRestrictions: ['Gluten-Free Corn Tortillas', 'Dairy-Free Salsa Option'],
      vibesAndNotes: 'Vibrant colors, build-your-own taco bar with warm carnitas and grilled peppers, homemade salsa trio, and fresh lime agave mocktails.'
    }
  },
  {
    id: 'italian_wine_pasta',
    name: 'Tuscan Wine & Homemade Pasta Night',
    tagline: 'Rustic Italian feast with Chianti, freshly grated parmesan, and warm focaccia.',
    category: 'Dinner & Casual',
    icon: 'Utensils',
    details: {
      title: 'Rustic Tuscan Wine & Pasta Night',
      eventType: 'Dinner Party',
      theme: 'Rustic Italian Trattoria & Candlelight',
      guestCount: 10,
      budget: 195,
      locationType: 'Dining Room',
      dietaryRestrictions: ['Vegetarian Friendly'],
      vibesAndNotes: 'Long dinner table with olive branches and candles, rich Chianti, handmade tagliatelle with rustic ragu and garlic herb focaccia.'
    }
  },
  {
    id: 'summer_bbq',
    name: 'Backyard Smokehouse BBQ & Brews',
    tagline: 'Smoked meats, crisp coleslaw, sweet cornbread, and chilled craft beers.',
    category: 'Outdoor & Casual',
    icon: 'Sparkles',
    details: {
      title: 'Summer Backyard Smokehouse BBQ',
      eventType: 'Barbecue / Cookout',
      theme: 'Rustic American Smokehouse & Lawn Games',
      guestCount: 20,
      budget: 320,
      locationType: 'Backyard Lawn',
      dietaryRestrictions: ['Nut-Free'],
      vibesAndNotes: 'Smoked brisket and grilled chicken sliders, honey jalapeño cornbread, cold brew iced tea and lawn cornhole.'
    }
  },
  {
    id: 'brunch_bubbly',
    name: 'Boutique Garden Brunch & Bubbly',
    tagline: 'Fluffy pastries, mimosa bar with fresh juices, and floral table accents.',
    category: 'Brunch & Morning',
    icon: 'Coffee',
    details: {
      title: 'Sunday Garden Brunch & Mimosa Bar',
      eventType: 'Brunch',
      theme: 'Botanical Garden & Pastel Florals',
      guestCount: 12,
      budget: 185,
      locationType: 'Sunroom / Garden Patio',
      dietaryRestrictions: ['Vegetarian', 'Dairy-Free Oat Milk'],
      vibesAndNotes: 'Build-your-own mimosa station with berry purees, bakery croissants, smoked salmon bagels, and fresh fruit skewers.'
    }
  },
  {
    id: 'game_night_bites',
    name: 'Late-Night Board Games & Snack Station',
    tagline: 'High-energy snacks, gourmet popcorn, craft sodas, and multiplayer fun.',
    category: 'Casual & Games',
    icon: 'Gamepad2',
    details: {
      title: 'Ultimate Board Game & Gourmet Snacks Night',
      eventType: 'Game Night',
      theme: 'Retro Cozy Arcade & Gourmet Finger Foods',
      guestCount: 8,
      budget: 120,
      locationType: 'Living Room Coffee Table',
      dietaryRestrictions: ['Nut-Free'],
      vibesAndNotes: 'Easy non-greasy finger foods for board game cards, truffle parmesan popcorn, slider bites, and craft sodas.'
    }
  }
];

export const STORE_DEPARTMENTS_CONFIG = [
  {
    name: 'CymbalMart Produce & Fresh',
    badge: 'Aisles 1-3',
    color: 'emerald',
    icon: 'Apple',
    description: 'Crisp organic greens, ripe citrus, fresh herbs, berries, and floral arrangements.'
  },
  {
    name: 'CymbalMart Deli & Prepared',
    badge: 'Aisles 4-5',
    color: 'amber',
    icon: 'Ham',
    description: 'Artisanal cheeses, cured charcuterie boards, gourmet dips, and hot kitchen specials.'
  },
  {
    name: 'CymbalMart Bakery',
    badge: 'Aisle 6',
    color: 'orange',
    icon: 'Croissant',
    description: 'Freshly baked baguettes, artisanal sourdough, custom celebration cakes, and mini pastries.'
  },
  {
    name: 'CymbalMart Wine & Spirits',
    badge: 'Aisles 7-9',
    color: 'purple',
    icon: 'Wine',
    description: 'Curated reserve wines, chilled prosecco, craft beers, aperitifs, and cocktail mixers.'
  },
  {
    name: 'CymbalMart Pantry & Aisle',
    badge: 'Aisles 10-14',
    color: 'blue',
    icon: 'Package',
    description: 'Sparkling mineral waters, organic snacks, sauces, specialty condiments, and oils.'
  },
  {
    name: 'CymbalMart Party Supplies',
    badge: 'Aisle 15',
    color: 'rose',
    icon: 'Gift',
    description: 'Eco-friendly bamboo dinnerware, 3-ply napkins, LED candles, garlands, and ice coolers.'
  }
];
