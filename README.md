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

### Android Build (Capacitor)

El proyecto incluye scripts y configuración de [Capacitor](https://capacitorjs.com/) para empaquetar la app web dentro de un contenedor Android.

1. Configura tus herramientas nativas (Android Studio, SDK Platform Tools, Java 17).
2. Genera el build web y sincroniza los artefactos con el proyecto nativo:
   ```bash
   npm run android:build
   ```
   (La primera vez ejcuta `npm run android:add` para crear la carpeta `android/`).
3. Abre el proyecto en Android Studio:
   ```bash
   npm run android:open
   ```
4. Desde Android Studio puedes compilar, ejecutar en un emulador/dispositivo o generar APK/AAB. Si prefieres línea de comandos:
   ```bash
   npm run android:run
   ```

Cada vez que modifiques el frontend vuelve a ejecutar `npm run android:build` para copiar el nuevo contenido de `dist/` al proyecto nativo.

#### Bluetooth nativo

- Se usa `@capacitor-community/bluetooth-le` para descubrir y subscribirse a las características BLE del módulo Arduino.
- Tras instalar dependencias ejecuta `npm run android:build` o `npm run android:sync` para registrar el plugin en el proyecto nativo.
- En el diálogo "Conexión de dispositivo" aparecen campos para introducir el Service UUID y Characteristic UUID que expone tu módulo BLE (por defecto se proveen los valores típicos de módulos HM-10/HC-08).
- Durante la sesión nativa las lecturas se guardan automáticamente en Firebase (si está configurado).

### Firebase

La capa de datos usa Firebase (Firestore) cuando las credenciales están disponibles. Añade un archivo `.env` en la raíz con las variables:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# Opcional
VITE_FIREBASE_MEASUREMENT_ID=...
```

Los datos se almacenan en las colecciones:

- `sensorHeartRate`
- `sensorSteps`

Cada documento incluye el último `timestamp`, y los componentes de la app consultan esa información mediante React Query (`base44Client`).

### Next Steps

1. Instala dependencias y levanta el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
2. Reemplaza el cliente simulado (`src/api/base44Client.js`) con tus APIs/bridges reales (BLE, REST, sensores).
3. Añade pruebas automatizadas (unitarias e integración) a medida que crezca la lógica.
