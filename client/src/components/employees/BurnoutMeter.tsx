
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ReactNode } from "react";

const burnoutMeterStyles = cva(
  "h-3 rounded-full",
  {
    variants: {
      level: {
        low: "bg-gradient-to-r from-green-400 to-green-500",
        moderate: "bg-gradient-to-r from-yellow-400 to-orange-400",
        high: "bg-gradient-to-r from-orange-500 to-red-500",
        critical: "bg-gradient-to-r from-red-500 to-red-600",
      },
    },
    defaultVariants: {
      level: "low",
    },
  }
);

interface BurnoutMeterProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: ReactNode;
}

export function BurnoutMeter({
  score,
  showLabel = true,
  size = "md",
  className,
  label
}: BurnoutMeterProps) {
  const getLevel = (score: number) => {
    if (score < 30) return "low";
    if (score < 50) return "moderate";
    if (score < 75) return "high";
    return "critical";
  };

  const getLabelText = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 50) return "Moderate Risk";
    if (score < 75) return "High Risk";
    return "Critical Risk";
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "md":
        return "h-2.5";
      case "lg":
        return "h-4";
      default:
        return "h-2.5";
    }
  };

  return (
    <div className={className}>
      {label && <div className="text-sm text-neutral-600 mb-1.5">{label}</div>}
      <div className="w-full bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={cn(
            burnoutMeterStyles({ level: getLevel(score) }),
            getSizeClasses(size)
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1.5 text-xs text-neutral-500">
          <span>{getLabelText(score)}</span>
          <span className="font-medium">{score}%</span>
        </div>
      )}
    </div>
  );
}
