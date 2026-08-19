---
name: CrediGo
description: A dark-glass digital wallet and game top-up marketplace
colors:
  credigo-dark: "#232946"
  credigo-input-bg: "#2a304d"
  credigo-light: "#ffffee"
  credigo-accent: "#eebbc3"
  admin-surface: "#f9f9f1"
  admin-text: "#232946"
  danger: "#dc2626"
  success: "#16a34a"
  warning: "#d97706"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.credigo-accent}"
    textColor: "{colors.credigo-dark}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  button-primary-hover:
    backgroundColor: "{colors.credigo-accent}"
  surface-card:
    backgroundColor: "{colors.credigo-input-bg}"
    textColor: "{colors.credigo-light}"
    rounded: "{rounded.lg}"
---

# Design System: CrediGo

## Overview

**Creative North Star: "The Neon Vault"**

CrediGo reads as a secure digital wallet with an arcade pulse. The base is a deep navy (`#232946`) that never lightens to gray — it's the one constant surface every public page stands on. Against that navy, a single accent does the work: a soft blush pink (`#eebbc3`) that marks the one thing on screen you're meant to act on, usually threaded through a pink-to-purple-to-blue gradient that gives the brand its "neon" signature (the top hairline on the login card, button fills, focus rings, glowing hover states). Cards and inputs sit one step lighter than the page as a navy-tinted surface, never a neutral gray — the tint is what keeps the whole system feeling like one material instead of a UI kit dropped on top of a dark background.

The admin/back-office area is a deliberate exception, not a drift: it runs on a light cream surface with the same navy and blush tokens used as text and accent instead of surface color. This is a genuine second world for an internal, task-focused audience, and it should never bleed into the public-facing pages, the same way the dark world should never leak into admin.

**Key Characteristics:**
- Navy-first: the page background is always `credigo-dark`, never a default gray or white.
- One accent, gradient-extended: blush pink is the only accent that means "primary action"; purple and blue only ever appear *with* it in a gradient, never alone as a competing accent.
- Glass surfaces: elevated panels are semi-transparent navy (`credigo-input-bg/95`) with `backdrop-blur-sm` and a hairline border, not solid opaque boxes.
- Glow over shadow: hover states favor a colored, tinted shadow (`shadow-indigo-900/20`, `shadow-purple-500/20`) over a plain gray drop shadow.

## Colors

The palette is small and deliberate: one dark neutral, one light neutral, one accent, and a gradient extension of that accent. Everything else is semantic (error/success/warning) or borrowed sparingly from Tailwind's gray/indigo/purple scale for depth and gradient stops.

### Primary
- **Neon Blush** (`#eebbc3`): the only "act on this" color. Primary buttons, active nav underline, focus rings, links, wallet balance highlights. Doubles as `credigo-button`, its own token — treat both as the same color.

### Neutral
- **Deep Navy** (`#232946`): the page background for every public-facing surface — body, header, footer, and any full-page view. Also used as text-on-accent (dark text on a blush button).
- **Navy Surface** (`#2a304d`): the elevated-panel color — cards, modals, inputs, and anything that needs to read as "on top of" the page. One tint step lighter than the page, not a neutral gray.
- **Ivory** (`#ffffee`): the default body text color on dark surfaces (`credigo-light`), and the light-neutral counterpart used sparingly as a near-white background accent.
- **Cream Surface** (`#f9f9f1`) + white: the admin-only light background and card color. Confined to `/admin/**`.

### Named Rules
**The One Navy Rule.** Every public page's outermost container resolves to `credigo-dark`, either by painting it directly or by inheriting from a parent that already does. A page is never allowed to fall through to an unstyled or generic-gray background.

## Typography

**Display Font:** Montserrat (with sans-serif fallback)
**Body Font:** Inter (with sans-serif fallback)

**Character:** Montserrat carries every heading at semibold weight — geometric and confident, used nowhere else. Inter carries all body copy, labels, and UI text — neutral and highly legible against navy at small sizes.

### Hierarchy
- **Display** (bold, `text-2xl`–`text-3xl`, Montserrat): page titles and hero headings ("Welcome back", "Ready to Level Up Your Gaming?").
- **Title** (semibold, `text-lg`–`text-xl`, Montserrat): section headers and card titles.
- **Body** (regular, `text-sm`–`text-base`, Inter): all paragraph and form copy.
- **Label** (medium, `text-xs`, Inter, uppercase tracking-wider on table headers only): field labels, badges, table column headers.

## Layout

The shell is a standard flex column: sticky navbar, `flex-grow` main content, footer pinned by `min-h-screen`. Content is centered with a `container mx-auto` wrapper and horizontal padding (`px-4`, `p-6` on the main region). Stat and card grids are responsive (`grid-cols-1` → `sm:grid-cols-3` / `md:grid-cols-4`), collapsing to a single column below `sm`. Spacing rhythm favors generous vertical section gaps (`mb-10`, `mt-12`) over dense stacking.

## Elevation & Depth

Hybrid: flat navy fields most of the time, with two deliberate depth signatures layered on top. Glass panels (`backdrop-blur-sm` + semi-transparent navy + hairline border) mark anything modal or "floating above the page" — the login card, alert dialogs, purchase confirmations. Colored glow shadows (a tinted, low-opacity shadow matching the nearby accent) mark interactive hover states on cards and buttons, replacing a plain gray shadow.

### Shadow Vocabulary
- **Glass panel** (`backdrop-blur-sm`, `bg-credigo-input-bg/95`, `border border-gray-700/50`): login/register cards, alert and confirmation dialogs.
- **Glow hover** (`hover:shadow-lg hover:shadow-{accent}-900/20`): featured game cards, wallet stat cards — the shadow tint matches the card's own accent (indigo, purple, blue, amber).

### Named Rules
**The Themed Surface Rule.** Any Radix/shadcn primitive (Dialog, AlertDialog, Card, Popover) rendered on a dark public page must receive explicit `credigo-input-bg` / `credigo-light` classes. Never ship one with its unstyled `bg-background`/`bg-card` defaults on a dark page — those resolve to white and break the glass-panel language.

## Shapes

Cards and panels use a consistently generous corner (`rounded-xl`, 12px). Buttons, inputs, and small chips use a tighter corner (`rounded-lg`/`rounded-md`, 6–8px). Avatars, status dots, and pill badges are fully round (`rounded-full`). Borders are hairline and low-contrast (`border-gray-700/50` on dark surfaces, `border-gray-200` on admin's light surfaces) — never a heavy or colored border except as a focus ring.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px), occasionally `rounded-md` for compact/menu-style actions.
- **Primary:** blush-to-purple gradient (`from-credigo-accent to-purple-500`) with dark navy text, used for the single most important action per screen (Sign In, Top-up Now).
- **Secondary/Outline:** transparent or `credigo-dark/50` fill with a `border-gray-700` hairline and `credigo-light` text.
- **Destructive:** solid red (`bg-red-600`/`bg-red-500`), reserved for irreversible actions (logout confirm, delete).
- **Hover/Focus:** background brightens or shadow gains a colored glow; focus ring is always `credigo-accent`.

### Cards / Containers
- **Corner:** `rounded-xl` (12px).
- **Background:** `credigo-input-bg` (navy surface) on public pages; white on admin pages.
- **Border:** hairline `border-gray-700/50` (dark) or `border-gray-100`/`border-gray-200` (admin).
- **Shadow Strategy:** glow-on-hover per Elevation & Depth above.

### Inputs / Fields
- **Style:** `bg-credigo-dark` fill, `border-gray-700`, `rounded-lg`, `credigo-light` text with `placeholder-gray-400`.
- **Focus:** `ring-2 ring-credigo-accent`, border turns transparent.
- **Error:** red-tinted banner (`bg-red-500/30`, `border-red-500/50`, `text-red-100`) above or below the field, not a red border on the field itself.

### Navigation
- **Style:** sticky, semi-transparent navy header (`bg-credigo-dark/90 backdrop-blur-lg`) with a hairline bottom border. Active link gets a full-width gradient underline (`from-credigo-accent via-purple-400 to-purple-500`) and a subtle `bg-white/10` fill; inactive links are `text-gray-300` with a `hover:bg-white/5` fill.
- **Mobile:** collapses to a hamburger-driven overlay menu (implementation detail; same color rules apply).

### Modals & Alerts
- **Style:** the glass-panel treatment (Elevation & Depth) — never the unstyled shadcn default. Title color signals intent (`text-red-400` error, `text-green-400` success, `text-credigo-accent` info); the confirm action uses the primary blush button.

## Do's and Don'ts

### Do:
- **Do** paint every public page's root container `bg-credigo-dark`, either directly or via a themed shared layout.
- **Do** use `credigo-input-bg` (`#2a304d`) for every elevated surface on a dark page — cards, modals, inputs.
- **Do** pair glass surfaces with `backdrop-blur-sm` + `border-gray-700/50` for anything that floats above the page (dialogs, the login/register card).
- **Do** keep the admin light theme (`#f9f9f1`/white/navy text) fully contained to `/admin/**`.

### Don't:
- **Don't** let a shared layout default to an unthemed neutral like `bg-gray-100` — that is the exact bug that makes a page's content area read as a mismatched white/gray box between a dark navbar and dark footer.
- **Don't** use plain Tailwind `bg-gray-900` for card surfaces on public pages — it's a neutral gray that doesn't carry the navy tint `credigo-input-bg` does, and the two read as two different products side by side.
- **Don't** ship a Radix/shadcn primitive (Dialog, Card, Popover) on a dark page with its default `bg-background`/`bg-card` — it renders white-on-white against the navy world.
- **Don't** introduce a second accent color that competes with blush pink for "primary action" status; purple/blue only appear as gradient extensions of it.
