# 🛒 CymbalMart AI — Party Planning & Shopping Concierge

<p align="center">

**AI-powered event planning meets intelligent retail shopping.**

Transform a simple party idea into a complete, budget-aware, aisle-mapped shopping experience — powered by Google Gemini.

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" />

</p>

---

## ✨ Overview

**CymbalMart AI** is an end-to-end AI-powered party planning and shopping concierge built as part of the **Google Cloud Gen AI Academy** experience.

Instead of manually planning food, drinks, decorations, shopping quantities, budget, and preparation tasks, users can describe their event in natural language and let the AI generate a complete party plan.

### 🎉 From an idea → to a complete party plan

```text
Natural Language Party Idea
          ↓
     Gemini AI Planning
          ↓
┌───────────────────────────────┐
│ Food & Grocery Planning       │
│ Portion Calculation           │
│ Aisle-Mapped Shopping List    │
│ Theme & Atmosphere            │
│ Cocktails / Mocktails         │
│ Preparation Timeline          │
│ Budget Optimization           │
└───────────────────────────────┘
          ↓
 AI Shopping Concierge
          ↓
 Simulated Express Checkout
```

---

# 🚀 Key Features

## 🤖 AI Event Planner

Describe your event using natural language and generate a complete event plan.

The system considers:

* 🎂 Event type
* 👥 Number of guests
* 💰 Budget
* 🥗 Dietary preferences
* 🎨 Theme
* 🍽️ Food requirements
* 🥤 Beverage requirements

The backend uses **Google Gemini through the `@google/genai` Node.js SDK** with structured schema guarantees.

---

## 💬 AI Shopping Concierge

The interactive AI Concierge allows users to modify their plan conversationally.

Example requests:

> "Scale this party for 20 guests."

> "Add vegan alternatives."

> "Cut $30 from the budget."

> "Replace premium products with store brands."

The AI dynamically adapts the shopping plan instead of forcing users to start over.

---

## 🧮 Smart Catering Portion Calculator

The application applies practical catering rules to reduce both:

* ❌ Food waste
* ❌ Under-catering

Examples include calculations for:

* Appetizers per guest
* Meat / protein quantities
* Beverage allocations
* Wine and beer bottle calculations
* Ice requirements
* Tableware quantities
* Party supply multipliers

This converts **guest count → realistic shopping quantities**.

---

# 🛍️ Aisle-Mapped Shopping Engine

Instead of producing a generic grocery list, CymbalMart organizes products according to physical store departments.

| Department         | Aisles |
| ------------------ | ------ |
| 🥬 Produce & Fresh | 1–3    |
| 🥪 Deli & Prepared | 4–5    |
| 🥖 Bakery          | 6      |
| 🍷 Wine & Spirits  | 7–9    |
| 🥫 Pantry & Aisle  | 10–14  |
| 🎈 Party Supplies  | 15     |

Users can customize:

* Quantity
* Price
* Priority
* Notes

### 💰 Store Brand Value Swap

One-click store-brand substitutions help reduce the estimated shopping cost by approximately **20%** in the simulated shopping experience.

---

# 🎨 Theme & Atmosphere Generator

The AI doesn't stop at groceries.

It creates a complete party atmosphere including:

### 🎨 Visual Identity

* 5-color interactive palette
* Hex code copying
* Theme styling suggestions
* Decoration concepts

### 🍹 Beverage Concepts

* Signature cocktail
* Mocktail alternative
* Pitcher preparation ratios

### 🎵 Entertainment

* Playlist genre suggestions
* Icebreaker activities
* Party atmosphere recommendations

### 💌 Communication

Ready-to-send invitation copy generated according to the event theme.

---

# ⏱️ Intelligent Preparation Timeline

The host receives a chronological preparation plan:

```text
2 Weeks Before
      ↓
1 Week Before
      ↓
3 Days Before
      ↓
1 Day Before
      ↓
Party Day Morning
      ↓
1 Hour Before
      ↓
🎉 PARTY TIME
```

A **Host Readiness Progress Meter** helps users track preparation progress.

---

# 🧭 In-Store Aisle Navigator

The project includes a simulated sequential shopping route.

Instead of randomly moving through the store, the system organizes shopping according to aisle order.

```text
Aisle 1
  ↓
Aisle 2
  ↓
Aisle 3
  ↓
Aisle 6
  ↓
Aisle 10
  ↓
Aisle 15
  ↓
🛒 Checkout
```

The concept is designed to help a host complete shopping efficiently within a simulated **under-20-minute store route**.

---

# 💰 Budget Analytics

The application provides live budget insights across:

* 🍽️ Food
* 🥤 Drinks
* 🎈 Supplies
* 🎨 Decor

It also calculates:

### Cost Per Guest

```text
Total Estimated Cost
        ÷
Number of Guests
        =
Cost Per Guest
```

The AI can additionally provide suggestions for reducing unnecessary spending.

---

# 🧾 Simulated Express Checkout

The application provides a complete simulated checkout experience.

### Available options

* 🛍️ Store Curbside Pickup
* 🚚 Direct Home Delivery

The checkout flow includes:

* Itemized shopping summary
* Quantity summary
* Estimated costs
* Category totals
* Receipt generation / printing

> **Note:** This is a simulated retail checkout experience and does not represent real CymbalMart transactions.

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      User Input      │
                    │ Natural Language     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │     React 19         │
                    │    TypeScript        │
                    │      Tailwind        │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │                      │
                    │ /api/plan-party      │
                    │ /api/chat-agent      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Google Gemini AI   │
                    │    @google/genai     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Structured AI Plan   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       Shopping Engine   Theme Generator   Budget Engine
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    🛒 Complete Party Plan
```

---

# 🧩 Core Modules

```text
CymbalMart AI
│
├── 🤖 AI Event Generation
│   ├── /api/plan-party
│   └── /api/chat-agent
│
├── 🧮 Portion Calculator
│
├── 🛍️ Shopping Engine
│   ├── Department Mapping
│   ├── Aisle Mapping
│   └── Store Brand Swaps
│
├── 🎨 Theme Generator
│   ├── Color Palette
│   ├── Decorations
│   └── Atmosphere
│
├── 🍹 Drink Concepts
│   ├── Cocktail
│   └── Mocktail
│
├── ⏱️ Preparation Timeline
│
├── 🧭 Aisle Navigator
│
├── 💰 Budget Analytics
│
└── 🧾 Express Checkout
```

---

# 🛠️ Tech Stack

## Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React 19     | UI development              |
| TypeScript   | Type-safe development       |
| Tailwind CSS | Styling                     |
| Lucide React | UI icons                    |
| Vite         | Development & build tooling |

## Backend

| Technology      | Purpose                              |
| --------------- | ------------------------------------ |
| Node.js         | Server runtime                       |
| Express.js      | REST API                             |
| Vite Middleware | Development / production integration |

## AI

| Technology          | Purpose            |
| ------------------- | ------------------ |
| Google Gemini       | Generative AI      |
| `@google/genai`     | Gemini Node.js SDK |
| Structured Schemas  | Reliable AI output |
| Fallback Heuristics | Robustness         |

---

# 🎨 Design System

The application follows a warm editorial retail aesthetic.

### Visual direction

```text
Warm Neutral
     +
Editorial Typography
     +
Warm Gold Accents
     +
High Contrast Text
     +
Retail Dashboard UX
```

### Core palette

```text
Background  → #F8F5F2
Accent      → #B08D57
Text        → Dark Charcoal
Typography  → Serif Editorial Accents
```

The design intentionally avoids the typical "generic AI dashboard" appearance and instead aims for a **premium retail editorial experience**.

---

# 📂 Project Structure

```text
cymbalmart-ai/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── App.tsx
│
├── server/
│   ├── routes/
│   ├── services/
│   ├── ai/
│   └── index.ts
│
├── public/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

> The exact folder structure may vary depending on the final project configuration.

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd YOUR_REPOSITORY
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit your API key to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
dist/
```

## 4. Start development server

```bash
npm run dev
```

Open the local development URL shown by Vite.

---

# 🔌 API Endpoints

## Generate Party Plan

```http
POST /api/plan-party
```

Generates a complete party plan based on user requirements.

### Example input

```json
{
  "eventType": "Children's Birthday Party",
  "guests": 15,
  "theme": "Superhero",
  "budget": 250,
  "dietaryPreferences": []
}
```

---

## AI Concierge

```http
POST /api/chat-agent
```

Allows users to interactively modify an existing event plan.

Example:

```text
User:
"Scale the party for 20 guests and reduce the budget by $30."

AI:
Updates quantities, recalculates costs,
and returns the modified shopping plan.
```

---

# 🧪 Example User Scenarios

### 🎂 Scenario 1 — Children's Birthday Party

```text
Party Type:
Children's Birthday Party

Guests:
15

Theme:
Superhero
```

Expected output:

* Age-appropriate food
* Party supplies
* Superhero decorations
* Shopping quantities
* Preparation timeline
* Budget estimation

---

### 🧑‍💼 Scenario 2 — Corporate Team Event

```text
Party Type:
Corporate Team Event

Guests:
25

Theme:
Professional / Casual
```

Expected output:

* Group-friendly food
* Beverage planning
* Corporate-friendly activities
* Budget allocation
* Shopping route

---

### 💍 Scenario 3 — Outdoor Wedding

```text
Party Type:
Outdoor Wedding

Guests:
50+

Theme:
Elegant Garden
```

Expected output:

* Large-scale food planning
* Beverage calculations
* Outdoor supplies
* Decor suggestions
* Extended preparation timeline

---

# 🧠 AI Reliability Strategy

Generative AI can produce inconsistent outputs if the application relies only on free-form text.

This project addresses that problem using:

### Structured Output

Gemini responses are constrained using structured schemas where appropriate.

### Deterministic Heuristics

Important calculations such as:

* Portion quantities
* Guest scaling
* Product quantities
* Budget calculations
* Store aisle mapping

can fall back to deterministic application logic.

### Why this matters

```text
LLM
 ↓
Creative Planning
 ↓
Structured Output
 ↓
Deterministic Business Rules
 ↓
Reliable Shopping Experience
```

This hybrid approach is more reliable than using an LLM as the sole source of truth for numerical calculations.

---

# 🔐 Security Considerations

The Gemini API is accessed from the **server side**.

```text
Browser
   │
   │ Request
   ▼
Express Server
   │
   │ API Key
   ▼
Google Gemini
```

The API key should never be exposed directly in frontend code.

### Recommended production practices

* Store secrets in environment variables
* Never commit `.env`
* Validate incoming API requests
* Add rate limiting
* Sanitize user-generated content
* Implement authentication before production deployment
* Monitor AI API usage and costs

---

# 🌱 Future Enhancements

The current project is designed as a foundation for a larger AI retail platform.

### Planned possibilities

* 🔐 User authentication
* ☁️ Cloud database integration
* 🛒 Real product catalog integration
* 💳 Real payment integration
* 📍 Real store inventory
* 🗺️ Real-time store navigation
* 📱 Mobile application
* 🎙️ Voice-controlled shopping assistant
* 📸 AI food / product recognition
* 📊 Personalized shopping analytics
* 🌐 Multi-language support
* 📦 Real-time delivery tracking

---

# 🎓 Google Cloud Gen AI Academy

This project was developed as part of my learning and project-building journey through the:

**Google Cloud Gen AI Academy**

The project helped me explore practical applications of:

* Generative AI
* Gemini models
* AI agents
* Structured AI outputs
* Prompt engineering
* Full-stack AI application development
* AI-powered user experiences

Rather than building a simple chatbot, the goal was to demonstrate how **Generative AI can be integrated with deterministic application logic to solve a real-world retail planning problem.**

---

# 📸 Screenshots

Add your best screenshots here:

```markdown
![Dashboard](./screenshots/dashboard.png)

![AI Concierge](./screenshots/ai-concierge.png)

![Shopping List](./screenshots/shopping-list.png)

![Budget Analytics](./screenshots/budget.png)

![Checkout](./screenshots/checkout.png)
```

### Recommended screenshots

1. 🏠 Main dashboard
2. 🤖 AI-generated party plan
3. 💬 AI Concierge
4. 🛒 Aisle-mapped shopping list
5. 🎨 Theme generator
6. ⏱️ Preparation timeline
7. 💰 Budget analytics
8. 🧾 Checkout

---

# 📈 What This Project Demonstrates

This project demonstrates practical experience in:

```text
Generative AI
      +
AI Agent Design
      +
Prompt Engineering
      +
Structured AI Outputs
      +
React Development
      +
TypeScript
      +
REST APIs
      +
Node.js / Express
      +
Business Logic
      +
UX Design
      +
AI + Traditional Software Integration
```

---

# 👨‍💻 Author

**Murugan R**

B.TECH. Artificial Intelligence & Data Science
Mepco Schlenk Engineering College

### Areas of Interest

* 🤖 Artificial Intelligence
* 🧠 Generative AI
* 📊 Data Science
* 💻 Full-Stack Development
* ☁️ Cloud & AI Applications

---

<p align="center">

### ⭐ If you found this project interesting, consider giving it a star!

**Built with React + TypeScript + Express + Google Gemini**

</p>
