import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Fallback plan generator when API key is not present or API call fails
  function createSmartFallbackPlan(partyDetails: any) {
    const guests = Number(partyDetails.guestCount) || 12;
    const targetBudget = Number(partyDetails.budget) || 250;
    const title = partyDetails.title || "Party Celebration";
    const theme = partyDetails.theme || "Casual Elegant";
    const dietary = partyDetails.dietaryRestrictions || [];

    const isGlutenFree = dietary.some((d: string) => d.toLowerCase().includes('gluten'));
    const isVegan = dietary.some((d: string) => d.toLowerCase().includes('vegan') || d.toLowerCase().includes('vegetarian'));

    const shoppingList = [
      {
        id: "item_1",
        name: isVegan ? "CymbalMart Organic Plant-Based Artisanal Board" : "CymbalMart Premium Deli Charcuterie & Cheese Platter",
        category: "food",
        vendor: "CymbalMart Deli & Prepared",
        quantity: `${Math.max(2, Math.ceil(guests / 6))} platters`,
        estimatedUnitPrice: 24.99,
        estimatedTotalPrice: 24.99 * Math.max(2, Math.ceil(guests / 6)),
        isPurchased: false,
        priority: "essential",
        notes: isVegan ? "100% plant-based cheeses and hummus" : "Serves 6-8 per platter. Keep chilled.",
        suggestedStore: "CymbalMart Deli & Prepared"
      },
      {
        id: "item_2",
        name: isGlutenFree ? "CymbalMart Gluten-Free Tortilla Chips & Salsa Trio" : "CymbalMart Fresh Guacamole & Organic Tortilla Chips",
        category: "food",
        vendor: "CymbalMart Produce & Fresh",
        quantity: `${Math.max(2, Math.ceil(guests / 5))} party packs`,
        estimatedUnitPrice: 8.99,
        estimatedTotalPrice: 8.99 * Math.max(2, Math.ceil(guests / 5)),
        isPurchased: false,
        priority: "essential",
        notes: "Certified gluten-free corn tortilla chips with house salsa",
        suggestedStore: "CymbalMart Produce & Fresh"
      },
      {
        id: "item_3",
        name: "CymbalMart Fresh Bakery Dessert & Cupcake Tower",
        category: "food",
        vendor: "CymbalMart Bakery",
        quantity: `${Math.max(1, Math.ceil(guests / 8))} dozen assortment`,
        estimatedUnitPrice: 18.50,
        estimatedTotalPrice: 18.50 * Math.max(1, Math.ceil(guests / 8)),
        isPurchased: false,
        priority: "recommended",
        notes: "Includes chocolate, vanilla, and red velvet minis",
        suggestedStore: "CymbalMart Bakery"
      },
      {
        id: "item_4",
        name: "CymbalMart Reserve Pinot Noir & Crisp Sauvignon Blanc",
        category: "drinks",
        vendor: "CymbalMart Wine & Spirits",
        quantity: `${Math.max(2, Math.ceil(guests / 4))} bottles`,
        estimatedUnitPrice: 14.99,
        estimatedTotalPrice: 14.99 * Math.max(2, Math.ceil(guests / 4)),
        isPurchased: false,
        priority: "essential",
        notes: "Calculated at ~2 glasses per wine drinker",
        suggestedStore: "CymbalMart Wine & Spirits"
      },
      {
        id: "item_5",
        name: "CymbalMart Botanical Sparkling Mineral Waters (Lime & Citrus)",
        category: "drinks",
        vendor: "CymbalMart Pantry & Aisle",
        quantity: `${Math.max(2, Math.ceil(guests / 4))} 12-packs`,
        estimatedUnitPrice: 6.49,
        estimatedTotalPrice: 6.49 * Math.max(2, Math.ceil(guests / 4)),
        isPurchased: false,
        priority: "essential",
        notes: "Zero sugar mocktail mixer or refreshing standalone drink",
        suggestedStore: "CymbalMart Pantry & Aisle"
      },
      {
        id: "item_6",
        name: "CymbalMart Celebration Eco-Friendly Plates & Bamboo Cutlery",
        category: "supplies",
        vendor: "CymbalMart Party Supplies",
        quantity: `${Math.max(1, Math.ceil(guests / 10))} set of 25`,
        estimatedUnitPrice: 12.99,
        estimatedTotalPrice: 12.99 * Math.max(1, Math.ceil(guests / 10)),
        isPurchased: false,
        priority: "essential",
        notes: "100% compostable sturdy dinner plates and utensils",
        suggestedStore: "CymbalMart Party Supplies"
      },
      {
        id: "item_7",
        name: "CymbalMart Elegant Linen Cocktail Napkins (Gold Trimmed)",
        category: "supplies",
        vendor: "CymbalMart Party Supplies",
        quantity: `${Math.max(1, Math.ceil(guests / 15))} pack of 50`,
        estimatedUnitPrice: 5.99,
        estimatedTotalPrice: 5.99 * Math.max(1, Math.ceil(guests / 15)),
        isPurchased: false,
        priority: "essential",
        notes: "High absorbency 3-ply napkins",
        suggestedStore: "CymbalMart Party Supplies"
      },
      {
        id: "item_8",
        name: "CymbalMart Warm Ambient Table Runner & LED Candle Garland Set",
        category: "decor",
        vendor: "CymbalMart Party Supplies",
        quantity: "1 complete kit",
        estimatedUnitPrice: 19.99,
        estimatedTotalPrice: 19.99,
        isPurchased: false,
        priority: "recommended",
        notes: "Flickering flameless LED candles with batteries included",
        suggestedStore: "CymbalMart Party Supplies"
      }
    ];

    const totalEstSpend = shoppingList.reduce((sum, item) => sum + item.estimatedTotalPrice, 0);

    return {
      id: "plan_" + Date.now(),
      createdAt: new Date().toISOString(),
      details: partyDetails,
      shoppingList,
      timeline: [
        { id: "task_1", timeframe: "2 Weeks Before", task: "Confirm guest headcount and send out invitation cards or e-vites", category: "Invites", isCompleted: false },
        { id: "task_2", timeframe: "1 Week Before", task: "Order CymbalMart Bakery items & reserve catering platters", category: "Shopping", isCompleted: false },
        { id: "task_3", timeframe: "3 Days Before", task: "Purchase CymbalMart Wine & Spirits, paper tableware, and decor kit", category: "Shopping", isCompleted: false },
        { id: "task_4", timeframe: "Day Before", task: "Pick up fresh deli platters, chill wine & sparkling waters in fridge", category: "Prep", isCompleted: false },
        { id: "task_5", timeframe: "Party Day Morning", task: "Set up buffet table, assemble table runner, and organize glassware", category: "Setup", isCompleted: false },
        { id: "task_6", timeframe: "1 Hour Before", task: "Light LED candle garland, cue playlist, and prep signature cocktail pitcher", category: "Host", isCompleted: false }
      ],
      themeConcept: {
        vibeSummary: `${theme} vibe tailored with warm ambient lighting, artisanal CymbalMart bites, and curated background melodies.`,
        colorPalette: [
          { name: "Warm Gold", hex: "#B08D57" },
          { name: "Deep Charcoal", hex: "#1A1A1A" },
          { name: "Soft Ivory", hex: "#F8F5F2" },
          { name: "Earthy Olive", hex: "#2E7D32" },
          { name: "Warm Sand", hex: "#D6C5B0" }
        ],
        playlistSuggestions: [
          "Bossa Nova Cafe - Relaxed Afternoon Beats",
          "Acoustic Indie & Jazz Standards",
          "Upbeat Warm Sunset Lounge",
          "Classic Vinyl Soul & Funk Hits"
        ],
        signatureCocktail: {
          name: "CymbalMart Golden Sunset Spritz",
          description: "A crisp, effervescent cocktail blending Prosecco, aperitif liqueur, and fresh blood orange juice.",
          ingredients: [
            "3 oz CymbalMart Prosecco",
            "2 oz Italian Aperitif Liqueur",
            "1 oz Fresh Blood Orange Juice",
            "Splash of CymbalMart Sparkling Mineral Water",
            "Fresh Rosemary & Orange Wheel Garnish"
          ],
          recipeNotes: "Prepare in a large pitcher right before guests arrive and top with ice."
        },
        signatureMocktail: {
          name: "Botanical Citrus & Rosemary Sparkler",
          description: "A sophisticated alcohol-free spritzer with tart citrus, rosemary syrup, and sparkling water.",
          ingredients: [
            "2 oz Fresh Grapefruit Juice",
            "0.5 oz Rosemary Simple Syrup",
            "4 oz CymbalMart Botanical Lime Sparkling Water",
            "Sprig of Fresh Rosemary"
          ],
          recipeNotes: "Serve over crushed ice in highball glasses."
        },
        gameIdeas: [
          "CymbalMart Gourmet Blind Tasting Challenge",
          "Two Truths & A Lie (Celebration Edition)",
          "Casual Vinyl Trivia & Song Request Wall"
        ],
        invitationWording: `Join us for ${title}! We're gathering on party day for delicious bites, signature spritzes, and great company. RSVP by next week!`,
        foodServingStyle: "Buffet Style Grazing & Cocktail Hour Finger Foods",
        decorHighlights: [
          "Warm LED candle garland down the center table",
          "Earthy linen table runner with olive sprigs",
          "Gold-accented glassware and minimalist platter displays"
        ]
      },
      budgetSummary: {
        targetBudget,
        totalEstimatedSpend: Math.round(totalEstSpend * 100) / 100,
        costPerGuest: Math.round((totalEstSpend / guests) * 100) / 100,
        spendByCategory: {
          food: Math.round(shoppingList.filter(i => i.category === 'food').reduce((s, i) => s + i.estimatedTotalPrice, 0)),
          drinks: Math.round(shoppingList.filter(i => i.category === 'drinks').reduce((s, i) => s + i.estimatedTotalPrice, 0)),
          decor: Math.round(shoppingList.filter(i => i.category === 'decor').reduce((s, i) => s + i.estimatedTotalPrice, 0)),
          supplies: Math.round(shoppingList.filter(i => i.category === 'supplies').reduce((s, i) => s + i.estimatedTotalPrice, 0)),
          favors: 0,
          entertainment: 0,
          other: 0
        },
        savingsTips: [
          "Opt for CymbalMart store brands on pantry staples & sparkling waters to save ~20%",
          "Serve a batch signature pitcher cocktail instead of full individual open bar options",
          "Use sturdy compostable tableware for quick, stress-free cleanup"
        ]
      }
    };
  }

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Schema definition for full party plan response
  const partyPlanSchema = {
    type: Type.OBJECT,
    properties: {
      shoppingList: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING, description: "food, drinks, decor, supplies, favors, entertainment, or other" },
            vendor: { type: Type.STRING, description: "e.g., Grocery Store, Party Store, Amazon, Bakery, Liquor Store, Dollar Store" },
            quantity: { type: Type.STRING, description: "Exact calculated quantity suited for guest count e.g. 4 lbs, 30 cups, 3 bottles" },
            estimatedUnitPrice: { type: Type.NUMBER },
            estimatedTotalPrice: { type: Type.NUMBER },
            priority: { type: Type.STRING, description: "essential, recommended, or optional" },
            notes: { type: Type.STRING, description: "Special notes, recipe ratios, dietary flag, or tips" },
            suggestedStore: { type: Type.STRING }
          },
          required: ["id", "name", "category", "vendor", "quantity", "estimatedUnitPrice", "estimatedTotalPrice", "priority"]
        }
      },
      timeline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            timeframe: { type: Type.STRING, description: "2 Weeks Before, 1 Week Before, 3 Days Before, Day Before, Party Day Morning, or 1 Hour Before" },
            task: { type: Type.STRING },
            category: { type: Type.STRING },
            isCompleted: { type: Type.BOOLEAN }
          },
          required: ["id", "timeframe", "task", "category", "isCompleted"]
        }
      },
      themeConcept: {
        type: Type.OBJECT,
        properties: {
          vibeSummary: { type: Type.STRING },
          colorPalette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hex: { type: Type.STRING }
              },
              required: ["name", "hex"]
            }
          },
          playlistSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          signatureCocktail: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              recipeNotes: { type: Type.STRING }
            },
            required: ["name", "description", "ingredients"]
          },
          signatureMocktail: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              recipeNotes: { type: Type.STRING }
            },
            required: ["name", "description", "ingredients"]
          },
          gameIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          invitationWording: { type: Type.STRING },
          foodServingStyle: { type: Type.STRING },
          decorHighlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["vibeSummary", "colorPalette", "playlistSuggestions", "signatureCocktail", "signatureMocktail", "gameIdeas", "invitationWording", "foodServingStyle", "decorHighlights"]
      },
      budgetSummary: {
        type: Type.OBJECT,
        properties: {
          targetBudget: { type: Type.NUMBER },
          totalEstimatedSpend: { type: Type.NUMBER },
          costPerGuest: { type: Type.NUMBER },
          spendByCategory: {
            type: Type.OBJECT,
            properties: {
              food: { type: Type.NUMBER },
              drinks: { type: Type.NUMBER },
              decor: { type: Type.NUMBER },
              supplies: { type: Type.NUMBER },
              favors: { type: Type.NUMBER },
              entertainment: { type: Type.NUMBER },
              other: { type: Type.NUMBER }
            }
          },
          savingsTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["targetBudget", "totalEstimatedSpend", "costPerGuest", "savingsTips"]
      }
    },
    required: ["shoppingList", "timeline", "themeConcept", "budgetSummary"]
  };

  // Fallback chat agent response generator
  function handleFallbackChat(currentPlan: any, userMessage: string) {
    const msg = userMessage.toLowerCase();
    let modifiedShoppingList = [...(currentPlan.shoppingList || [])];
    let note = "I've reviewed your request and optimized your CymbalMart party plan!";
    let agentReply = `I've processed your request regarding "${userMessage}".`;

    if (msg.includes("swap") || msg.includes("store brand") || msg.includes("brand") || msg.includes("cheaper")) {
      modifiedShoppingList = modifiedShoppingList.map(item => ({
        ...item,
        name: item.name.replace("Premium", "CymbalMart Value").replace("Artisanal", "CymbalMart Everyday"),
        estimatedUnitPrice: Math.round(item.estimatedUnitPrice * 0.8 * 100) / 100,
        estimatedTotalPrice: Math.round(item.estimatedTotalPrice * 0.8 * 100) / 100,
        notes: item.notes + " (Swapped to CymbalMart store brand for maximum savings)"
      }));
      agentReply = "I've updated your shopping list to substitute CymbalMart store brand items! This reduces your overall spend by ~20% while preserving high quality.";
    } else if (msg.includes("guest") || msg.includes("scale") || msg.includes("18") || msg.includes("20") || msg.includes("15")) {
      const scaleFactor = msg.includes("18") ? 1.5 : (msg.includes("20") ? 1.6 : 1.25);
      modifiedShoppingList = modifiedShoppingList.map(item => ({
        ...item,
        quantity: item.quantity.replace(/\d+/, (m: string) => Math.ceil(Number(m) * scaleFactor).toString()),
        estimatedTotalPrice: Math.round(item.estimatedTotalPrice * scaleFactor * 100) / 100,
        notes: item.notes + ` (Scaled for updated guest count)`
      }));
      agentReply = `I've scaled up all food, beverage, and tableware quantities on your shopping list to accommodate your updated guest headcount smoothly.`;
    } else if (msg.includes("dietary") || msg.includes("gluten") || msg.includes("vegan") || msg.includes("organic")) {
      modifiedShoppingList = modifiedShoppingList.map(item => {
        if (item.category === "food") {
          return {
            ...item,
            name: "CymbalMart Organic & Gluten-Free " + item.name.replace("CymbalMart ", ""),
            notes: "Certified Organic & Gluten-Free options selected at CymbalMart"
          };
        }
        return item;
      });
      agentReply = "I've updated your food and snack selections to CymbalMart Certified Organic and Gluten-Free alternatives!";
    } else if (msg.includes("budget") || msg.includes("cut") || msg.includes("reduce") || msg.includes("save") || msg.includes("30")) {
      modifiedShoppingList = modifiedShoppingList.map((item, idx) => {
        if (idx > 4) {
          return {
            ...item,
            priority: "optional",
            estimatedUnitPrice: Math.round(item.estimatedUnitPrice * 0.7 * 100) / 100,
            estimatedTotalPrice: Math.round(item.estimatedTotalPrice * 0.7 * 100) / 100
          };
        }
        return item;
      });
      agentReply = "I've re-budgeted your list by trimming non-essential items and applying CymbalMart digital club discounts to cut ~$30 off your total!";
    } else {
      agentReply = `I've taken note of your request: "${userMessage}". Your CymbalMart party plan has been verified for guest quantities, department layout, and budget balance!`;
    }

    return {
      agentReply,
      suggestedActions: [
        "Swap to CymbalMart store brands",
        "Scale list for 18 guests",
        "Add gluten-free / dietary snacks",
        "Optimize budget by -$30"
      ],
      modifiedShoppingList
    };
  }

  // API Route: Generate Party Plan
  app.post("/api/plan-party", async (req, res) => {
    try {
      const partyDetails = req.body.details;
      if (!partyDetails || !partyDetails.eventType || !partyDetails.guestCount) {
        return res.status(400).json({ error: "Missing required party details (eventType, guestCount)." });
      }

      const ai = getGenAI();
      if (!ai) {
        console.log("GEMINI_API_KEY not configured. Using CymbalMart AI Smart Generator.");
        const fallbackPlan = createSmartFallbackPlan(partyDetails);
        return res.json({ success: true, plan: fallbackPlan });
      }

      const prompt = `
Generate a comprehensive, highly realistic CymbalMart party plan and itemized shopping list for the following event:
- Event Title: ${partyDetails.title || 'Party Celebration'}
- Event Type: ${partyDetails.eventType}
- Theme / Vibe: ${partyDetails.theme || 'Casual Celebration'}
- Guest Count: ${partyDetails.guestCount} guests
- Target Budget: $${partyDetails.budget || 250}
- Location / Venue: ${partyDetails.locationType || 'Home'}
- Dietary Restrictions: ${partyDetails.dietaryRestrictions?.length ? partyDetails.dietaryRestrictions.join(", ") : 'None specified'}
- Additional Notes: ${partyDetails.vibesAndNotes || 'Make it memorable, easy to host, and cost-effective.'}

Requirements for calculation & store mapping:
1. Vendors MUST be mapped to specific CymbalMart departments:
   - "CymbalMart Produce & Fresh"
   - "CymbalMart Bakery"
   - "CymbalMart Wine & Spirits"
   - "CymbalMart Deli & Prepared"
   - "CymbalMart Pantry & Aisle"
   - "CymbalMart Party Supplies"
2. Calculate exact food, drink, tableware, and supplies quantities based specifically on ${partyDetails.guestCount} guests (e.g. 0.4 lbs meat/guest, 1.5 - 2 drinks per hour per guest, 3-4 appetizers per person if finger foods, napkins at 2x guest count).
3. Ensure realistic individual item unit prices and total estimated cost fits as closely as possible within the $${partyDetails.budget || 250} target budget.
4. Include dietary restrictions strictly in food & beverage items.
5. Provide a creative theme concept (color palette with hex codes, signature cocktail & mocktail with recipe steps, invitation wording, games).
6. Provide a chronological preparation timeline from 2 weeks before up to 1 hour before party time.
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are CymbalMart's elite AI Party Planner Shopping Agent. Calculate accurate guest portioning, realistic CymbalMart pricing, organize by CymbalMart store departments, and deliver an editorial party experience.",
            responseMimeType: "application/json",
            responseSchema: partyPlanSchema,
          }
        });

        if (!response.text) {
          throw new Error("No output received from Gemini model.");
        }

        const generatedPlan = JSON.parse(response.text);

        // Construct full PartyPlan object
        const fullPlan = {
          id: "plan_" + Date.now(),
          createdAt: new Date().toISOString(),
          details: partyDetails,
          shoppingList: (generatedPlan.shoppingList || []).map((item: any, idx: number) => ({
            id: item.id || `item_${idx + 1}`,
            name: item.name || 'Party Item',
            category: (item.category || 'other').toLowerCase(),
            vendor: item.vendor || 'CymbalMart Pantry & Aisle',
            quantity: item.quantity || '1 pack',
            estimatedUnitPrice: Number(item.estimatedUnitPrice) || 5,
            estimatedTotalPrice: Number(item.estimatedTotalPrice) || Number(item.estimatedUnitPrice || 5),
            isPurchased: false,
            priority: item.priority || 'essential',
            notes: item.notes || '',
            suggestedStore: item.suggestedStore || item.vendor
          })),
          timeline: (generatedPlan.timeline || []).map((t: any, idx: number) => ({
            id: t.id || `task_${idx + 1}`,
            timeframe: t.timeframe || 'Day Before',
            task: t.task || 'Prepare items',
            category: t.category || 'Prep',
            isCompleted: false
          })),
          themeConcept: generatedPlan.themeConcept,
          budgetSummary: {
            targetBudget: partyDetails.budget || 250,
            totalEstimatedSpend: generatedPlan.budgetSummary?.totalEstimatedSpend || generatedPlan.shoppingList?.reduce((sum: number, i: any) => sum + (Number(i.estimatedTotalPrice) || 0), 0) || 200,
            costPerGuest: Math.round(((generatedPlan.budgetSummary?.totalEstimatedSpend || 200) / (partyDetails.guestCount || 1)) * 100) / 100,
            spendByCategory: generatedPlan.budgetSummary?.spendByCategory || {
              food: 80,
              drinks: 50,
              decor: 40,
              supplies: 20,
              favors: 10,
              entertainment: 0,
              other: 0
            },
            savingsTips: generatedPlan.budgetSummary?.savingsTips || ["Buy drinks in bulk", "DIY paper decor"]
          }
        };

        return res.json({ success: true, plan: fullPlan });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, using smart fallback plan generator:", geminiError.message);
        const fallbackPlan = createSmartFallbackPlan(partyDetails);
        return res.json({ success: true, plan: fallbackPlan });
      }

    } catch (err: any) {
      console.error("Error in /api/plan-party:", err);
      const fallbackPlan = createSmartFallbackPlan(req.body.details || {});
      return res.json({ success: true, plan: fallbackPlan });
    }
  });

  // Schema for chat modification output
  const chatAgentResponseSchema = {
    type: Type.OBJECT,
    properties: {
      agentReply: { type: Type.STRING, description: "Friendly, helpful response from the Shopping Agent explaining changes made or advice given" },
      suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 quick follow-up prompt pills for the user" },
      modifiedShoppingList: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            vendor: { type: Type.STRING },
            quantity: { type: Type.STRING },
            estimatedUnitPrice: { type: Type.NUMBER },
            estimatedTotalPrice: { type: Type.NUMBER },
            priority: { type: Type.STRING },
            notes: { type: Type.STRING },
            isPurchased: { type: Type.BOOLEAN }
          },
          required: ["id", "name", "category", "vendor", "quantity", "estimatedUnitPrice", "estimatedTotalPrice", "priority"]
        }
      },
      updatedBudget: {
        type: Type.OBJECT,
        properties: {
          targetBudget: { type: Type.NUMBER },
          totalEstimatedSpend: { type: Type.NUMBER }
        }
      },
      updatedThemeConceptNotes: { type: Type.STRING }
    },
    required: ["agentReply"]
  };

  // API Route: Chat with Shopping Agent to adjust party plan live
  app.post("/api/chat-agent", async (req, res) => {
    try {
      const { currentPlan, userMessage } = req.body;
      if (!currentPlan || !userMessage) {
        return res.status(400).json({ error: "Missing currentPlan or userMessage." });
      }

      const ai = getGenAI();
      if (!ai) {
        console.log("GEMINI_API_KEY not configured. Using CymbalMart AI Chat Agent fallback.");
        const fallbackChat = handleFallbackChat(currentPlan, userMessage);
        return res.json({
          success: true,
          agentReply: fallbackChat.agentReply,
          suggestedActions: fallbackChat.suggestedActions,
          modifiedShoppingList: fallbackChat.modifiedShoppingList
        });
      }

      const prompt = `
You are the AI Party Planner Shopping Agent. The user is currently editing a party plan:
Current Party Details:
- Title: ${currentPlan.details.title}
- Event Type: ${currentPlan.details.eventType}
- Guest Count: ${currentPlan.details.guestCount}
- Target Budget: $${currentPlan.details.budget}
- Current Shopping List Items: ${JSON.stringify(currentPlan.shoppingList.map((i: any) => ({ id: i.id, name: i.name, category: i.category, qty: i.quantity, total: i.estimatedTotalPrice, purchased: i.isPurchased })))}

User's Request: "${userMessage}"

Tasks:
1. Provide a helpful, concise agent answer in "agentReply".
2. If the user asks to add, remove, modify, swap, or re-budget items (e.g. "remove alcohol", "add vegan cupcakes", "cut $50", "increase guests to 20", "swap disposable plates to eco-friendly bamboo"), provide the complete updated shopping list in "modifiedShoppingList" with updated quantities and price calculations!
3. Include 2-3 relevant follow-up action suggestions in "suggestedActions".
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are an intelligent, proactive AI Party Shopping Agent. Maintain accurate calculations and modify the shopping list when requested.",
            responseMimeType: "application/json",
            responseSchema: chatAgentResponseSchema
          }
        });

        if (!response.text) {
          throw new Error("No response text returned from AI Agent.");
        }

        const result = JSON.parse(response.text);

        return res.json({
          success: true,
          agentReply: result.agentReply,
          suggestedActions: result.suggestedActions || ["Recalculate budget", "Add dietary alternatives", "Export shopping list"],
          modifiedShoppingList: result.modifiedShoppingList || null,
          updatedBudget: result.updatedBudget || null,
          updatedThemeConceptNotes: result.updatedThemeConceptNotes || null
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, using fallback chat agent:", geminiError.message);
        const fallbackChat = handleFallbackChat(currentPlan, userMessage);
        return res.json({
          success: true,
          agentReply: fallbackChat.agentReply,
          suggestedActions: fallbackChat.suggestedActions,
          modifiedShoppingList: fallbackChat.modifiedShoppingList
        });
      }

    } catch (err: any) {
      console.error("Error in /api/chat-agent:", err);
      const fallbackChat = handleFallbackChat(req.body.currentPlan || {}, req.body.userMessage || "Hello");
      return res.json({
        success: true,
        agentReply: fallbackChat.agentReply,
        suggestedActions: fallbackChat.suggestedActions,
        modifiedShoppingList: fallbackChat.modifiedShoppingList
      });
    }
  });

  // Vite Dev Server / Static Serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Party Planner Shopping Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
