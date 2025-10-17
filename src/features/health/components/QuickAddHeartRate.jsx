import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Plus, X } from "lucide-react";

const ACTIVITIES = [
  { value: "reposo", label: "En reposo" },
  { value: "ejercicio", label: "Ejercicio" },
  { value: "trabajo", label: "Trabajando" },
  { value: "sueno", label: "Durmiendo" },
  { value: "otro", label: "Otro" },
];

export default function QuickAddHeartRate({ onAdd, onCancel }) {
  const [bpm, setBpm] = useState("");
  const [activity, setActivity] = useState("reposo");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const parsedBpm = parseInt(bpm, 10);
    if (Number.isNaN(parsedBpm) || parsedBpm < 40 || parsedBpm > 220) {
      setErrorMessage("Ingresa un valor de BPM entre 40 y 220.");
      return;
    }
    setIsAdding(true);

    try {
      await onAdd({
        bpm: parsedBpm,
        timestamp: new Date().toISOString(),
        activity,
        notes: notes || undefined,
      });

      setBpm("");
      setNotes("");
    } catch (error) {
      console.error("Error guardando ritmo cardiaco", error);
      setErrorMessage(
        "No se pudo guardar la medicion. Revisa la conexion e intenta nuevamente."
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-outline/30 bg-surface/90 shadow-soft-xl">
      <CardHeader className="flex items-center justify-between border-none px-6 pb-0 pt-6">
        <CardTitle className="flex items-center gap-3 text-base font-semibold text-text-primary">
          <Heart className="h-5 w-5 text-primary" />
          Registrar ritmo cardiaco
        </CardTitle>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="rounded-2xl text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="bpm">Pulsaciones por minuto (BPM)</Label>
            <Input
              id="bpm"
              type="number"
              value={bpm}
              onChange={(event) => setBpm(event.target.value)}
              placeholder="Ej: 72"
              min="40"
              max="220"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="activity">Actividad</Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione actividad" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Agrega cualquier observacion..."
              className="h-24"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 bg-primary text-white hover:brightness-110"
            disabled={isAdding}
          >
            <Plus className="h-4 w-4" />
            {isAdding ? "Guardando..." : "Guardar medicion"}
          </Button>

          {errorMessage && (
            <p
              className="rounded-2xl bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
