import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, UserPlus, Settings } from "lucide-react";

export default function SharingPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Compartir
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Comparte tus datos de salud con familiares y medicos
        </p>
      </header>

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="border-none px-6 pt-6 pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <Share2 className="h-5 w-5 text-primary" />
            Compartiendo con
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <div className="rounded-3xl border border-outline/30 bg-background-muted/40 px-6 py-8 text-center text-text-muted">
            <UserPlus className="mx-auto mb-5 h-12 w-12 text-text-muted/70" />
            <p className="text-sm font-semibold text-text-secondary">
              No estas compartiendo datos con nadie
            </p>
            <p className="mt-2 text-xs font-medium text-text-muted">
              Invita a familiares o medicos para compartir tus datos de salud.
            </p>
          </div>
          <Button className="mt-5 w-full gap-2" disabled>
            <UserPlus className="h-4 w-4" />
            Invitar contacto (Proximamente)
          </Button>
        </CardContent>
      </Card>

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="border-none px-6 pt-6 pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <Settings className="h-5 w-5 text-text-muted" />
            Configuracion de privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <p className="text-sm font-medium text-text-muted">
            Controla que datos de salud se comparten y con quien. Tu privacidad
            es importante para nosotros.
          </p>
          <Button variant="outline" className="mt-5 w-full" disabled>
            Configurar privacidad (Proximamente)
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
