# Health App React Structure

This project scaffolds a React (Vite) web experience that mirrors the foundations of an Android health companion. It provides routing, shared layout, feature modules, and stubbed data sources so you can focus on building real integrations later.

## Project Layout

```
HealthApp/
├── index.html                 # Vite entry page
├── package.json               # Project metadata & scripts
├── vite.config.js             # Vite setup with `@` path alias
├── jsconfig.json              # Editor path alias support
└── src/
    ├── main.jsx               # App bootstrap
    ├── App.jsx                # Global providers (React Query + routes)
    ├── styles/                # Global CSS
    ├── api/                   # API clients (stubbed for now)
    ├── data/                  # Local JSON fixtures (HeartRate, Steps)
    ├── utils/                 # Helpers (`createPageUrl`, `cn`, etc.)
    ├── components/
    │   └── ui/                # Lightweight UI primitives (button, card…)
    ├── app/
    │   ├── layout/            # Root layout with header + bottom nav
    │   └── navigation/        # Centralised route definitions
    ├── features/
    │   └── health/            # Health-specific components (charts, dialogs)
    └── screens/               # Top-level screens (Dashboard, Steps, …)
```

### Navigation

- `src/app/navigation/AppRoutes.jsx` centralises app routes using `react-router-dom`.
- `src/app/layout/MainLayout.jsx` wraps every screen with the shared header, theme toggle, and Android-style bottom navigation.
- `createPageUrl` in `src/utils/index.js` keeps route paths in one place so screens/layout/components can stay in sync.

### Visual Theme

- El tema oscuro brillante se define con variables CSS en `src/styles/global.css` y se expone como tokens de Tailwind (`background`, `surface`, `text-primary`, etc.).
- Componentes base (`src/components/ui`) aplican bordes redondeados grandes, sombras suaves y gradientes para replicar el look & feel de las capturas.
- Puedes ajustar colores y gradientes en `tailwind.config.js` o en las variables `:root` / `.dark` según tus necesidades.

### UI Toolkit

The `src/components/ui` folder contains lightweight, accessible primitives roughly equivalent to the UI surface you would expect from a design system. Replace or extend these with your preferred library (e.g. shadcn/ui, Material, Native Base) when you’re ready.

### Data Layer

`src/api/base44Client.js` currently serves JSON fixtures from `src/data`. Swap the implementation with your real APIs or native bridges while keeping the same `base44.entities.{Entity}.list()` interface so screens stay untouched.

### Next Steps

1. Install dependencies and run the dev server:
   ```bash
   npm install
   npm run dev
   ```
2. Integrate a styling solution (Tailwind, nativewind, etc.) so the existing utility classNames take effect.
3. Replace the stub data/API layer with live sources (BLE, REST endpoints, device sensors).
4. Add automated tests (unit + integration) as the domain logic grows.
