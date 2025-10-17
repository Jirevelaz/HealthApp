import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Usb, Settings, Heart, Footprints } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import {
  getDailyStepGoal,
  getMeasurementUnit,
} from "@/utils/preferences";

const menuItems = [
  {
    title: "Dispositivos",
    description: "Conectar Arduino y otros sensores",
    icon: Usb,
    gradient: "bg-card-blue",
    href: `${createPageUrl("Settings")}#devices`,
    available: true,
  },
  {
    title: "Configuracion",
    description: "Ajustes generales de la aplicacion",
    icon: Settings,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
    href: `${createPageUrl("Settings")}#preferences`,
    available: true,
  },
];

export default function BrowsePage() {
  const [dailyGoal, setDailyGoal] = React.useState(getDailyStepGoal);
  const [distanceUnit, setDistanceUnit] = React.useState(
    getMeasurementUnit
  );

  const { data: heartRates = [] } = useQuery({
    queryKey: ["heartRates"],
    queryFn: () => base44.entities.HeartRate.list("-timestamp"),
  });

  const { data: steps = [] } = useQuery({
    queryKey: ["steps"],
    queryFn: () => base44.entities.Steps.list("-date"),
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const stepsToday = steps.find((s) => s.date === todayStr)?.count || 0;
  const totalSteps = steps.reduce((sum, entry) => sum + entry.count, 0);
  const avgSteps = steps.length > 0 ? Math.round(totalSteps / steps.length) : 0;
  const totalDistanceKm = steps.reduce(
    (sum, entry) => sum + (entry.distance || 0),
    0
  );
  const convertedDistance =
    distanceUnit === "imperial"
      ? totalDistanceKm * 0.621371
      : totalDistanceKm;
  const distanceSuffix = distanceUnit === "imperial" ? "mi" : "km";
  const distanceDisplay = Number.isFinite(convertedDistance)
    ? convertedDistance.toFixed(1)
    : "0.0";
  const latestHeartRate = heartRates[0]?.bpm || 0;
  const avgHeartRate =
    heartRates.length > 0
      ? Math.round(
          heartRates.reduce((sum, entry) => sum + entry.bpm, 0) /
            heartRates.length
        )
      : 0;

  const heartRateStatus =
    latestHeartRate === 0
      ? "Sin datos recientes"
      : latestHeartRate < 60
      ? "Por debajo de tu ritmo habitual"
      : latestHeartRate <= 100
      ? "En rango saludable"
      : "Por encima de lo recomendado";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePreferences = (event) => {
      const detail = event?.detail;
      setDailyGoal(
        detail?.dailyStepGoal !== undefined
          ? detail.dailyStepGoal
          : getDailyStepGoal()
      );
      setDistanceUnit(
        detail?.measurementUnit || getMeasurementUnit()
      );
    };
    window.addEventListener("appPreferencesUpdated", handlePreferences);
    return () => {
      window.removeEventListener("appPreferencesUpdated", handlePreferences);
    };
  }, []);

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
          <CardContent className="flex h-full flex-col gap-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card-heart text-white">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  Ritmo cardiaco
                </p>
                <h3 className="text-lg font-semibold text-text-primary">
                  Promedio general
                </h3>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-text-primary">
                {avgHeartRate || "--"}
              </span>
              <span className="mb-2 text-sm font-medium text-text-muted">
                BPM
              </span>
            </div>
            <div className="rounded-2xl bg-surface-muted/50 px-4 py-3">
              <p className="text-sm font-medium text-text-primary">
                Ultima lectura:{" "}
                <span className="font-semibold">
                  {latestHeartRate ? `${latestHeartRate} BPM` : "Sin datos"}
                </span>
              </p>
              <p className="text-xs font-medium text-text-muted">
                {heartRateStatus}
              </p>
            </div>
            <Button
              asChild
              variant="soft"
              className="w-full justify-center rounded-2xl text-primary"
            >
              <Link to={createPageUrl("HeartRate")}>Ver detalles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
          <CardContent className="flex h-full flex-col gap-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card-steps text-white">
                <Footprints className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  Pasos diarios
                </p>
                <h3 className="text-lg font-semibold text-text-primary">
                  Resumen acumulado
                </h3>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-muted">
                  Hoy
                </span>
                <span className="text-lg font-semibold text-text-primary">
                  {stepsToday.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-text-muted">
                <span>Promedio</span>
                <span>{avgSteps.toLocaleString()} / dia</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-text-muted">
                <span>Distancia total</span>
                <span>
                  {distanceDisplay} {distanceSuffix}
                </span>
              </div>
              <div>
                <Progress
                  value={
                    dailyGoal > 0
                      ? Math.min(100, (stepsToday / dailyGoal) * 100)
                      : 0
                  }
                />
                <p className="mt-2 text-xs font-medium text-text-muted">
                  Meta de {dailyGoal.toLocaleString()} pasos diarios
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="soft"
              className="w-full justify-center rounded-2xl text-primary"
            >
              <Link to={createPageUrl("Steps")}>Gestionar actividad</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => {
          const content = (
            <Card
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
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
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
