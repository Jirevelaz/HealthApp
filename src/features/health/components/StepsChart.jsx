import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function buildChartData(data) {
  return data
    .slice(0, 7)
    .reverse()
    .map((record) => ({
      day: format(new Date(record.date), "EEE", { locale: es }),
      steps: record.count,
    }));
}

const tooltipStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  color: "#e2e8f0",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  padding: "10px 14px",
  fontSize: "0.8rem",
};

export default function StepsChart({ data }) {
  const chartData = buildChartData(data);

  return (
    <div className="h-64 w-full rounded-3xl bg-background-muted/40 px-4 py-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, left: 0, right: 0 }}>
          <defs>
            <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            stroke="rgba(148, 163, 184, 0.25)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke="rgba(148, 163, 184, 0.7)"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "12px", textTransform: "capitalize" }}
          />
          <YAxis
            stroke="rgba(148, 163, 184, 0.7)"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(148,163,184,0.3)" }}
            contentStyle={tooltipStyles}
            labelFormatter={(label) => label.toUpperCase()}
            formatter={(value) => [`${value.toLocaleString()} pasos`, ""]}
          />
          <Area
            type="monotone"
            dataKey="steps"
            stroke="#34d399"
            strokeWidth={3}
            fill="url(#stepsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
