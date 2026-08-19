# MediQ Interface Update — Design Exploration

## Three stylistic approaches

### Theme Name: Clinical Signal
**Very Brief Intro:** A crisp healthcare interface using calm white space, deep medical blue, and deliberate status color. The experience feels safe, focused, and immediately legible under pressure.
**Probability:** 0.07

### Theme Name: Guided Floorplan
**Very Brief Intro:** A spatial-first navigation system where route clarity, floor context, and tactile controls lead the visual language. Information is layered around a confident, highly usable 2D map.
**Probability:** 0.04

### Theme Name: Human Care Console
**Very Brief Intro:** A warmer, more human dashboard direction with softer contours and reassuring typographic rhythm. It positions medical information as approachable rather than technical.
**Probability:** 0.09

## Chosen approach: Guided Floorplan

### Design Movement
Contemporary **clinical wayfinding**: the restraint of hospital signage translated into a responsive digital control surface.

### Core Principles
1. Make the current location, destination, and next action unmistakable at a glance.
2. Place map controls at the edges and keep the floorplan itself visually open.
3. Use reliable hierarchy through strong type, spacing, and consistent status colors rather than decoration.
4. Preserve clear, low-friction dashboard navigation, including an obvious exit action.

### Color Philosophy
Deep clinical blue is the stable anchor for orientation and primary action; teal indicates progress and active routes; subdued slate supports background information. Warm amber is reserved for meaningful alerts so the interface avoids visual alarm fatigue.

### Layout Paradigm
The map is a responsive **navigation stage** with contextual controls pinned around its perimeter. On desktop, route detail and controls form an edge rail; on mobile, the map remains dominant while actions collapse into stacked cards and a bottom control dock.

### Signature Elements
- High-contrast route strokes with calm teal destination pins.
- Small, practical floor chips and map mode controls with icon-led labels.
- A full-height sidebar whose final action is a deliberately separated logout control.

### Interaction Philosophy
Controls acknowledge touch with restrained elevation, color, and scale transitions. Mobile controls are thumb-reachable and never obscure the primary route.

### Animation
Transitions use a 160–220ms ease-out. Map controls and drawers fade upward from 95% scale; route/pin indicators use minimal opacity and transform transitions. Motion respects reduced-motion preferences.

### Typography System
Use a clear sans-serif system with a bold, slightly condensed display hierarchy for directions and a stable, readable body face for details. Primary headings are confident, but diagnostic labels remain compact and high contrast.

### Brand Essence
**MediQ turns hospital movement and patient information into a single, confidently guided care experience.**

Personality: **calm, precise, reassuring**.

### Brand Voice
Headlines are direct and action-led; CTAs state the exact next outcome; microcopy reduces uncertainty.

Example lines:
- “Find the next step in care.”
- “You are 2 minutes from Radiology.”

### Wordmark & Logo
A geometric M/Q monogram shaped like a connected route marker: a solid blue pathway folds into a circular destination point. The mark remains simple enough for a small sidebar header and app icon.

### Signature Brand Color
**MediQ Route Blue — #155EEF**.

## Style Decisions

- Every public informational route uses a route rail, destination pin, and current-destination cue so Guided Floorplan remains visible beyond the indoor map.
- MediQ Route Blue is the primary action and navigation color; teal marks progress and active destinations; red is limited to genuine emergency or blood-critical actions.
- Public pages bring the next meaningful action immediately below the route header rather than delaying it behind brochure-style spacing.
