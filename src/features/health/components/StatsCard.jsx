import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  color = "#38bdf8",
  trend,
  subtitle,
}) {
  const trendPositive = trend ? trend.includes("+") : false;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full border-outline/30 bg-surface/80 shadow-soft-xl">
        <CardContent className="flex h-full flex-col justify-between px-5 py-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                {title}
              </p>
              {Icon && (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-muted/60"
                  style={{ color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold text-text-primary">
                {value}
              </span>
              {unit && (
                <span className="mb-1 text-sm font-medium text-text-muted">
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {subtitle && (
              <p className="text-xs font-medium text-text-muted">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span
                  className={
                    trendPositive ? "text-success" : "text-danger"
                  }
                >
                  {trend}
                </span>
                <span className="text-xs font-medium text-text-muted">
                  vs. ayer
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
