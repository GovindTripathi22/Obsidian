# Agent Guidelines & Technical Architecture

> **CRITICAL INSTRUCTION**: The AI coding agent MUST read `agent.md` at the start of EVERY session before reading or writing any code to ensure strict alignment with project guidelines, tech stack constraints, and coding standards.

---

## 🚀 Technical Stack Overview

- **Framework**: Next.js 16+ (App Router, React 19, TypeScript, ESLint)
- **Styling**: Tailwind CSS v4 (configured via `globals.css` CSS variables)
- **Backend BaaS**: InsForge (PostgreSQL database, Auth, Storage buckets)
- **AI Coding Memory**: Jolly AI (Jolly Memory for token-saving context persistence)
- **Asset Engine**: Image Kit (real-time text-to-image via URL & AI transformations)
- **Monetization**: Stripe (tiered subscription models with project-level usage quotas)
- **Review System**: Code Rabbit (agentic pull request code analysis)

---

## 📐 System Architecture & Best Practices

### 1. Application Architecture (App Router)
- Place all routes, layouts, and pages inside `src/app/`.
- Maintain a modular structure:
  - `src/app/` — Pages, layouts, and route handlers.
  - `src/components/` — Reusable UI components (styled with Tailwind CSS v4).
  - `src/lib/` — Integration SDKs and clients (InsForge, Jolly AI, Image Kit, Stripe).
  - `src/types/` — Shared TypeScript type declarations.
- Use React Server Components (RSC) by default. Use `'use client'` explicitly for interactive client components.

### 2. Styling Strategy (Tailwind CSS v4)
- Use standard CSS variables defined in `src/app/globals.css` or Tailwind theme extensions.
- Use curated HSL color tokens and sleek dark/light mode standards.
- Incorporate subtle micro-animations, glassmorphism, and responsive design.

### 3. Backend & Data (InsForge)
- All PostgreSQL database access, auth flows, and file storage bucket interactions route through InsForge BaaS SDKs.
- Secure environment variables in `.env.local` (never commit secret keys).

### 4. AI Context Persistence (Jolly AI)
- Utilize Jolly Memory for persistent context caching to minimize token usage across AI developer workflows.

### 5. Asset Generation & Transformation (Image Kit)
- Dynamically format and generate visual assets via Image Kit URL parameters and real-time AI transformations.

### 6. Subscriptions & Quotas (Stripe)
- Support tiered subscription plans (Free, Pro, Enterprise).
- Enforce usage quotas at the project/organization level prior to executing server actions or API calls.

### 7. Code Quality & Reviews (Code Rabbit)
- Strict TypeScript checking (`strict: true`).
- Ensure clean PR commits formatted for Code Rabbit agentic PR code reviews.

---

## 🛠️ Development Guidelines
- Always verify builds using `npm run dev` or `npm run build`.
- Maintain single-responsibility components and robust error handling.
- Keep dependency declarations clean in `package.json`.
