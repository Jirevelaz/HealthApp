import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Heart, Footprints, Activity, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createPageUrl } from "@/utils";

import HealthCard from "@/features/health/components/HealthCard";
import {
  MiniHeartRateChart,
  MiniStepsChart,
} from "@/features/health/components/MiniChart";

export default function Dashboard() {
  const { data: heartRates = [] } = useQuery({
    queryKey: ["heartRates"],
    queryFn: () => base44.entities.HeartRate.list("-timestamp"),
  });

  const { data: steps = [] } = useQuery({
    queryKey: ["steps"],
    queryFn: () => base44.entities.Steps.list("-date"),
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const stepsToday = steps.find((s) => s.date === today)?.count || 0;
  const latestHR = heartRates[0]?.bpm || 0;
  const avgHR =
    heartRates.length > 0
      ? Math.round(
          heartRates.reduce((sum, hr) => sum + hr.bpm, 0) / heartRates.length
        )
      : 0;

  const getHeartRateStatus = (bpm) => {
    if (bpm === 0) return { text: "Sin datos", color: "text-white/80" };
    if (bpm < 60) return { text: "Bajo", color: "text-white" };
    if (bpm <= 100) return { text: "Normal", color: "text-white" };
    return { text: "Alto", color: "text-white" };
  };

  const getStepsStatus = (stepsCount) => {
    if (stepsCount >= 10000) return { text: "Meta alcanzada", color: "text-white" };
    if (stepsCount >= 5000) return { text: "Buen progreso", color: "text-white" };
    return { text: "Sigue adelante", color: "text-white/80" };
  };

  const hrStatus = getHeartRateStatus(latestHR);
  const stepsStatus = getStepsStatus(stepsToday);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Resumen
        </h2>
        <p className="text-sm font-medium text-text-muted">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </header>

      <div className="space-y-5">
        <HealthCard
          title="Frecuencia Cardiaca"
          value={latestHR || "--"}
          unit="BPM"
          subtitle={
            latestHR
              ? format(new Date(heartRates[0]?.timestamp), "HH:mm")
              : "Sin datos"
          }
          gradient="bg-card-heart"
          icon={Heart}
          status={hrStatus.text}
          statusColor={hrStatus.color}
          chart={
            heartRates.length > 0 ? (
              <MiniHeartRateChart data={heartRates} />
            ) : null
          }
          href={createPageUrl("HeartRate")}
        />

        <HealthCard
          title="Pasos"
          value={stepsToday.toLocaleString()}
          unit="pasos"
          subtitle="Hoy"
          gradient="bg-card-steps"
          icon={Footprints}
          status={stepsStatus.text}
          statusColor={stepsStatus.color}
          chart={steps.length > 0 ? <MiniStepsChart data={steps} /> : null}
          href={createPageUrl("Steps")}
        />

        <HealthCard
          title="Promedio Cardiaco"
          value={avgHR || "--"}
          unit="BPM"
          subtitle="Ultimos 30 dias"
          gradient="bg-card-purple"
          icon={Activity}
          status={avgHR > 0 ? "Datos disponibles" : "Sin datos"}
          statusColor="text-white/80"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <HealthCard
            title="Distancia"
            value={steps
              .reduce((sum, s) => sum + (s.distance || 0), 0)
              .toFixed(1)}
            unit="km"
            subtitle="Total"
            gradient="bg-card-blue"
            icon={TrendingUp}
            status="Acumulado"
            statusColor="text-white/80"
          />

        </div>
      </div>
    </section>
  );
}
