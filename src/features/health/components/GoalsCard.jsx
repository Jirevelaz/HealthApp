import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Award } from "lucide-react";

export default function GoalsCard({ stepsToday, heartRateAvg }) {
  const DAILY_STEPS_GOAL = 10000;
  const RESTING_HR_GOAL = 70;

  const stepsProgress = Math.min((stepsToday / DAILY_STEPS_GOAL) * 100, 100);
  const stepsAchieved = stepsToday >= DAILY_STEPS_GOAL;
  const hrHealthy = heartRateAvg > 0 && heartRateAvg <= RESTING_HR_GOAL;

  return (
    <Card className="border-outline/30 bg-surface/80 shadow-soft-xl">
      <CardHeader className="flex flex-col gap-2 border-none px-6 pt-6 pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
          <Target className="h-5 w-5 text-primary" />
          Metas diarias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-4 text-text-secondary">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">
              Pasos
            </span>
            <span className="text-sm font-semibold text-primary">
              {stepsToday.toLocaleString()} /{" "}
              {DAILY_STEPS_GOAL.toLocaleString()}
            </span>
          </div>
          <Progress value={stepsProgress} className="h-3" />
          {stepsAchieved && (
            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-success">
              <Award className="h-4 w-4" />
              Meta alcanzada!
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">
              Ritmo cardiaco promedio
            </span>
            <span
              className={`text-sm font-semibold ${
                hrHealthy ? "text-success" : "text-warning"
              }`}
            >
              {heartRateAvg > 0 ? `${heartRateAvg} BPM` : "No hay datos"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <div
              className={`h-2 w-2 rounded-full ${
                hrHealthy ? "bg-success" : "bg-warning"
              }`}
            />
            <span>
              {hrHealthy
                ? "Excelente ritmo en reposo"
                : heartRateAvg > 0
                ? "Considera relajarte mas"
                : "Registra tu ritmo cardiaco"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
