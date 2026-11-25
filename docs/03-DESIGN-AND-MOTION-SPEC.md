# Design, Procedural 3D & Animation Spec (Editable)

## 1. Procedural 3D Scarf Setup (No .glb Required)

- **Base Mesh:** High-segment `PlaneGeometry` (`80 x 80` segments) deformed into a natural silk/cotton drape.
- **Material:** `MeshPhysicalMaterial` with `doubleSide: true`, `roughness: 0.75`, `sheen: 1.0`, and `sheenRoughness: 0.4`.
- **Dynamic Texture Swapping:** Switching SKUs swaps the `map` (eco-print pattern) smoothly while keeping the shared fabric weave `normalMap`.
- **Textures Needed from Design Team:**
  - `scarf-1.webp` to `scarf-4.webp` (2048x2048 botanical eco-print artwork)
  - `fabric-normal.webp` (1024x1024 tileable cloth weave texture)

## 2. Cursor & Touch Fabric Physics (Code-Driven)

- **Idle Motion:** Gentle sinusoidal breeze wave running at 60fps via `useFrame` (mutating vertex positions via refs, never React state).
- **Cursor / Touch Contact:** Pointer raycasting calculates distance from cursor/finger to scarf vertices, creating a localized fabric ripple and shifting a warm point light across the sheen layer.
- **360 Inspection:** `OrbitControls` with damping enabled so users can spin and inspect both sides of the eco-print.

## 3. 2D Layout Animations (Edit triggers & timing here)

- **Editorial Entrance:** Staggered fade-up on hero titles and collection cards (`duration: 0.5s`).
- **Orchéllia UI Spotlight:** Screen dims slightly (`bg-black/40 backdrop-blur-xs`) while a glowing highlight ring outlines the exact button, 3D viewer, or botanical term Orchéllia is explaining.
- **Interactive Glossary:** Underlined eco-print terms (e.g., *mordant*, *tannin*, *eucalyptus*) open a quick definition card and trigger Orchéllia's voice explanation on click.

## 4. Brand Color Architecture & Design Tokens

### 4.1 Base & Background Palette (Atmospheric Progression)
The website transitions across an intentional botanical gradient from entry to studio:
- `#485C91` (Slate Blue): Landing Page (`/`) base anchored directly to `reference/LandingPage.png`.
- `#341F5F` (Atelier Plum): Atelier Lobby (`/lobby`) stage background anchored to `reference/Lobby.png`.
- `#221D63` (Midnight Iris): Deep immersive canvas for the 3D Studio (`/studio`) and About Us (`/about`).
- `#582E8B` (Royal Orchid Violet): Radial depth glows, active card surfaces, and modal drawer overlays.
- `#373191` (Indigo Twilight): Elevation borders, header backdrops, and interactive glass panels.

### 4.2 Font & Typography Palette
Replaces legacy orange/gold accents with the atelier orchid lavender and botanical hierarchy:
- `#BB9AEF` (Lavender Orchid Purple): **Primary Text Accent**. Applied across active state badges, interactive buttons, price highlights, Orchéllia spotlight rings, voice equalizer bars, and highlighted terms.
- `#FFF2B1` (Warm Cream): Primary luxury headline typography, editorial titles, and high-contrast labels.
- `#FFC8DD` (Blossom Orchid Pink): Secondary botanical accents, season tags, and subtle floral highlights.
- `#FF9E69` (Warm Peach): Tertiary organic dye accents and harvest warm notes.
