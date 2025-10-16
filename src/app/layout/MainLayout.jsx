import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Heart,
  Footprints,
  Settings,
  Sun,
  Moon,
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
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-outline/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card-heart text-white shadow-soft-xl">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Salud</h1>
              <p className="text-xs font-medium text-text-muted/80">
                Conexiones Arduino
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="rounded-xl border border-outline/40 bg-surface/40 text-text-secondary hover:border-outline hover:bg-surface"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 md:px-6">
        <div className="space-y-6">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-outline/60 bg-background/95 backdrop-blur-2xl">
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
