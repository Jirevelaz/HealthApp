import React, { useState, useEffect, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Usb,
  Info,
  Palette,
  BellRing,
  Target,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ArduinoConnector from "@/features/health/components/ArduinoConnector";
import { format } from "date-fns";
import { loadPreferences, savePreferences } from "@/utils/preferences";

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-outline/60"
      }`}
    >
      <span
        className={`absolute left-1 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function PreferenceToggle({ label, description, value, onChange, id }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-outline/30 bg-surface px-4 py-4">
      <div className="space-y-1">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs font-medium text-text-muted">{description}</p>
        )}
      </div>
      <ToggleSwitch id={id} checked={value} onChange={onChange} />
    </div>
  );
}

function OptionButton({ isActive, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "border-primary bg-primary-soft text-primary"
          : "border-outline/40 bg-surface text-text-muted hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(preferences.theme);
    window.localStorage.setItem("theme", preferences.theme);
    window.dispatchEvent(
      new CustomEvent("appThemeUpdated", {
        detail: { theme: preferences.theme },
      })
    );
  }, [preferences.theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const updatePreference = useCallback((path, value) => {
    setPreferences((prev) => {
      const next = { ...prev };
      let cursor = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        cursor[key] = { ...cursor[key] };
        cursor = cursor[key];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleThemeUpdate = (event) => {
      const nextTheme =
        event?.detail?.theme || window.localStorage.getItem("theme");
      if (!nextTheme) return;
      setPreferences((prev) =>
        prev.theme === nextTheme ? prev : { ...prev, theme: nextTheme }
      );
    };
    window.addEventListener("appThemeUpdated", handleThemeUpdate);
    return () => {
      window.removeEventListener("appThemeUpdated", handleThemeUpdate);
    };
  }, []);

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
      <header className="glass-panel flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Browse"))}
            className="glass-button text-text-secondary"
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
        </div>
      </header>

      <Card id="devices" className="shadow-none overflow-hidden">
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
          <div className="glass-card flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
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

      <div id="preferences" className="space-y-4">
        <Card className="shadow-none">
          <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  Apariencia
                </CardTitle>
                <CardDescription className="text-sm font-medium text-text-muted">
                  Elige el tema de la aplicacion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-5">
            <div className="space-y-4">
              <p className="text-sm font-medium text-text-muted">
                Cambia entre tema claro y oscuro segun tu preferencia. El
                ajuste se aplica de inmediato a toda la interfaz.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <OptionButton
                  isActive={preferences.theme === "light"}
                  onClick={() => updatePreference(["theme"], "light")}
                >
                  Tema claro
                </OptionButton>
                <OptionButton
                  isActive={preferences.theme === "dark"}
                  onClick={() => updatePreference(["theme"], "dark")}
                >
                  Tema oscuro
                </OptionButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  Notificaciones
                </CardTitle>
                <CardDescription className="text-sm font-medium text-text-muted">
                  Recibe alertas y recordatorios relevantes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-5">
            <PreferenceToggle
              id="pref-heart-alerts"
              label="Alertas de ritmo elevado"
              description="Avisame cuando una medicion supere mi umbral configurado."
              value={preferences.notifications.heartRateAlerts}
              onChange={(next) =>
                updatePreference(["notifications", "heartRateAlerts"], next)
              }
            />
            <PreferenceToggle
              id="pref-steps-reminder"
              label="Recordatorios de meta diaria"
              description="Recibe notificaciones si estas lejos de cumplir tu meta de pasos."
              value={preferences.notifications.stepGoalReminders}
              onChange={(next) =>
                updatePreference(["notifications", "stepGoalReminders"], next)
              }
            />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  Metas y unidades
                </CardTitle>
                <CardDescription className="text-sm font-medium text-text-muted">
                  Ajusta tus objetivos diarios y unidades preferidas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 px-6 pb-6 pt-5 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="daily-step-goal">
                Meta diaria de pasos
              </Label>
              <Input
                id="daily-step-goal"
                type="number"
                min={1000}
                step={500}
                value={preferences.dailyStepGoal}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updatePreference(
                    ["dailyStepGoal"],
                    Number.isNaN(value) ? 10000 : Math.max(1000, value)
                  );
                }}
              />
              <p className="text-xs font-medium text-text-muted">
                Se utiliza para calcular tu progreso diario de actividad.
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="distance-unit">Unidad de distancia</Label>
              <Select
                value={preferences.measurementUnit}
                onValueChange={(value) =>
                  updatePreference(["measurementUnit"], value)
                }
              >
                <SelectTrigger id="distance-unit">
                  <SelectValue placeholder="Selecciona unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Kilometros (km)</SelectItem>
                  <SelectItem value="imperial">Millas (mi)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs font-medium text-text-muted">
                Determina como se muestra la distancia en tus reportes.
              </p>
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="hr-threshold">
                Umbral de alerta de ritmo cardiaco (BPM)
              </Label>
              <Input
                id="hr-threshold"
                type="number"
                min={60}
                max={200}
                value={preferences.heartRate.alertThreshold}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updatePreference(
                    ["heartRate", "alertThreshold"],
                    Number.isNaN(value) ? 120 : Math.min(Math.max(60, value), 200)
                  );
                }}
              />
              <p className="text-xs font-medium text-text-muted">
                Las alertas se activan cuando superes este valor en tus
                mediciones.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-info text-background">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  Sincronizacion de datos
                </CardTitle>
                <CardDescription className="text-sm font-medium text-text-muted">
                  Controla la actualizacion automatica desde tus dispositivos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-5">
            <PreferenceToggle
              id="pref-auto-sync"
              label="Sincronizacion automatica"
              description="Conecta y recibe datos automaticamente cuando se detecte un dispositivo compatible."
              value={preferences.dataSync.autoSync}
              onChange={(next) =>
                updatePreference(["dataSync", "autoSync"], next)
              }
            />
            <div className="rounded-2xl border border-outline/30 bg-surface px-4 py-4">
              <Label htmlFor="sync-frequency">
                Frecuencia de recordatorio (minutos)
              </Label>
              <Select
                value={String(preferences.dataSync.syncFrequencyMinutes)}
                onValueChange={(value) =>
                  updatePreference(
                    ["dataSync", "syncFrequencyMinutes"],
                    Number(value)
                  )
                }
                disabled={!preferences.dataSync.autoSync}
              >
                <SelectTrigger id="sync-frequency" className="mt-2">
                  <SelectValue placeholder="Selecciona intervalo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Cada 5 minutos</SelectItem>
                  <SelectItem value="15">Cada 15 minutos</SelectItem>
                  <SelectItem value="30">Cada 30 minutos</SelectItem>
                  <SelectItem value="60">Cada hora</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs font-medium text-text-muted">
                Te avisaremos si no se reciben datos durante este periodo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
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
