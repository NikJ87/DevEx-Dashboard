# DevEx Analytics Dashboard

This dashboard is built to provide insights into the developer experience of a company. It provides insights into deployment frequency, test suite failures, and pipeline durations. It helps teams understand the health of their development process and identify areas for improvement.

---

## Technology Stack

The project leverages a modern web stack for speed, type safety, and high-fidelity visualizations.

- **React 19**: Component-based UI library.
- **TypeScript**: Static typing for robust developer experience and fewer runtime errors.
- **Vite**: Ultra-fast build tool and dev server with Hot Module Replacement (HMR).
- **D3.js**: The industry standard for bespoke, interactive data visualizations.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent UI development.
- **Storybook**: Isolated component development and documentation.
- **Playwright**: Reliable end-to-end testing for modern web apps.
- **TanStack Router**: Fully type-safe routing with built-in data fetching patterns.

---

## Architectural Patterns

The application is built on three core architectural pillars:

### 1. Design Token System

Instead of hardcoded colors or spacing, the entire UI is driven by **Design Tokens**. These are defined as CSS variables (e.g., `--color-primary`, `--radius-lg`) that are injected into the DOM at runtime. This allows for instantaneous theme swaps and high-fidelity visual consistency.

### 2. WhiteLabel Persona Engine

The dashboard supports multiple "Personas" (H&M, Pets, Partners, PAS). Each persona provides its own set of design tokens, including typography (brand-specific fonts), color palettes, and rounding/spacing rules. The app detects the current persona (via URL, local storage, or environment) and applies the corresponding "skin" dynamically.

### 3. Hierarchical Mocking & Data Strategy

We use a "Plug-and-Play" data architecture. Developers can toggle between:

- **Direct API (`api`)**: Real-world network requests.
- **MSW Interception (`msw`)**: Intercepting network calls for realistic, algorithmic data mocking.
- **Faker.js (`fakerjs`)**: On-the-fly randomized data generation.
- **Static JSON (`static`)**: Lighting fast development with predictable data.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Running Locally

```bash
npm run dev
```

### Quick Commands (Mocking & E2E)

Dedicated scripts for different development and testing scenarios:

| Command                                | Strategy                                      |
| :------------------------------------- | :-------------------------------------------- |
| **`npm run dev:mock:msw`**             | Full **MSW** interception for data.           |
| **`npm run dev:mock:faker`**           | Algorithmic **Faker.js** data generation.     |
| **`npm run dev:mock:static`**          | Instant load using **static JSON** mocks.     |
| **`npm run e2e:mock:msw:chrome`**      | Run **Playwright** tests with MSW (Chromium). |
| **`npm run e2e:mock:static:headless`** | Run **Playwright** tests with static mocks.   |

---

## ⚙️ Configuration (.env)

The application behavior can be heavily customized via hierarchical strategies for data and themes.

### Data Architecture

| Variable                      | Options                    | Description                                                                                                            |
| :---------------------------- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **`VITE_DATA_STRATEGY`**      | `api`, `mock`              | **Top-level Strategy**: `api` performs direct network calls. `mock` uses local logic.                                  |
| **`VITE_DATA_MOCK_STRATEGY`** | `static`, `fakerjs`, `msw` | **Mock Logic**: <br>• `static`: Hardcoded arrays.<br>• `fakerjs`: Randomized generators.<br>• `msw`: Intercepts fetch. |
| **`VITE_API_BASE_URL`**       | URL string                 | Base URL for chart data.                                                                                               |

### Theme Architecture

| Variable                       | Options         | Description                                                                                          |
| :----------------------------- | :-------------- | :--------------------------------------------------------------------------------------------------- |
| **`VITE_THEME_SOURCE`**        | `api`, `mock`   | **Top-level Strategy**: `api` fetches from server. `mock` uses local logic.                          |
| **`VITE_THEME_MOCK_STRATEGY`** | `static`, `msw` | **Mock Logic**: <br>• `static`: Loads from local token files.<br>• `msw`: Intercepts fetch with MSW. |
| **`VITE_THEME_API_URL`**       | URL string      | Base URL for design tokens.                                                                          |

---

## 🧪 Testing & Documentation

- **Storybook**: `npm run storybook`
- **Playwright (E2E)**: `npx playwright test`
- **Build**: `npm run build`
