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
    .slice(0, 12)
    .reverse()
    .map((record) => ({
      time: format(new Date(record.timestamp), "HH:mm", { locale: es }),
      bpm: record.bpm,
      activity: record.activity,
    }));
}

const tooltipStyles = {
  backgroundColor: "rgba(30, 22, 50, 0.9)",
  color: "#f3e8ff",
  borderRadius: "12px",
  border: "1px solid rgba(192, 132, 252, 0.4)",
  padding: "10px 14px",
  fontSize: "0.8rem",
};

export default function HeartRateChart({ data }) {
  const chartData = buildChartData(data);

  return (
    <div className="h-72 w-full rounded-3xl bg-background-muted/40 px-4 py-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, left: 0, right: 0 }}>
          <defs>
            <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            stroke="rgba(148, 163, 184, 0.25)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="rgba(148, 163, 184, 0.7)"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="rgba(148, 163, 184, 0.7)"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "12px" }}
            domain={[
              (dataMin) => Math.floor(Math.max(40, dataMin - 10)),
              (dataMax) => Math.ceil(Math.min(200, dataMax + 10)),
            ]}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(168,85,247,0.3)" }}
            contentStyle={tooltipStyles}
            labelFormatter={(label) => `Hora ${label}`}
            formatter={(value, _name, payload) => [
              `${value} BPM`,
              payload?.payload?.activity ?? "",
            ]}
          />
          <Area
            type="monotone"
            dataKey="bpm"
            stroke="#a855f7"
            strokeWidth={3}
            fill="url(#hrGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
