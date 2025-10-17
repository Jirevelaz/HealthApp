import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HealthCard({
  title,
  value,
  unit,
  subtitle,
  gradient,
  icon: Icon,
  chart,
  status,
  statusColor = "text-white/80",
  href,
}) {
  const CardWrapper = href ? Link : "div";
  const cardProps = href
    ? { to: href, className: "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:rounded-3xl" }
    : { className: "group block" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: href ? 1.01 : 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <CardWrapper {...cardProps}>
        <Card
          className={`relative overflow-hidden border-0 bg-transparent p-0 text-white shadow-soft-xl`}
        >
          <div
            className={`relative overflow-hidden rounded-3xl ${gradient} px-6 pb-6 pt-5`}
          >
            <div className="absolute inset-0 rounded-3xl bg-black/10 mix-blend-soft-light" />
            <div className="relative z-10">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-sm font-medium text-white/75">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                {href && (
                  <ChevronRight className="h-5 w-5 text-white/85 transition-all group-hover:translate-x-1" />
                )}
              </div>

              <div className="mb-5 flex items-end gap-2">
                <span className="text-4xl font-bold leading-none">
                  {value}
                </span>
                {unit && (
                  <span className="mb-1 text-lg font-medium text-white/85">
                    {unit}
                  </span>
                )}
              </div>

              {status && (
                <p className={`mb-4 text-sm font-semibold ${statusColor}`}>
                  {status}
                </p>
              )}

              {chart && <div className="h-16 -mx-2">{chart}</div>}
            </div>
          </div>
        </Card>
      </CardWrapper>
    </motion.div>
  );
}
