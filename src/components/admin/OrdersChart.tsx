"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface ChartPoint {
  date: string;
  commandes: number;
  ca: number;
}

interface OrdersChartProps {
  data: ChartPoint[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-500 text-sm">
        Aucune donnée d'activité disponible pour cette période.
      </div>
    );
  }

  const maxCommandes = Math.max(...data.map((d) => d.commandes), 4);
  const chartHeight = 180;

  return (
    <div className="w-full">
      {/* Chart Bars */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-44 px-2">
          {data.map((item, index) => {
            const heightPercent =
              item.commandes > 0
                ? Math.max(12, (item.commandes / maxCommandes) * 100)
                : 4;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 z-30 pointer-events-none whitespace-nowrap bg-[#150F1B] text-[#F5F0FA] text-xs p-2.5 rounded-xl border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.3)] flex flex-col items-center gap-0.5">
                    <span className="font-semibold text-stone-400 text-[10px]">
                      {new Date(item.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="font-bold text-[#A78BFA]">
                      {item.commandes} commande{item.commandes > 1 ? "s" : ""}
                    </span>
                    {item.ca > 0 && (
                      <span className="text-amber-400 text-[11px] font-semibold">
                        {formatPrice(item.ca)}
                      </span>
                    )}
                  </div>
                )}

                {/* Bar Element */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[18px] rounded-t-md transition-all duration-200 cursor-pointer ${
                    item.commandes > 0
                      ? isHovered
                        ? "bg-gradient-to-t from-brand-magenta to-brand-purple shadow-[0_0_12px_rgba(124,58,237,0.6)]"
                        : "bg-gradient-to-t from-purple-800 to-brand-purple hover:bg-brand-purple"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis date labels */}
        <div className="flex justify-between px-2 pt-2 text-[10px] text-stone-400 border-t border-white/10 mt-1">
          <span>Il y a 30 jours</span>
          <span>Il y a 15 jours</span>
          <span>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
