import React from 'react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export function MiniHeartRateChart({ data }) {
  const chartData = data.slice(-10).map(record => ({
    value: record.bpm
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#ffffff" 
          strokeWidth={2}
          fill="url(#heartRateGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MiniStepsChart({ data }) {
  const chartData = data.slice(-7).map(record => ({
    value: record.count
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <Bar 
          dataKey="value" 
          fill="#ffffff"
          opacity={0.7}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}