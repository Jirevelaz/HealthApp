import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Footprints, Gauge } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StepsChart from "@/features/health/components/StepsChart";
import { Progress } from "@/components/ui/progress";
import { getDailyStepGoal, getMeasurementUnit } from "@/utils/preferences";

function StatCard({ title, value, unit, subtitle }) {
  return (
    <Card className="shadow-none">
      <CardContent className="relative overflow-hidden px-6 py-6 text-text-primary">
        <div className="pointer-events-none absolute -top-12 right-0 h-28 w-28 rounded-full bg-primary/30 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted/80">
          {title}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-semibold text-text-primary">
            {value}
          </span>
          {unit && (
            <span className="mb-2 text-sm font-medium text-text-muted/80">
              {unit}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-4 text-xs font-medium text-text-muted/80">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function StepsPage() {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = React.useState(getDailyStepGoal);
  const [distanceUnit, setDistanceUnit] = React.useState(getMeasurementUnit);

  const { data: steps = [] } = useQuery({
    queryKey: ["steps"],
    queryFn: () => base44.entities.Steps.list("-date"),
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const stepsToday = steps.find((s) => s.date === todayStr)?.count || 0;
  const totalSteps = steps.reduce((sum, s) => sum + s.count, 0);
  const avgSteps =
    steps.length > 0 ? Math.round(totalSteps / steps.length) : 0;
  const totalDistanceKm = steps.reduce(
    (sum, s) => sum + (s.distance || 0),
    0
  );
  const isImperial = distanceUnit === "imperial";
  const totalDistanceDisplay = isImperial
    ? (totalDistanceKm * 0.621371).toFixed(1)
    : totalDistanceKm.toFixed(1);
  const distanceSuffix = isImperial ? "mi" : "km";
  const progressPercent =
    dailyGoal > 0
      ? Math.min(100, Math.round((stepsToday / dailyGoal) * 100))
      : 0;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePreferences = (event) => {
      const nextGoal =
        event?.detail?.dailyStepGoal !== undefined
          ? event.detail.dailyStepGoal
          : getDailyStepGoal();
      setDailyGoal(nextGoal);
      const nextUnit =
        event?.detail?.measurementUnit || getMeasurementUnit();
      setDistanceUnit(nextUnit);
    };
    window.addEventListener("appPreferencesUpdated", handlePreferences);
    return () => {
      window.removeEventListener("appPreferencesUpdated", handlePreferences);
    };
  }, []);

  const formatDistance = React.useCallback(
    (value) => {
      if (value === undefined || value === null) {
        return "Sin distancia";
      }
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        return "Sin distancia";
      }
      const converted = isImperial ? numeric * 0.621371 : numeric;
      return `${converted.toFixed(1)} ${distanceSuffix}`;
    },
    [distanceSuffix, isImperial]
  );

  return (
    <section className="space-y-6">
      <header className="glass-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="glass-button text-text-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Pasos</h2>
            <p className="text-sm font-medium text-text-muted">
              Actividad diaria
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Hoy" value={stepsToday.toLocaleString()} unit="pasos" />
        <StatCard
          title="Promedio"
          value={avgSteps.toLocaleString()}
          unit="/dia"
        />
        <StatCard
          title="Total"
          value={(totalSteps / 1000).toFixed(0)}
          unit="K pasos"
          subtitle={`${steps.length} dias registrados`}
        />
        <StatCard
          title="Distancia"
          value={totalDistanceDisplay}
          unit={distanceSuffix}
        />
      </div>

      <Card className="overflow-hidden border-0 bg-card-steps text-white">
        <CardContent className="relative px-6 py-6">
          <div className="absolute inset-0 bg-white/20 dark:bg-black/40" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Footprints className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-text-primary dark:text-white/80">
                  Progreso de hoy
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {stepsToday.toLocaleString()}
                  </span>
                  <span className="mb-1 text-lg font-medium text-text-muted dark:text-white/80">
                    pasos
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-72">
              <div className="flex items-center justify-between text-sm font-medium text-text-secondary dark:text-white/80">
                <span>Meta: {dailyGoal.toLocaleString()}</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress
                value={progressPercent}
                className="h-3 bg-surface-muted dark:bg-white/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <Gauge className="h-5 w-5 text-primary" />
            Pasos de la semana
          </CardTitle>
          <p className="text-sm font-medium text-text-muted">
            Evolucion de tus pasos recientes
          </p>
        </CardHeader>
        <CardContent className="px-2 pb-6 pt-6">
          <StepsChart data={steps} />
        </CardContent>
      </Card>

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="border-none px-6 pt-6 pb-0">
          <CardTitle className="text-base font-semibold text-text-primary">
            Dias recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <div className="space-y-3">
            {steps.slice(0, 7).map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between rounded-2xl border border-outline/30 bg-surface-muted/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {step.count.toLocaleString()} pasos
                  </p>
                  <p className="text-xs font-medium text-text-muted">
                    {formatDistance(step.distance)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold capitalize text-text-primary">
                    {format(new Date(step.date), "EEEE", { locale: es })}
                  </p>
                  <p className="text-xs font-medium text-text-muted">
                    {format(new Date(step.date), "d MMM", { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
