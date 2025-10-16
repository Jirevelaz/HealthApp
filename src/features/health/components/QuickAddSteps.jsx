import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footprints, Plus, X } from "lucide-react";
import { format } from "date-fns";

export default function QuickAddSteps({ onAdd, onCancel }) {
  const [count, setCount] = useState("");
  const [distance, setDistance] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsAdding(true);

    await onAdd({
      count: parseInt(count, 10),
      date,
      distance: distance ? parseFloat(distance) : undefined,
      calories: calories ? parseFloat(calories) : undefined,
    });

    setCount("");
    setDistance("");
    setCalories("");
    setIsAdding(false);
  };

  return (
    <Card className="border-outline/30 bg-surface/90 shadow-soft-xl">
      <CardHeader className="flex items-center justify-between border-none px-6 pb-0 pt-6">
        <CardTitle className="flex items-center gap-3 text-base font-semibold text-text-primary">
          <Footprints className="h-5 w-5 text-primary" />
          Registrar pasos manualmente
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
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="count">Numero de pasos</Label>
            <Input
              id="count"
              type="number"
              value={count}
              onChange={(event) => setCount(event.target.value)}
              placeholder="Ej: 8500"
              min="0"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="distance">Distancia (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
                placeholder="Ej: 6.5"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="calories">Calorias</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(event) => setCalories(event.target.value)}
                placeholder="Ej: 350"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 bg-primary text-white hover:brightness-110"
            disabled={isAdding}
          >
            <Plus className="h-4 w-4" />
            {isAdding ? "Guardando..." : "Guardar registro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
