import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, Usb, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ArduinoConnector from "@/features/health/components/ArduinoConnector";
import { format } from "date-fns";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: steps = [] } = useQuery({
    queryKey: ["steps"],
    queryFn: () => base44.entities.Steps.list("-date"),
    enabled: isConnectorOpen,
  });

  const createHeartRateMutation = useMutation({
    mutationFn: (data) => base44.entities.HeartRate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartRates"] });
    },
  });

  const upsertSteps = useMutation({
    mutationFn: async (count) => {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const todayRecord = steps.find((entry) => entry.date === todayStr);

      if (todayRecord) {
        return base44.entities.Steps.update(todayRecord.id, {
          count: todayRecord.count + count,
        });
      }

      return base44.entities.Steps.create({
        count,
        date: todayStr,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["steps"] });
    },
  });

  const handleArduinoData = async (data) => {
    if (data.type === "heartRate") {
      createHeartRateMutation.mutate({
        bpm: data.value,
        timestamp: new Date().toISOString(),
        activity: "reposo",
        notes: "Desde Arduino",
      });
    } else if (data.type === "steps") {
      upsertSteps.mutate(data.value);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3 rounded-3xl border border-outline/40 bg-surface/80 px-5 py-4 shadow-soft-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("Browse"))}
          className="rounded-2xl border border-outline/40 bg-surface/40 text-text-secondary hover:bg-surface"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Conexiones Arduino
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Gestiona tus dispositivos y fuentes de datos
          </p>
        </div>
      </header>

      <Card className="overflow-hidden border-outline/40 bg-surface/80 shadow-soft-xl">
        <CardHeader className="border-none px-6 pt-6 pb-0">
          <CardTitle className="text-base font-semibold text-text-primary">
            Conexion de dispositivo
          </CardTitle>
          <CardDescription className="text-sm font-medium text-text-muted">
            Conecta y gestiona tu dispositivo Arduino para la sincronizacion en
            tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-5">
          <div className="flex flex-col gap-4 rounded-3xl border border-outline/30 bg-background-muted/40 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card-blue text-white shadow-soft-xl">
                <Usb className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Arduino / Puerto serie
                </p>
                <p className="text-xs font-medium text-text-muted">
                  Recomendado para datos en vivo.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsConnectorOpen(true)}
              className="gap-2 self-start md:self-auto"
            >
              Conectar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-outline/40 bg-background-muted/30 shadow-soft-xl">
        <CardContent className="flex gap-4 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Info className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-text-primary">
              Como funciona la conexion?
            </h3>
            <p className="text-sm font-medium text-text-muted">
              Para recibir datos, tu Arduino debe enviar informacion en formato
              JSON a traves del puerto serie:
            </p>
            <div className="rounded-2xl bg-surface px-4 py-3 text-xs font-mono text-text-secondary shadow-soft-xl">
              <div>// Para ritmo cardiaco</div>
              <div>{'{"type":"heartRate","value":75}'}</div>
              <div className="mt-3">// Para pasos</div>
              <div>{'{"type":"steps","value":1}'}</div>
            </div>
            <p className="text-xs font-medium text-text-muted/80">
              Envia "value":1 por cada paso detectado. La app acumulara
              automaticamente tus pasos del dia.
            </p>
          </div>
        </CardContent>
      </Card>

      <ArduinoConnector
        isOpen={isConnectorOpen}
        onOpenChange={setIsConnectorOpen}
        onDataReceived={handleArduinoData}
      />
    </section>
  );
}
