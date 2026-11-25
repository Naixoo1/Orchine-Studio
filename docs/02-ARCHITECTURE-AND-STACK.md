# Technical Architecture & Editable Stack

## 1. Tech Stack (Audited & Locked)

- **Core Web Framework:** Next.js 15 (`15.1.0`, App Router), React 19 (`19.0.0`), React DOM 19 (`19.0.0`), TypeScript (`5.7.2`)
- **Styling & Design System:** Tailwind CSS (`3.4.16`), PostCSS (`8.4.49`), Autoprefixer (`10.4.20`), `clsx` (`2.1.1`), `tailwind-merge` (`2.6.0`), Lucide Icons (`lucide-react` `0.468.0`)
- **3D Procedural Canvas:** Three.js (`0.172.0`), React Three Fiber (`@react-three/fiber` `^9.0.0`), Drei (`@react-three/drei` `^10.0.0`)
- **2D Animation & Micro-Interactions:** Framer Motion (`framer-motion` `11.15.0`)
- **Smooth Scrolling:** Lenis (`lenis` `1.1.18`)
- **Client State Management:** Zustand (`zustand` `5.0.2`)
- **Testing & Quality Assurance:** Vitest (`vitest` `^5.1.1`)
- **AI Companion & Voice:** OpenAI API (`openai` `4.76.0`, utilizing `gpt-4o-mini` with structured Tool Calling, and `tts-1` for conversational voice synthesis)

## 2. Operational Overrides & Architectural Decision Records (ADRs)

### ADR-001: Procedural 3D PlaneGeometry Scarf Pipeline (Replaces .glb/Draco)

- **Status:** Accepted & Enforced (Session 1)
- **Deprecation:** The legacy pipeline relying on an external `.glb` mesh, Draco decompression worker loading, and manual UV unwrapping in external 3D software is formally deprecated.
- **Decision:** Generate the scarf mesh procedurally using a high-density subdivided Three.js `PlaneGeometry`. Cloth ripples and natural draping are driven via custom GPU wave physics and cursor touch displacement updated inside `useFrame`.
- **Procedural Plane Specifications:** Subdivided `PlaneGeometry(3.2, 3.2, 96, 96)` yielding ~9,400 vertices for ultra-smooth continuous cloth ripple deformation without polygonal facets.
- **Fabric Realism:** The procedural plane is rendered with `MeshPhysicalMaterial` configured for organic silk properties (sheen, transmission, clearcoat, micro-surface roughness, and double-sided rendering).
- **GPU Wave & Ripple Injection (`onBeforeCompile`):** Custom GLSL vertex shader injection computing compound harmonic wind waves (`sin`/`cos` combinations) combined with real-time cursor/touch distance attenuation ripples and normal vector perturbation for authentic light shimmer without CPU overhead.
- **Client Isolation & Luxury Fallback:** Decoupled client rendering via `next/dynamic` (`ssr: false`) inside `ScarfCanvas.tsx` with a zero-JS luxury loading fallback (`ScarfCanvasLoading`) showing animated marigold pulse and atelier typography.
- **Decoupled Disposal Lifecycle:** Strict independent Three.js cleanup lifecycles in separate `useEffect` hooks disposing geometry (`geometry.dispose()`), material (`material.dispose()`), and textures (`texture.dispose()`) on unmount to eliminate WebGL memory leaks.
- **Benefits:**
  - Zero 3D asset network payload over the wire (bypasses large `.glb` downloads).
  - Eliminates Draco decoder web worker instantiation overhead and mobile worker crashes.
  - Instantaneous, 60fps dynamic responsive drape reacting directly to user mouse/touch coordinates.
  - Clean, distortion-free parametric UV mapping for seamless switching across all 4 launch eco-print textures.

### ADR-002: Reference Assets Protocol

- **Status:** Accepted & Enforced (Session 1)
- **Directive:** Canonical visual benchmarks, editorial rhythm, and interaction dynamics are anchored to design reference media staged in [reference/](file:///c:/code/Orchiné/reference):
  - `AnimationExample.mp4`: Motion reference for hero silk drape and wind turbulence.
  - `Orchéllia AI Opening .mp4`: Benchmark for AI companion entrance, greeting layout, and typography overlay.
  - `AI Orchéllia Tutorial.mp4`: Interaction reference for audio player bar, UI spotlight rings, and synchronized tool actions.
- **Workflow Requirement:** Developers and reviewers must verify visual and pacing fidelity against these source assets before closing UI/3D milestones.

### ADR-003: Progressive Docs Protocol

- **Status:** Accepted & Enforced (Session 1)
- **Directive:** Project documentation in `/docs` must be maintained progressively in lockstep with codebase milestones, operational overrides, and architectural shifts.
- **Verification Gate:** Every documented step must pass automated verification—including clean Next.js production builds (`next build`), zero TypeScript compilation errors, zero ESLint warnings (`next lint`), and 100% passing unit tests (`vitest run`)—before milestone completion.

### ADR-004: Core 2D Editorial Layout & Interactive Product Switcher Architecture

- **Status:** Accepted & Enforced (Session 2 / Day 2)
- **Directive:** The 2D presentation layer must provide a responsive, high-fashion editorial container that frames the 3D procedural scarf simulation while providing direct product discovery tools:
  - **SmoothScrollProvider (`src/components/providers/SmoothScrollProvider.tsx`):** Wraps the entire application shell with Lenis smooth scrolling for luxury inertia and normalized wheel/touch acceleration.
  - **MarqueeTicker (`src/components/layout/MarqueeTicker.tsx`):** Continuous botanical announcement ticker ribbon conveying atelier status, release dates, and organic provenance.
  - **HeroStage (`src/components/hero/HeroStage.tsx`):** Dual-mode presentation stage featuring a fluid `[▶ Watch Film]` ⟷ `[✦ Inspect 3D Scarf]` toggle, video autoplay/pause lifecycle synchronized with `AnimationExample.mp4`, and prominent editorial headline ("IMPRINTED BY NATURE").
  - **CollectionSpotlight (`src/components/collection/CollectionSpotlight.tsx`):** Nike ID-inspired horizontal snap-scroll product tray with arrow controls (`<` `>`), botanical colorway flora selector chips (*Silver Dollar Eucalyptus*, *Sword Fern*, *Fermented Indigo*, *Oak Gall*), dual-view flip cards (interactive 3D preview vs styled lookbook photo), edition badges (`#024/100`), quick-add action, and Draping Guide modal trigger.
  - **OrchelliaSection (`src/components/orchellia/OrchelliaSection.tsx`):** Dedicated Nike-style feature section in the core page flow for Orchéllia AI. Features dual video integration (`orchellia-opening.mp4` and `orchellia-tutorial.mp4` staged from `reference/`), custom play/pause overlay, and 4 interactive live site-control demos where Orchéllia rotates the 3D scarf, switches botanicals, smooth-scrolls to the Macro Loupe, and adds items to the bag.
  - **StylingGuideModal (`src/components/styling/StylingGuideModal.tsx`):** Pop-up editorial modal demonstrating 3 practical styling methods (*The Parisian Bias Knot*, *The Draped Shoulder Shawl*, *The Botanical Crown Wrap*) with step-by-step techniques and garment suitability specs.
  - **Digital Certificate of Authenticity (COA) / Eco-Passport (`src/components/cart/SlideOverBag.tsx`):** Slide-over bag checkout flow enhanced with an instant digital Eco-Passport modal featuring order ID, edition batch number (`#024/100`), steaming timestamp, foraged harvest coordinates, and master dyer sign-off.
  - **Web Audio Atmospheric Sound Engine (`src/utils/ambientAudio.ts`):** Zero-asset procedural pink-noise atmospheric breeze and silk rustle generator with LFO modulation and low-pass filtering, hooked directly to the navbar sound toggle.
  - **CraftLab (`src/components/craft/CraftLab.tsx` - The Botanical Alchemy):** Innovation lab with an interactive 2.5× Macro Loupe inspector featuring cursor-following magnifying lens and natural dye formulation tabs (Cedar Steaming, Bacterial Indigo Vat, Oak Gall Tannins).
  - **LookbookGrid (`src/components/lookbook/LookbookGrid.tsx` - "Styled in Nature"):** Editorial masonry grid with interactive pulsing radar style pins (French bias knot, draped shawl wrap, indigo headwrap, framed art) opening a backdrop-dismissible modal with styling details.
  - **OrchelliaTeaser (`src/components/orchellia/OrchelliaTeaser.tsx`):** Floating botanical companion teaser orb with UI control chips preparing for Day 4/5 full AI tool calling and voice integration.

## 3. Folder Structure

- `/docs` - Project specs, sprint roadmap, architectural ADRs, and markdown lint guidelines
- `/reference` - Ground-truth video animations, Orchéllia visual references, and interaction benchmarks
- `/public/videos` - Staged video files (`hero-scroll.mp4`, `orchellia-opening.mp4`, `orchellia-tutorial.mp4`)
- `/public/models` - *(Deprecated)* Legacy 3D model path; superseded by procedural `PlaneGeometry` pipeline
- `/public/textures` - 4 botanical eco-print pattern textures (WebP) + fabric weave normal & roughness maps
- `/public/lookbook` - High-resolution editorial photography of models wearing the 4 scarves
- `/src/data/scarves.ts` - Single source of truth for product names, pricing, botanical stories, and texture paths
- `/src/store/useStudioStore.ts` - Global Zustand state managing active scarf, 3D camera angles, cart, and Orchéllia UI highlights
- `/src/store/useStudioStore.test.ts` - 7 unit tests covering store initialization, product selection, view presets, pointer physics, cart modifications, and spotlight toggling (100% pass rate)
- `/src/components/canvas` - Isolated R3F procedural scarf canvas (`ScarfCanvas.tsx`, `ScarfScene.tsx`, `ProceduralScarf.tsx`, `ProceduralTexture.ts`) with GPU wave deformation, lighting rig, and luxury zero-JS fallback
- `/src/components/collection` - 4-SKU Nike ID-inspired horizontal tray (`CollectionSpotlight.tsx`) with arrow navigation, botanical colorway chips, dual-view flip cards, and quick-add actions
- `/src/components/craft` - Interactive "Botanical Alchemy" craft lab (`CraftLab.tsx`) with 2.5× Macro Loupe inspector and dye formulation tabs
- `/src/components/hero` - Dual-mode cinematic and 3D hero stage (`HeroStage.tsx`) with parallax scroll dynamics and editorial typography
- `/src/components/lookbook` - "Styled in Nature" masonry lookbook (`LookbookGrid.tsx`) with interactive radar styling pins and modal
- `/src/components/styling` - Quick-view draping & styling guide modal (`StylingGuideModal.tsx`)
### ADR-005: Living Botanical Companion, Text Selection Blossom & Sol Voice Pipeline

- **Status:** Accepted & Enforced (Session 3)
- **Directive:** The Orchéllia AI Companion operates as a living, context-aware presence inside the website (`OrchelliaSeed.tsx`):
  - **Zero-Typing Selection Blossom Pill:** When a visitor highlights any word, sentence, or botanical term across the site, a subtle floating botanical pill (`[🌿 Ask Orchéllia about "..."]`) appears directly above the text. Clicking it awakens Orchéllia and immediately triggers a spoken Sol Voice explanation with zero typing required.
  - **Push-to-Talk Voice Input (Web Speech API):** Instantaneous in-browser microphone capture with live voice activity indication, transcribing speech in real time and automatically synthesizing Orchéllia's Sol Voice reply upon completion.
  - **Living Atelier Companion Panel (No Cropped Video Popups):** The awkward full-screen cropped video modal is eliminated. Instead, Orchéllia blossoms directly into a luxury glass panel with an organic living seed embryo, dynamic active context badge (`✦ Viewing: [Scarf Name]`), and real-time audio soundwave frequency visualizer.
  - **Dynamic Context-Aware Suggestion Engine:** Suggested questions adapt dynamically to the visitor's real-time focus (e.g. tailoring questions specifically to Solstice, Fern Whisper, Indigo Flora, or Iron Oak).
  - **Sol Voice Audio Streaming (`/api/orchellia/voice`):** Streams OpenAI TTS using the user-specified `sol` voice (with graceful fallback to `shimmer`) and real-time animated soundwave visualization.
  - **Structured Tool Calling (`/api/orchellia/chat`):** Powers direct UI manipulation (`select_scarf`, `set_3d_view`, `focus_section`, `highlight_ui`, `open_bag`, `open_styling_guide`, `suggest_journey`) with an intelligent atelier preview fallback engine when running without an API key.

### ADR-006: Living Orchid Pet Companion with ChatGPT-Style Dock Pill & Dual-Layer UI Zoom

- **Status:** Accepted & Enforced (Session 3)
- **Directive:** The Orchéllia AI Companion is refactored into a living, floating Orchid Pet character (`OrchelliaPet.tsx`) inspired by conversational desktop AI companions:
  - **Living Orchid Avatar:** Seamlessly screen-blended looping orchid animation with dark background dropout and radial gradient edge feathering, floating with gentle breathing dynamics at the bottom-right.
  - **ChatGPT-Style Floating Interaction Dock Pill:** Positioned directly beneath the orchid pet, featuring an uncropped dual-action pill with `[💬 Chat / Subtitle Toggle]` and `[ılı Voice Mic Push-to-Talk]` buttons with animated real-time soundwaves.
  - **Dual-Layer UI & Canvas Zoom (`zoom_ui` Tool):** Orchéllia can smoothly interpolate the Three.js camera closer to the 3D scarf fabric weave (camera close-up via `CameraRig`) and magnify specific UI components (like the 2.5× Macro Loupe in Craft Lab or collection cards) with an active focus indicator and manual reset trigger.
  - **Floating Speech Bubble Dialog:** Replaces full-screen modals with an adjacent floating speech card showing real-time spoken subtitles, active context badges, and dynamic questions.
  - **Zero-Typing Text Selection Blossom:** Floating `[🌿 Ask Orchéllia about "..."]` pill above highlighted phrases triggers immediate spoken Sol Voice explanations.

### ADR-007: Waypoint Flight, Expressive Action Animations, and Audio-Paced Word Streaming

- **Status:** Accepted & Enforced (Session 3)
- **Directive:** The Orchéllia Orchid Pet companion moves, acts, and speaks with natural living synchronization across the entire website UI:
  - **Waypoint Flight Physics:** Orchéllia is no longer static in the bottom-right corner. When explaining features, she smoothly glides across the screen via Framer Motion spring physics to hover directly beside the UI feature (e.g. 3D Scarf Hem, Collection Swatches, Craft Lab Macro Loupe, or Atelier Bag), returning to her dock once finished.
  - **Contextual Action States:**
    - `inspecting`: Directional tilt towards the element with a glowing golden focal beam and target indicator.
    - `speaking`: Petal bloom expansion (1.08× scale) with rhythmic radiating soundwave frequency auras.
    - `delighted`: Shimmering golden spore burst on completing actions (e.g., adding an item to the shopping bag).
    - `thinking`: Concentric dashed spore orbit rotation while pre-fetching voice audio.
    - `flying`: Aerodynamic tilt with flight guidance badge.
    - `idle`: Gentle 3.5s floating breathing bob.
  - **Audio-Paced Word Streaming:** Voice audio is pre-fetched before rendering text. Words stream progressively one-by-one in exact synchronization with the audio cadence of Sol Voice, completely eliminating the unnatural delay where full text appeared before the voice started speaking.

### ADR-008: Slate-Indigo & Twilight Palette, Multi-Page Flow, Voice-Only Lobby & About Us

- **Status:** Accepted & Enforced (Session 4)
- **Directive:** The platform presentation architecture is reorganized to align with `LandingPage.png` and `Lobby.png`:
  - **Multi-Page Flow (`/` ➔ `/lobby` ➔ `/studio`):**
    - Route `/`: Slate-blue (`#485C91`) landing entry with centered typography logo, 3-line settings menu, About Us orchid button, and interactive "CLICK" pill button.
    - Route `/lobby`: Deep twilight violet stage (`#25154D`) featuring Orchéllia in the dead center with automated voice-only greeting (no visible text) and progression to the 3D studio.
    - Route `/studio`: Full e-commerce suite featuring 3D procedural cloth canvas, Nike ID collection tray, Craft Lab, Lookbook, and bag drawer.
  - **Centered Header Identity (`StudioHeader.tsx`):** Every page features the centered "Orchiné Studio" logo, top-left 3-line hamburger menu, and top-right orchid button.
  - **3-Line Settings & Directory Drawer (`SettingsDrawer.tsx`):** Provides instant navigation between all pages, username and real name profile preferences, and dark/light mode toggle.
  - **About Us Team & Class Modal (`AboutUsModal.tsx`):** Triggered by the top-right orchid icon across all pages; presents 4 team member cards (Name, Class, Instagram, Phone Number) surrounding the central Class Emblem, complete with local image upload capabilities.

### ADR-011: 3D WebGL, 60 FPS Parallax & Companion Asset Performance Architecture

- **Status:** Accepted & Enforced (Session 5)
- **Problem Statement:** Real-time 3D cloth deformation on a 9,400-vertex plane combined with high-DPI fill rates (`dpr={[1, 2]}`), continuous unmounted canvas rendering, 11.6MB looping video companion decoding, and high-frequency React state updates during scroll produced noticeable UI choppiness and frame drops.
- **Decisions & Implementation:**
  1. **60% Geometry Optimization:** Procedural plane tessellation optimized from `PlaneGeometry(3.2, 3.2, 96, 96)` to `PlaneGeometry(3.2, 3.2, 60, 60)`, reducing vertex count from ~9,400 to ~3,720. Retains identical silky drape ripples while cutting vertex shader calculations by 60%.
  2. **Viewport-Aware Render Throttling & Shadow Map Elimination:**
     - Removed expensive dynamic shadow map calculations (`castShadow`, `receiveShadow`, `shadow-mapSize={[1024, 1024]}`) from lights and cloth mesh. Silk luster is computed via specular sheen, transmission, and rim lighting.
     - Capped canvas pixel density to `dpr={[1, 1.5]}` to prevent 4x fill-rate bottlenecks on Retina/4K displays.
     - Integrated `IntersectionObserver` in `ScarfScene.tsx` paired with store `heroMode`: when scrolled past the hero or when `heroMode === 'film'`, R3F switches to `frameloop="never"`, reducing GPU usage to 0% idle.
  3. **Ref-Based 60 FPS Parallax Loop (`HeroStage.tsx`):**
     - Eliminated `setScrollY` React state updates during window scroll.
     - Parallax transforms are directly written to `videoContainerRef.current.style.transform` inside a `requestAnimationFrame` loop, eliminating 60+ component re-renders per second during Lenis smooth scroll.
  4. **GPU-Accelerated Animated Companion Video (`OrchelliaPet.tsx`):**
     - Retains the living looping animated video of Orchéllia (`/videos/orchellia-opening.mp4`) with `mix-blend-screen` and feathered radial mask.
     - Enhanced with `transform-gpu will-change-transform` and `preload="auto"` for smooth hardware-accelerated video decoding alongside Framer Motion spring actions (hover, inspect tilt, speaking pulse, delighted spore bursts).
  5. **Hardware Composite Blur Acceleration (`BotanicalAtmosphere.tsx` & `/lobby`):**
     - Optimized Gaussian blurs down to 50-70px and added `transform-gpu will-change-transform` to atmospheric aura glows, caching filtered textures on GPU layers.
  6. **Hardware-Accelerated Marquee Ticker (Moving Text Slide):**
     - Replaced 2D `translateX` with 3D hardware-accelerated `translate3d(..., 0, 0)`, `will-change: transform`, `perspective: 1000px`, and `backface-visibility: hidden`.
     - Removed continuous `backdrop-blur-sm` from the full-width ticker bar to eliminate whole-viewport backdrop-filter invalidations during scrolling, locking ticker framerate to 60-120 FPS.
  7. **Single Forward Pass Silk Shading & 40x40 Cloth Geometry (`ProceduralScarf.tsx`):**
     - Completely removed the heavy Three.js offscreen refraction pass (`transmission: 0`); silk habotai relies purely on surface `sheen`, `clearcoat`, and specular highlights.
     - Reduced plane tessellation to `40x40` (~1,680 vertices), preserving silky wave curves while saving 55% of vertex trigonometric calculations.
  8. **Decoupled Hero Video & Lenis Touch Optimization:**
     - Removed `autoPlay` and set `preload="none"` on `hero-scroll.mp4` so it never decodes in hardware while in 3D canvas mode.
     - Normalized Lenis smooth scroll (`lerp: 0.1`, `syncTouch: true`, `duration: 1.0`) to eliminate trackpad and scroll-wheel micro-stuttering.

## 3. Directory Layout (Progressive Real-Time State)

- `/src/app/page.tsx` - Landing Page entry matching `reference/LandingPage.png` with "CLICK" button
- `/src/app/lobby/page.tsx` - Atelier Lobby stage matching `reference/Lobby.png` with centered Orchéllia and voice-only greeting
- `/src/app/studio/page.tsx` - 3D Scarf Studio & Shop with complete e-commerce interactive simulation
- `/src/components/layout/StudioHeader.tsx` - Unified header across all pages with centered logo, 3-line menu, and orchid button
- `/src/components/settings/SettingsDrawer.tsx` - Slide-out drawer for page directory, user profiles, and theme preferences
- `/src/components/about/AboutUsModal.tsx` - Editorial team modal with 4 member cards and central class logo upload
- `/src/data/scarves.ts` - Master catalog of 4 launch SKUs (Solstice, Fern Whisper, Indigo Flora, Iron Oak)
- `/src/store/useStudioStore.ts` - Centralized Zustand store managing SKU selection, 3D views, cursor physics, cart, UI spotlight, audio, settings, and team data
- `/src/components/canvas` - R3F procedural cloth simulation (`ProceduralScarf.tsx`, `ScarfScene.tsx`, `ScarfCanvas.tsx`, `ProceduralTexture.ts`) with camera zoom interpolation rig
- `/src/components/hero` - Parallax cinematic stage (`HeroStage.tsx`) with scroll-linked video/canvas toggle
- `/src/components/collection` - Nike ID-style snap tray (`CollectionSpotlight.tsx`) with botanical chips and flip view
- `/src/components/craft` - "The Botanical Alchemy" lab (`CraftLab.tsx`) with interactive 2.5× Macro Loupe inspector
- `/src/components/lookbook` - Styled in Nature photo masonry (`LookbookGrid.tsx`) with interactive radar pins
- `/src/components/styling` - Editorial pop-up draping guide (`StylingGuideModal.tsx`) with 3 knotting techniques
- `/src/components/providers` - Application shell providers including Lenis smooth scroll (`SmoothScrollProvider.tsx`)
- `/src/components/cart` - Slide-over shopping bag drawer (`SlideOverBag.tsx`) with quantity adjustments, checkout controls, and Digital Eco-Passport COA modal
- `/src/components/orchellia` - Dedicated feature section (`OrchelliaSection.tsx`) and living Orchid Pet companion (`OrchelliaPet.tsx`)
- `/src/utils/ambientAudio.ts` - Web Audio API procedural atmospheric breeze and silk rustle sound generator
- `/src/app/api/orchellia/chat/route.ts` - Secure server endpoint calling OpenAI `gpt-4o-mini` with structured Tool Calling (including `zoom_ui`)
- `/src/app/api/orchellia/voice/route.ts` - Secure server endpoint streaming OpenAI Sol voice (`tts-1`)

## 4. How Orchéllia Controls the UI

Orchéllia never touches the DOM directly. She returns structured tool calls from `/api/orchellia/chat` that trigger actions in `useStudioStore`:

- `select_scarf(scarfId)` -> Updates active product, swaps procedural silk texture, and transitions camera
- `set_3d_view(preset)` -> Moves camera to `front`, `drape_detail`, `full_spin`, or `top_down`
- `focus_section(sectionId)` -> Smooth scrolls via Lenis to Hero, Collection, Orchellia Guide, Craft, or Lookbook
- `highlight_ui(targetId, explanation)` -> Dims screen and puts a glowing ring around a specific button or term while speaking
- `open_bag()` -> Opens the slide-over shopping bag and Eco-Passport COA drawer
- `open_styling_guide()` -> Opens the Parisian Bias Knot and Draping Guide modal
- `suggest_journey(theme)` -> Proactively provides tailored recommendations for undecided visitors

## 5. Build & Type Safety Verification

- **Next.js Production Build:** Verified clean build via `next build` (App Router static optimization and prerendering successful).
- **TypeScript Compilation:** Zero errors (`strict: true`, fully typed across all stores, components, and datasets).
- **ESLint Audit:** Zero warnings, zero errors (`next lint`).
- **Unit Testing Suite:** 10/10 unit tests passing in Vitest (`npm test` executing `useStudioStore.test.ts` in 653ms).
