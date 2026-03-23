import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Core analytics for casual players.",
    cta: "Get Started",
    features: [
      { text: "Last 50 games analysis", included: true },
      { text: "Rating trends", included: true },
      { text: "Win/loss/draw stats", included: true },
      { text: "Basic opening analysis", included: true },
      { text: "Player comparison", included: true },
      { text: "Activity patterns", included: true },
      { text: "Deep weakness detection", included: false },
      { text: "Unlimited game history", included: false },
      { text: "Personalized training plan", included: false },
      { text: "Coach matching", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Full analytics for serious improvers.",
    cta: "Start Free Trial",
    popular: true,
    features: [
      { text: "Last 1000 games analysis", included: true },
      { text: "Rating trends", included: true },
      { text: "Win/loss/draw stats", included: true },
      { text: "Advanced opening analysis", included: true },
      { text: "Player comparison", included: true },
      { text: "Activity patterns", included: true },
      { text: "Deep weakness detection", included: true },
      { text: "Unlimited game history", included: true },
      { text: "Personalized training plan", included: true },
      { text: "Coach matching", included: false },
    ],
  },
  {
    name: "Coach",
    price: "$29",
    period: "/month",
    description: "Everything, plus 1-on-1 coaching access.",
    cta: "Contact Us",
    features: [
      { text: "Unlimited games analysis", included: true },
      { text: "Rating trends", included: true },
      { text: "Win/loss/draw stats", included: true },
      { text: "Advanced opening analysis", included: true },
      { text: "Player comparison", included: true },
      { text: "Activity patterns", included: true },
      { text: "Deep weakness detection", included: true },
      { text: "Unlimited game history", included: true },
      { text: "Personalized training plan", included: true },
      { text: "Coach matching", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Start free. Upgrade when you need deeper insights and coaching.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular ? "border-accent/50 shadow-lg shadow-accent/10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-background">
                Most Popular
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-start gap-2 text-sm"
                >
                  {feature.included ? (
                    <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-muted/40 mt-0.5" />
                  )}
                  <span className={feature.included ? "" : "text-muted/50"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link href="/">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted">
          All plans include access to the Lichess API integration. No credit
          card required for Free tier.
        </p>
      </div>
    </div>
  );
}
