import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: "purple" | "magenta" | "gold" | "emerald" | "sky" | "rose";
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = "purple",
  trend,
}: StatCardProps) {
  const colorMap = {
    purple: {
      iconBg: "bg-brand-purple/20 text-[#A78BFA]",
      glow: "hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]",
      border: "border-purple-500/20 hover:border-purple-500/40",
      accentText: "text-[#C4B5FD]",
    },
    magenta: {
      iconBg: "bg-brand-magenta/20 text-[#F472B6]",
      glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]",
      border: "border-pink-500/20 hover:border-pink-500/40",
      accentText: "text-[#FBCFE8]",
    },
    gold: {
      iconBg: "bg-brand-gold/20 text-[#FBBF24]",
      glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      border: "border-amber-500/20 hover:border-amber-500/40",
      accentText: "text-[#FDE68A]",
    },
    emerald: {
      iconBg: "bg-emerald-500/20 text-[#34D399]",
      glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      accentText: "text-[#A7F3D0]",
    },
    sky: {
      iconBg: "bg-sky-500/20 text-[#38BDF8]",
      glow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]",
      border: "border-sky-500/20 hover:border-sky-500/40",
      accentText: "text-[#BAE6FD]",
    },
    rose: {
      iconBg: "bg-rose-500/20 text-[#FB7185]",
      glow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]",
      border: "border-rose-500/20 hover:border-rose-500/40",
      accentText: "text-[#FECDD3]",
    },
  };

  const scheme = colorMap[accentColor] || colorMap.purple;

  return (
    <div
      className={`bg-[#241B2E] rounded-2xl p-4 sm:p-5 border ${scheme.border} ${scheme.glow} transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-[#F5F0FA]">
              {value}
            </span>
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl ${scheme.iconBg} flex items-center justify-center shrink-0 border border-white/5`}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-stone-400 text-[11px] truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span className={`font-semibold ${scheme.accentText}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
