import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Activity, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeartRateChart from "@/features/health/components/HeartRateChart";
import QuickAddHeartRate from "@/features/health/components/QuickAddHeartRate";

function StatCard({ title, value, unit, subtitle }) {
  return (
    <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
      <CardContent className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-semibold text-text-primary">
            {value}
          </span>
          {unit && (
            <span className="mb-1 text-sm font-medium text-text-muted">
              {unit}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-2 text-xs font-medium text-text-muted">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function HeartRatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = React.useState(false);

  const { data: heartRates = [] } = useQuery({
    queryKey: ["heartRates"],
    queryFn: () => base44.entities.HeartRate.list("-timestamp"),
  });

  const createHeartRateMutation = useMutation({
    mutationFn: (data) => base44.entities.HeartRate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartRates"] });
      setShowAddForm(false);
    },
  });

  const latestHR = heartRates[0]?.bpm || 0;
  const avgHR =
    heartRates.length > 0
      ? Math.round(
          heartRates.reduce((sum, hr) => sum + hr.bpm, 0) / heartRates.length
        )
      : 0;
  const minHR =
    heartRates.length > 0 ? Math.min(...heartRates.map((hr) => hr.bpm)) : 0;
  const maxHR =
    heartRates.length > 0 ? Math.max(...heartRates.map((hr) => hr.bpm)) : 0;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between rounded-3xl border border-outline/40 bg-surface/80 px-5 py-4 shadow-soft-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-2xl border border-outline/40 bg-surface/40 text-text-secondary hover:bg-surface"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Frecuencia Cardiaca
            </h2>
            <p className="text-sm font-medium text-text-muted">BPM</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="soft"
          className="rounded-2xl text-primary"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Ultima" value={latestHR || "--"} unit="BPM" />
        <StatCard title="Promedio" value={avgHR || "--"} unit="BPM" />
        <StatCard title="Minimo" value={minHR || "--"} unit="BPM" />
        <StatCard title="Maximo" value={maxHR || "--"} unit="BPM" />
      </div>

      <Card className="overflow-hidden border-0 bg-card-heart text-white">
        <CardContent className="relative px-6 py-6">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  Estado actual
                </p>
                <p className="text-xs font-medium text-white/70">
                  {latestHR
                    ? `Ultima medicion: ${format(
                        new Date(heartRates[0]?.timestamp),
                        "HH:mm"
                      )}`
                    : "Sin datos recientes"}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{latestHR || "--"}</span>
              <span className="mb-1 text-lg font-medium text-white/70">
                BPM
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <Activity className="h-5 w-5 text-primary" />
            Tendencia de ritmo cardiaco
          </CardTitle>
          <p className="text-sm font-medium text-text-muted">
            Evolucion reciente de tus mediciones
          </p>
        </CardHeader>
        <CardContent className="px-2 pb-6 pt-6">
          <HeartRateChart data={heartRates} />
        </CardContent>
      </Card>

      {showAddForm && (
        <QuickAddHeartRate
          onAdd={(data) => createHeartRateMutation.mutate(data)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardHeader className="border-none px-6 pt-6 pb-0">
          <CardTitle className="text-base font-semibold text-text-primary">
            Lecturas recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <div className="space-y-3">
            {heartRates.slice(0, 6).map((hr) => (
              <div
                key={hr.id}
                className="flex items-center justify-between rounded-2xl border border-outline/30 bg-surface-muted/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {hr.bpm} BPM
                  </p>
                  <p className="text-xs font-medium capitalize text-text-muted">
                    {hr.activity || "Sin actividad"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">
                    {format(new Date(hr.timestamp), "HH:mm")}
                  </p>
                  <p className="text-xs font-medium text-text-muted">
                    {format(new Date(hr.timestamp), "d MMM", { locale: es })}
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
