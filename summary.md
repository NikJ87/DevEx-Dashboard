# Architecture Summary: Theme, WhiteLabel, and Design Tokens

This document outlines the technical implementation of the dashboard's dynamic design system and its multi-tiered data strategy.

---

## Dynamic Design & Token Implementation

The application uses a **Token-Driven Design System**. Instead of a static CSS file or a single Tailwind config, the UI is controlled by **CSS Variables** defined as design tokens.

### How it Works:

1.  **Token Definitions**: Themes (e.g., `hm.ts`, `pets.ts`, `partners.ts`, `pas.ts`) are defined as TypeScript objects. Each object contains its persona-specific:
    - **Colors**: Primary, Background, Foreground, Success, Destructive, etc.
    - **Radius**: Edge rounding for cards, buttons, and inputs.
    - **Spacing**: Global layout and component internal spacing.
    - **Typography**: Brand-specific font stacks (Söhne, Filson Pro, Geologica, Space Grotesk).
2.  **Dynamic Application**: The `applyTheme` utility function converts these TypeScript definitions into CSS custom properties and injects them into the `:root` element.
3.  **Real-Time Overriding**: Since everything is variable-based, changing a WhiteLabel persona or Dark Mode instantly updates the entire UI without needing a page reload.

### WhiteLabel Persona Switching

Each WhiteLabel (like "Home & Motor" or "Pet Circle") has its own unique visual identity.

- **Dynamic Fetching**: The app is built to support fetching these design tokens from a remote API. This is controlled via `VITE_THEME_SOURCE=api`.
- **API Fallback**: If the remote server is unreachable, the system automatically falls back to the high-performance local tokens to ensure a smooth user experience.

---

## Data Strategy & Mocking Layer

To support rapid development, offline work, and robust CI/CD, we've implemented a multi-layered data mocking strategy.

### Layer 1: MSW Interception (Real Network Simulation)

Using **Mock Service Worker (MSW)**, we intercept outgoing `fetch` requests at the network layer.

- **Advantage**: The frontend code remains "clean" as it genuinely makes `fetch` calls without knowing it's being mocked.
- **Implementation**: MSW generates realistic, trend-based algorithmic data (e.g., for pipeline durations or test failures) ensuring the charts look realistic and high-fidelity.

### Layer 2: Faker.js (Dynamic Generation)

When `VITE_DATA_MOCK_STRATEGY=fakerjs` is set, we use **Faker.js** to generate randomized but consistent datasets on the fly. This is ideal for testing edge cases or large data visualizations.

### Layer 3: Static JSON Mocks

The simplest layer. It uses hardcoded JSON arrays to provide instantaneous data during initial UI/Component development and Unit Testing. It is extremely fast and predictable.

---

## Summary of Goals Achieved

- **Developer Productivity**: Toggle between real API and varied mock data in seconds without changing a single line of component code.
- **Visual Branding**: Switch between completely different brand identities (typography, radii, and color) instantaneously via the WhiteLabel Persona selector.
- **Performance**: High-fidelity SVG rendering with **D3.js** paired with optimized React 19 rendering and TanStack Router preloading.
