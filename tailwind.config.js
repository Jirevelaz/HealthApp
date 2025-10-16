/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        "background-muted": "var(--color-bg-muted)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        outline: "var(--color-outline)",
        primary: "var(--color-primary)",
        "primary-soft": "var(--color-primary-soft)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
        danger: "var(--color-danger)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      boxShadow: {
        "soft-xl":
          "0 18px 30px -22px rgba(14, 22, 43, 0.6), 0 6px 18px -12px rgba(14, 22, 43, 0.35)",
      },
      backgroundImage: {
        "card-heart":
          "linear-gradient(140deg, rgba(255,80,130,1) 0%, rgba(255,120,180,1) 100%)",
        "card-steps":
          "linear-gradient(140deg, rgba(34,197,94,1) 0%, rgba(16,185,129,1) 100%)",
        "card-info":
          "linear-gradient(140deg, rgba(99,102,241,1) 0%, rgba(56,189,248,1) 100%)",
        "card-purple":
          "linear-gradient(140deg, rgba(168,85,247,1) 0%, rgba(99,102,241,1) 100%)",
        "card-blue":
          "linear-gradient(140deg, rgba(59,130,246,1) 0%, rgba(56,189,248,1) 100%)",
      },
    },
  },
  plugins: [],
};
