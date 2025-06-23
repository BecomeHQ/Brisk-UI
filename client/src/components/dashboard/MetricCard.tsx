
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ReactNode } from "react";

const cardVariants = cva(
  "rounded-lg shadow-sm p-4 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]",
  {
    variants: {
      variant: {
        default: "bg-white border border-neutral-200 hover:border-neutral-300",
        success: "bg-white border border-success/20 hover:border-success/30",
        warning: "bg-white border border-warning/20 hover:border-warning/30",
        danger: "bg-white border border-danger/20 hover:border-danger/30",
        info: "bg-white border border-brisk-300/30 hover:border-brisk-300/50",
        // Updated light shade variants with more distinct colors that won't clash with calendar colors
        "light-blue": "bg-[#D3E4FD] border border-blue-200 hover:border-blue-300",
        "light-green": "bg-[#F2FCE2] border border-green-200 hover:border-green-300",
        "light-orange": "bg-[#FDE1D3] border border-orange-200 hover:border-orange-300",
        "light-purple": "bg-[#E5DEFF] border border-purple-200 hover:border-purple-300",
        "light-pink": "bg-[#FFDEE2] border border-pink-200 hover:border-pink-300",
        // Additional light color variants that won't clash with calendar colors
        "light-mint": "bg-[#E2F6F0] border border-teal-200 hover:border-teal-300",
        "light-lavender": "bg-[#F1F0FB] border border-indigo-200 hover:border-indigo-300",
        "light-peach": "bg-[#FEEDDC] border border-yellow-200 hover:border-yellow-300",
        "light-sky": "bg-[#DEF7FF] border border-cyan-200 hover:border-cyan-300",
        "light-rose": "bg-[#FCE4EC] border border-red-200 hover:border-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  variant?: "default" | "success" | "warning" | "danger" | "info" | "light-blue" | "light-green" | "light-orange" | "light-purple" | "light-pink" | "light-mint" | "light-lavender" | "light-peach" | "light-sky" | "light-rose";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
}: MetricCardProps) {
  return (
    <div className={cn(cardVariants({ variant }))}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-medium text-neutral-600">{title}</h3>
        {icon && <div className="text-neutral-500">{icon}</div>}
      </div>
      <div className="flex items-end gap-2 mt-auto">
        <div className="text-xl font-semibold">{value}</div>
        {trend && (
          <div
            className={cn(
              "text-xs font-medium flex items-center",
              trend.positive ? "text-success" : "text-danger"
            )}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      {subtitle && <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>}
    </div>
  );
}
