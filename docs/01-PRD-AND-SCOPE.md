# Orchiné Studio - Product Requirements & Scope

## 1. Project Overview

- **Brand Name:** Orchiné Studio
- **Product:** Botanical Eco-Print Scarves (4 Launch Designs)
- **Project Type:** Interactive Commercial E-Commerce Simulation
- **Timeline:** 14 Days
- **Team Split:** 1 Lead Developer (Code/Architecture), 3 Designers (3D Assets, Lookbook Photos, Copy, UI/UX)

## 2. Core User Flow

1. **Landing Entry Experience (`/`):** Slate-blue (`#485C91`) welcoming page anchored to `reference/LandingPage.png`, featuring centered gradient "Orchiné Studio" typography, 3-line settings menu, top-right orchid About Us button, and the iconic "CLICK" pill button.
2. **Atelier Lobby & Voice Assistant Mode (`/lobby`):** Deep twilight violet stage (`#25154D`) anchored to `reference/Lobby.png`, placing Orchéllia the Orchid companion in the dead center. Upon arrival, Orchéllia greets visitors in pure voice mode (Sol Voice via OpenAI Audio) without displaying text, providing voice input interaction and the "Enter Atelier" progression trigger.
3. **Interactive 3D Studio & Collection (`/studio`):** Full e-commerce simulation featuring the procedural 3D silk cloth simulation (`PlaneGeometry` + GPU ripples), Nike ID-style snap tray across 4 SKUs (Solstice, Fern Whisper, Indigo Flora, Iron Oak), Craft Lab 2.5× Macro Loupe, and Styled in Nature lookbook.
4. **Settings & Navigation Drawer:** 3-horizontal line hamburger icon available across all headers, providing direct navigation between pages, user profile inputs (username, real name), and dark/light mode switching.
5. **About Us Team Showcase (`/about`):** Top-right orchid flower button present across all headers navigating directly to a dedicated full editorial showcase inspired by Yosuka Credits. Features 4 team member cards (Photo, Name, Class, Instagram, Phone Number) surrounding the central Class Emblem, locked in code (`src/data/team.ts`) without public in-browser edits.
6. **Simulated Checkout:** Slide-over shopping bag, quantity adjustments, shipping details form, and instant downloadable/viewable digital Certificate of Authenticity (Eco-Passport COA).

## 3. Strict Cut List (Out of Scope)

- Real payment gateway integration (Midtrans/Stripe)
- User authentication / database persistence (using localStorage instead)
- Real-time cloth vertex physics simulation
- More than 1 base 3D mesh
