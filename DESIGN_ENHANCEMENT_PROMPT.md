# Sarokar — UI/UX & Design Enhancement Prompt

> Paste this into your coding agent (Claude Code / Cursor / etc.) as the task brief.
> It is written for an agent working **directly in this repository**. Read the referenced
> files before touching anything. Do not invent a new design language — evolve the one
> that already exists.

---

## 0. Your role

You are a senior product designer + front-end engineer improving the UI/UX of **Sarokar**,
a production Next.js 16 / React 19 / Tailwind v4 app. Your job is to elevate the visual
design, interaction quality, consistency, accessibility, and cultural authenticity of the
**entire app** — while preserving its architecture, its existing token system, and its
trilingual behavior.

Work like a craftsperson: audit first, propose a plan, then make incremental, reviewable
changes that build and lint cleanly. Never ship a redesign that regresses accessibility or
performance.

---

## 1. Product context (read this carefully — it drives every decision)

**What Sarokar is:** a free, AI-powered guide that helps people get real Nepali government
and everyday tasks done — PAN, passport, driving licence, bluebook, citizenship, National ID,
Lok Sewa, labor permit, company registration, TU transcripts, birth/marriage registration.
Users ask in **Nepali (Devanagari), Roman Nepali, or English** and get step-by-step guidance,
required documents, where-to-go office info, and sourced answers.

**Sub-brand "K Cha Ta?"** (`/k-cha-ta`) is a separate, warmer, amber-themed surface for
understanding Nepal's internet culture — trending topics, rumor-vs-fact verification, and
explainers, backed by live RSS news feeds.

**Who it is for (this is the north star):**

1. **Nepalis inside Nepal** — often on budget Android phones, slower/metered mobile data,
   variable connectivity, a wide range of digital literacy (including older relatives and
   first-time smartphone users). They need clarity, trust, large tap targets, and low data cost.
2. **The Nepali diaspora (5M+ worldwide — the app literally addresses them in the announcement
   bar).** They handle paperwork remotely for themselves and family, deal with NRN concerns,
   plan tasks for trips home, operate across timezones, and often feel a strong pull to home.
   For them, emotional resonance and "do this from abroad" clarity matter.

**The design must serve both audiences at once.** Every change should be checked against
"does this help an aunt in Pokhara on a 3-year-old Android AND a nurse in Sydney doing her
father's bluebook renewal remotely?"

---

## 2. Design vision — "Rooted in Nepal, built for Nepalis everywhere"

Push the design to feel **unmistakably, authentically Nepali** — not with clip-art flags and
emoji, but through disciplined, tasteful use of Nepal's visual heritage:

- **Motifs already in the codebase** (`components/brand/`): the *Aankhijhyal* (traditional
  Newari carved lattice window), the *mandala rosette*, the *Himalaya ridge* silhouette, the
  Nepal flag's double-pennon geometry, and the "Buddha eyes" of `KChaTaEyes`. Use these as a
  cohesive system, not scattered decoration. They should feel like a designed brand world.
- **Color heritage:** the palette already leans on flag **crimson (`#B3262D`)**, deep
  **royal blue (`#1B2D5E`)**, **saffron/amber (`#F5A623`)**, and **forest green (`#2D5A3D`)**
  over a **warm paper background (`#F7F5F0`)**. This maps beautifully to Nepal (flag, prayer
  flags, saffron, Himalayan skies, terraced green). Lean into it with restraint — pick a clear
  primary and keep accents purposeful. **Do not turn the UI into a rainbow.**
- **Devanagari as a first-class citizen**, not an afterthought. Nepali script deserves correct
  line-height, weight pairing, and display treatment (see `.text-devanagari-display`,
  `font-devanagari`, `Noto_Sans_Devanagari`). Trilingual copy should code-switch naturally and
  never break layout when a language is longer.
- **Emotional warmth for the diaspora, calm authority for gov tasks.** Sarokar's core (gov
  services) should feel trustworthy, official-adjacent, and precise. K Cha Ta can be more
  playful and vivid. Keep these two moods distinct but clearly part of one family.

The result should look **intentional and hand-crafted**, like it was designed *for Nepal* by
someone who cares — not like a generic SaaS template with a flag pasted on.

---

## 3. Non-negotiable constraints

**Tech & architecture**
- Stay on **Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript**. Do not introduce
  a component library, CSS-in-JS, or a new styling paradigm. Tailwind v4 here is **CSS-first**:
  design tokens live in `app/globals.css` under `@theme inline` and the `.dark` block.
- **Extend the token system; don't bypass it.** New colors, shadows, radii, or motion should be
  added as tokens/utilities in `globals.css` and consumed via classes. Avoid one-off hex values
  scattered in components (note: the hero currently hardcodes `#1B2D5E` — prefer promoting
  recurring brand colors to named tokens like `--color-primary` / `--color-saffron`).
- Preserve **dark mode** parity for every change (`.dark` + `.kct-theme` scopes). Nothing should
  look broken or low-contrast in dark mode.
- Keep the **no-`localStorage`-in-artifacts** and existing persistence patterns intact
  (`sessionStorage` for chat, `localStorage` for saved answers / theme / dismissed announcement).

**Trilingual & content**
- Never hardcode assumptions that break Nepali/Roman-Nepali/English. Test layouts with the
  longest realistic string in each language. Devanagari must render with comfortable
  line-height and never clip.

**Performance (this is a real requirement for the in-Nepal audience)**
- Respect the mobile-data reality: keep bundle size in check, prefer CSS/SVG over heavy assets,
  lazy-load below-the-fold and off-screen widgets, and never add large dependencies for a small
  visual gain. Animations must be GPU-friendly (transform/opacity only).
- Keep/expand the existing `@media (prefers-reduced-motion: reduce)` handling — all new motion
  must degrade gracefully.

**Accessibility**
- Maintain the existing `:focus-visible` rings, skip-link, ARIA labels, and semantic structure.
  Meet **WCAG 2.1 AA** contrast in both themes. Minimum **44×44px** touch targets (the app
  already uses `min-h-11` in places — apply consistently).

**Don't break**
- SEO/metadata, OpenGraph images, `sitemap.ts` / `robots.ts`, JSON-LD, the print stylesheet,
  and streaming chat behavior must all keep working.

---

## 4. Design principles (the lens for every decision)

1. **Clarity over cleverness.** People come here stressed about paperwork. Reduce cognitive
   load: strong hierarchy, generous spacing, obvious primary actions, scannable steps.
2. **Trust is the product.** For gov flows, visibly signal accuracy and provenance (sources,
   "official website" links, "last updated" dates). Never look like a scam or a data-harvesting
   app. Calm, credible, civic.
3. **One primary action per view.** Make "ask a question" impossible to miss on every surface.
4. **Progressive disclosure.** Show the answer first; tuck secondary detail (documents, office,
   sources) into well-structured cards that don't overwhelm.
5. **Motion with meaning.** Keep the existing tasteful reveal/stagger/float vocabulary; use it
   to guide attention, not to decorate. Nothing should feel busy on a slow device.
6. **Consistency is a feature.** Unify spacing scale, radii, shadows, card anatomy, button
   variants, chip styles, and empty/loading/error states across all surfaces.

---

## 5. Cross-cutting system work (do this before per-surface polish)

Audit and then standardize these app-wide primitives. Prefer creating small, reusable pieces
over repeating markup.

- **Type scale & Devanagari pairing.** Define a clear, responsive type ramp. Ensure headings,
  body, captions, and Devanagari display all feel harmonious. Fix any cramped Devanagari
  line-heights. Consider a refined display treatment for hero headlines.
- **Color hierarchy resolution.** Decide and document the primary brand color story. Today the
  token `--color-accent` is crimson, but the homepage treats deep blue `#1B2D5E` as primary and
  K Cha Ta uses amber. Make this deliberate: a clear primary, a clear accent, semantic colors
  (success/green already exists), and the two brand scopes (Sarokar vs K Cha Ta) clearly related.
- **Spacing & layout rhythm.** Standardize container widths (`max-w-[1280px]`, `max-w-3xl` chat),
  section padding, and vertical rhythm between sections so the page breathes consistently.
- **Component consistency pass.** Buttons (primary/secondary/ghost), chips/pills, cards,
  section headers, badges, form inputs — unify their states (hover/active/focus/disabled) and
  make dark-mode variants correct everywhere.
- **Elevation & borders.** Reuse `shadow-card` / `shadow-card-hover` consistently; avoid random
  ad-hoc shadows. Ensure borders/cards read well on the warm paper background and in dark mode.
- **Iconography.** Icons are inline SVGs. Keep stroke widths and sizes consistent; align icon
  metaphors with meaning.
- **State system.** Design and apply consistent **empty, loading (skeleton/shimmer), error, and
  offline/low-connectivity** states across the app. The chat already has good skeletons/shimmer;
  extend that quality everywhere (e.g. trend radar, news drawer).
- **Nepali brand-motif system.** Turn `components/brand/*` into an intentional, documented set:
  where each motif appears, at what opacity, and why. Aankhijhyal as ambient texture, Himalaya
  ridge as section divider/footer, mandala for accents/loading, Buddha eyes for K Cha Ta only.

---

## 6. Per-surface direction

### 6.1 Homepage (`app/page.tsx` + `components/homepage/*`, `components/layout/Navbar.tsx`, `Footer.tsx`)
Sections in order: `Hero → CategoryGrid → RealQuestions → HowItWorks → LanguageSection →
NepalSection → TrustSection → PopularServices → FinalCTA`.
- **Hero (`components/homepage/Hero.tsx`):** the strongest first impression. Tighten the
  headline/subhead/search hierarchy, make the search bar the unmissable primary action, and
  refine the floating "gov card" composition on the right so it reads as *credible product
  preview* rather than clutter. Ensure the mobile hero is as compelling as desktop. Keep the
  faded सरोकार Devanagari backdrop but make it feel intentional.
- Make the **trilingual promise** visually obvious near the top (NE · RN · EN).
- **Trust & credibility:** strengthen `TrustSection` and social proof so first-time and
  diaspora users believe this is safe and accurate. Add clear "free, always" and "not a
  government site / unofficial guide" honesty where appropriate.
- Ensure **CategoryGrid / PopularServices** are scannable, touch-friendly, and consistent as a
  card system. `HowItWorks` should be dead simple (3 steps).
- **Navbar:** refine scroll/transparent-to-solid transition, active states, the dismissible
  announcement bar, and the mobile menu. Keep the Sarokar↔K Cha Ta CTA switching logic.
- **Footer:** make it a proper "made in Kathmandu, for Nepalis worldwide" moment; good place for
  the Himalaya ridge motif and language/credibility signals.

### 6.2 Chat assistant (`components/chat/ChatInterface.tsx`, `app/chat/*`, `MarkdownRenderer`, `SavedDrawer`, `toast`)
This is the core product — invest heavily.
- **Welcome/empty state:** warm, guided, confidence-building. Suggestion chips should feel like
  real tasks, not filler.
- **Message design:** improve readability and rhythm of user vs assistant bubbles, the
  streaming cursor, and the assistant avatar. Ensure long Devanagari answers render beautifully.
- **Structured answer cards** (steps timeline, documents checklist, office/where-to-go, source):
  these are the app's superpower. Make them a polished, consistent card family with clear
  headers, great empty/partial states, and satisfying interactions (the doc check-off already
  exists — refine it). Steps should feel like a trustworthy checklist you can act on.
- **Action row** (Copy / Share / Save / 👍👎 feedback) and **follow-up suggestions:** tidy the
  layout and hierarchy; make Share (WhatsApp is the real-world channel for Nepalis) prominent.
- **Input area:** the topic-pills scroller + input + shortcut hint. Keep `⌘K` focus, rotating
  placeholders, keyboard behavior; refine spacing and the mobile keyboard experience.
- **Trust cues:** show sources and "last updated" clearly; make it obvious answers are guidance,
  with links to official sources.

### 6.3 K Cha Ta? (`app/k-cha-ta/*`, `components/kchata/*`, `components/brand/KChaTaEyes.tsx`)
The amber-themed, culturally playful counterpart. Surfaces include `KChaTaHero`, `TrendingNow`,
`DailyDrop`, `AskAnything`, `DebunkVerify`, `ExplainThis`, `TopicCategories`, `PersonalizedFeed`,
`ShareableCard`, `NewsDrawer`, and its own chat (`app/k-cha-ta/chat`).
- Keep the distinct amber/saffron identity (`kct-*` tokens, `.kct-theme` scope) and the Buddha-
  eyes motif — but ensure it clearly belongs to the same family as Sarokar.
- **Live Trend Radar / TrendingNow:** make the live-vs-sample states, freshness, and source
  attribution crisp and trustworthy (it's news — provenance matters). Great loading skeletons.
- **DebunkVerify / rumor-vs-fact:** design a clear, responsible verification UI (this is
  sensitive; avoid sensationalism, show sources).
- **ShareableCard:** optimize for how Nepalis actually share — WhatsApp/Facebook/Instagram —
  with a genuinely attractive, on-brand share image/card.
- **NewsDrawer:** smooth, accessible drawer with solid focus management.

### 6.4 Shared & utility pages
`app/about`, `app/privacy`, `app/terms`, `app/not-found.tsx`, `app/error.tsx`, loading files.
- Give these the same care: readable long-form typography, on-brand 404/error states (a good
  place for warmth + a Nepali motif), and consistent headers/footers.

---

## 7. Audience-specific considerations (design for both, explicitly)

**For users in Nepal**
- Low-data / low-end device friendliness: lightweight, fast first paint, minimal blocking JS,
  optimized/SVG imagery, and graceful behavior on flaky connections (retry affordances already
  exist in chat — extend the pattern).
- Larger touch targets, high legibility, and plain-language copy for lower digital literacy.
- Real-world grounding: office names, hours, and "what to physically bring/where to go" should
  be prominent and unambiguous.

**For the diaspora**
- Make "**doing this from abroad**" a first-class consideration where relevant (online vs
  in-person steps, what a family member in Nepal can do on your behalf, embassy/NRN paths).
- Emotional resonance: subtle "home" cues (Himalaya ridge, warm paper, Devanagari) that feel
  like a connection to Nepal, without being kitsch.
- Consider timezone-agnostic copy and share flows that work across borders.

> You don't need to build major new features — but the **design, copy, and information
> hierarchy** should visibly acknowledge these two contexts.

---

## 8. Accessibility & performance bar (acceptance-level)

- WCAG 2.1 AA contrast in light **and** dark mode; verify every new color pairing.
- Full keyboard operability; visible focus everywhere; correct focus trapping in drawers/menus/
  modals; logical tab order.
- Screen-reader-correct semantics: headings, landmarks, `aria-*`, `aria-live` for streaming chat
  and toasts, meaningful labels on icon-only buttons.
- `prefers-reduced-motion` honored by all animations.
- No layout shift on load; skeletons match final layout. Keep Lighthouse Performance and
  Accessibility high on a simulated mid-tier mobile device.

---

## 9. Ways of working

1. **Audit first.** Read `app/globals.css` (the token system), `app/layout.tsx`, and the key
   components in `components/`. Produce a short written audit: what's strong, what's
   inconsistent, and the highest-impact opportunities. **Do not start editing before this.**
2. **Propose a plan** (surface-by-surface + the cross-cutting system work in §5), ordered by
   impact. Get the token/color-hierarchy decisions (§5) locked before broad component edits.
3. **Implement incrementally**, in small reviewable commits. Start with the shared design system
   (tokens, type, buttons, cards), then Homepage → Chat → K Cha Ta → utility pages.
4. **Verify each step:** `npm run build` and `npm run lint` must pass; check both themes, mobile
   + desktop breakpoints, and all three languages; test reduced-motion and keyboard nav. Take
   before/after screenshots of each surface (light + dark, mobile + desktop).
5. **Keep the AGENTS.md Next.js rule intact** and follow repo conventions. Don't reformat
   unrelated files or churn the diff.

---

## 10. Definition of done

- A documented, coherent **design system** (tokens, type scale, color hierarchy, component
  variants, motion, motif usage) implemented in `globals.css` + shared components.
- Every surface (Homepage, Chat, K Cha Ta, shared/utility) is visibly more polished, consistent,
  and **authentically Nepali**, with a clear primary action and strong hierarchy.
- Light/dark, mobile/desktop, and NE/RN/EN all look correct — verified with screenshots.
- Accessibility (AA, keyboard, SR, reduced-motion) and performance (bundle, low-data, no CLS)
  bars in §8 are met.
- `build` + `lint` pass. No regressions to SEO/metadata, streaming chat, persistence, or print.
- A short **CHANGELOG / design-notes** summary of decisions (especially the color-hierarchy
  resolution) and before/after screenshots.

---

## Appendix A — Real file & token map (ground truth)

**Design tokens:** `app/globals.css`
- Light tokens under `@theme inline { … }`; dark overrides under `.dark { … }`.
- K Cha Ta sub-brand tokens: `--color-kct-*`; scoped remap under `.kct-theme` / `.dark .kct-theme`.
- Existing utilities/animation: `fade-up`, `fade-in`, `slide-in-*`, `shimmer`, `pulse-dot`,
  `float-in`, `drift`, reveal-on-scroll (`.js .reveal`), `shadow-card`/`shadow-card-hover`,
  `.text-devanagari-display`, `.gradient-nepal`, `.gradient-amber`, `.divider-nepal`, print styles,
  and `prefers-reduced-motion` handling. **Reuse these; extend rather than duplicate.**

**Fonts:** `app/layout.tsx` — Inter (`--font-sans`) + Noto Sans Devanagari (`--font-devanagari`).

**Brand motif components:** `components/brand/` — `Logo`, `Wordmark`, `NepalFlag`,
`AankhijhyalPattern`, `MandalaRosette`, `HimalayaRidge`, `KChaTaEyes`.

**Layout:** `components/layout/` — `Navbar`, `Footer`, `BackToTop`.

**Homepage:** `components/homepage/` — `Hero`, `CategoryGrid`, `RealQuestions`, `HowItWorks`,
`LanguageSection`, `NepalSection`, `TrustSection`, `PopularServices`, `FinalCTA`.

**Chat:** `components/chat/ChatInterface.tsx`, `app/chat/*`, `components/shared/`
(`MarkdownRenderer`, `SavedDrawer`, `toast`, `ScrollReveal`).

**K Cha Ta:** `app/k-cha-ta/*`, `components/kchata/*` (`KChaTaHero`, `TrendingNow`, `DailyDrop`,
`AskAnything`, `DebunkVerify`, `ExplainThis`, `TopicCategories`, `PersonalizedFeed`,
`ShareableCard`, `NewsDrawer`, `trending-store`).

## Appendix B — Palette (current, for reference)
- Warm paper background `#F7F5F0` · foreground `#171717`
- Flag crimson `#B3262D` (token `--color-accent`)
- Royal blue `#1B2D5E` (used as de-facto primary on homepage — currently hardcoded)
- Saffron/amber `#F5A623` / `#E8920D` (K Cha Ta accent)
- Forest green `#2D5A3D` (secondary / success)
- Resolve which of crimson/blue is the true primary as part of §5.
