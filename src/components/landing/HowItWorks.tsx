import { UserSearch, Database, LineChart, GraduationCap } from "lucide-react";

const STEPS = [
  {
    icon: UserSearch,
    step: "01",
    title: "Enter Username",
    description: "Type in any Lichess username to begin the analysis.",
  },
  {
    icon: Database,
    step: "02",
    title: "Fetch Data",
    description:
      "We pull your games, ratings, and activity from the Lichess API.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Analyze Patterns",
    description:
      "Our engine processes thousands of data points to find patterns.",
  },
  {
    icon: GraduationCap,
    step: "04",
    title: "Get Insights",
    description:
      "Receive actionable improvement suggestions tailored to your play.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted text-lg">
            From username to insights in seconds.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden h-px w-[calc(100%-20%)] bg-gradient-to-r from-accent/40 to-transparent lg:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              <div className="mt-2 text-xs font-mono text-accent">
                {step.step}
              </div>
              <h3 className="mt-2 font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
