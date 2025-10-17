import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Heart,
  Footprints,
  Settings,
  Activity,
} from "lucide-react";

const navItems = [
  { title: "Resumen", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Ritmo", url: createPageUrl("HeartRate"), icon: Heart },
  { title: "Pasos", url: createPageUrl("Steps"), icon: Footprints },
  { title: "Explorar", url: createPageUrl("Browse"), icon: Activity },
  { title: "Ajustes", url: createPageUrl("Settings"), icon: Settings },
];

export default function MainLayout({ children }) {
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem("theme", theme);
    window.dispatchEvent(
      new CustomEvent("appThemeUpdated", { detail: { theme } })
    );
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleThemeEvent = () => {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    window.addEventListener("appThemeUpdated", handleThemeEvent);
    return () => {
      window.removeEventListener("appThemeUpdated", handleThemeEvent);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-outline bg-surface">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card-heart text-white shadow-soft-xl">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-[120px]">
              <h1 className="text-lg font-semibold tracking-tight text-text-primary">
                Salud
              </h1>
              <p className="text-xs font-medium text-text-muted/80">
                Conexiones Arduino
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 md:px-6">
        <div className="space-y-6">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-outline bg-surface">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-3">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.url ||
              location.pathname.startsWith(`${item.url}/`);
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`group flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-soft-xl"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform group-hover:-translate-y-0.5 ${
                    isActive ? "text-white" : ""
                  }`}
                />
                <span className="tracking-tight">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
