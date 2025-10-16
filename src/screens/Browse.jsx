import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Usb, Book, Stethoscope, Settings } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dispositivos",
    description: "Conectar Arduino y otros sensores",
    icon: Usb,
    gradient: "bg-card-blue",
    href: createPageUrl("Settings"),
    available: true,
  },
  {
    title: "Biblioteca de Salud",
    description: "Articulos y consejos de salud",
    icon: Book,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    title: "Registros Medicos",
    description: "Historial medico y consultas",
    icon: Stethoscope,
    gradient: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
  {
    title: "Configuracion",
    description: "Ajustes generales de la aplicacion",
    icon: Settings,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
  },
];

export default function BrowsePage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Explorar
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Configuracion y recursos de salud
        </p>
      </header>

      <div className="grid gap-4">
        {menuItems.map((item) => {
          const content = (
            <Card
              key={item.title}
              className={`relative overflow-hidden border-outline/30 bg-surface text-text-primary transition-transform hover:-translate-y-1 hover:border-outline/60 ${
                item.available ? "" : "opacity-60"
              }`}
            >
              <CardContent className="relative flex items-center gap-4 px-5 py-5">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft-xl ${item.gradient}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {item.description}
                    {!item.available ? " (Proximamente)" : ""}
                  </p>
                </div>
                {!item.available && (
                  <Badge variant="secondary">Proximamente</Badge>
                )}
              </CardContent>
            </Card>
          );

          if (item.available && item.href) {
            return (
              <Link key={item.title} to={item.href} className="group">
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>
    </section>
  );
}
