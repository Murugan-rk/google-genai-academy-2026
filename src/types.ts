export type Priority = 'essential' | 'recommended' | 'optional';
export type Category = 'food' | 'drinks' | 'decor' | 'supplies' | 'favors' | 'entertainment' | 'other';

export type CymbalDepartment =
  | 'CymbalMart Produce & Fresh'
  | 'CymbalMart Deli & Prepared'
  | 'CymbalMart Bakery'
  | 'CymbalMart Wine & Spirits'
  | 'CymbalMart Pantry & Aisle'
  | 'CymbalMart Party Supplies';

export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  vendor: string;
  quantity: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  isPurchased: boolean;
  priority: Priority;
  notes: string;
  suggestedStore?: string;
}

export interface TimelineTask {
  id: string;
  timeframe: string;
  task: string;
  category: string;
  isCompleted: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface DrinkRecipe {
  name: string;
  description: string;
  ingredients: string[];
  recipeNotes?: string;
}

export interface ThemeConcept {
  vibeSummary: string;
  colorPalette: ColorSwatch[];
  playlistSuggestions: string[];
  signatureCocktail: DrinkRecipe;
  signatureMocktail: DrinkRecipe;
  gameIdeas: string[];
  invitationWording: string;
  foodServingStyle: string;
  decorHighlights: string[];
}

export interface BudgetSummary {
  targetBudget: number;
  totalEstimatedSpend: number;
  costPerGuest: number;
  spendByCategory: Record<string, number>;
  savingsTips: string[];
}

export interface PartyDetails {
  title: string;
  eventType: string;
  theme: string;
  guestCount: number;
  budget: number;
  locationType: string;
  dietaryRestrictions: string[];
  vibesAndNotes: string;
}

export interface PartyPlan {
  id: string;
  createdAt: string;
  details: PartyDetails;
  shoppingList: ShoppingItem[];
  timeline: TimelineTask[];
  themeConcept: ThemeConcept;
  budgetSummary: BudgetSummary;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
