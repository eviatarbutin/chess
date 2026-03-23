import { Card } from "@/components/ui/Card";
import type { Weakness } from "@/lib/analysis";
import { AlertTriangle, AlertCircle, Info, Lightbulb } from "lucide-react";

const SEVERITY_STYLES = {
  high: {
    border: "border-red-500/30",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    badge: "bg-red-900/40 text-red-400",
  },
  medium: {
    border: "border-yellow-500/30",
    icon: AlertCircle,
    iconColor: "text-yellow-400",
    badge: "bg-yellow-900/40 text-yellow-400",
  },
  low: {
    border: "border-blue-500/30",
    icon: Info,
    iconColor: "text-blue-400",
    badge: "bg-blue-900/40 text-blue-400",
  },
};

export function WeaknessCards({ weaknesses }: { weaknesses: Weakness[] }) {
  return (
    <div className="space-y-4">
      {weaknesses.map((w, i) => {
        const style = SEVERITY_STYLES[w.severity];
        const Icon = style.icon;
        return (
          <Card key={i} className={`${style.border}`}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                <Icon className={`h-5 w-5 ${style.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{w.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style.badge}`}
                  >
                    {w.severity}
                  </span>
                  <span className="text-xs text-muted">{w.category}</span>
                </div>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {w.description}
                </p>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent-muted p-3">
                  <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-accent">{w.suggestion}</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
