import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Star,
  Globe,
  MessageCircle,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export interface Teacher {
  id: string;
  name: string;
  title: string;
  rating: number;
  ratingType: string;
  languages: string[];
  specialties: string[];
  bio: string;
  lichessUsername?: string;
  hourlyRate?: number;
  currency?: string;
  available: boolean;
}

const TEACHERS: Teacher[] = [
  {
    id: "gm-alex",
    name: "GM Alexander Petrov",
    title: "GM",
    rating: 2580,
    ratingType: "FIDE Classical",
    languages: ["English", "Russian"],
    specialties: ["Endgames", "Positional Play", "Classical"],
    bio: "Grandmaster with 20+ years of coaching experience. Specializes in helping intermediate players break through to advanced levels through deep positional understanding.",
    lichessUsername: "alexgm",
    hourlyRate: 80,
    currency: "USD",
    available: true,
  },
  {
    id: "im-sarah",
    name: "IM Sarah Chen",
    title: "IM",
    rating: 2420,
    ratingType: "FIDE Rapid",
    languages: ["English", "Mandarin"],
    specialties: ["Tactics", "Opening Preparation", "Blitz"],
    bio: "International Master and former national champion. Passionate about making chess improvement accessible and fun, with a focus on tactical sharpness.",
    lichessUsername: "sarahIM",
    hourlyRate: 50,
    currency: "USD",
    available: true,
  },
  {
    id: "fm-diego",
    name: "FM Diego Morales",
    title: "FM",
    rating: 2310,
    ratingType: "FIDE Classical",
    languages: ["English", "Spanish"],
    specialties: ["Beginner Coaching", "Strategy", "Game Analysis"],
    bio: "FIDE Master dedicated to helping beginners and club players build solid foundations. Known for patient, structured teaching methods.",
    lichessUsername: "diegofm",
    hourlyRate: 35,
    currency: "USD",
    available: true,
  },
  {
    id: "cm-nina",
    name: "CM Nina Johansson",
    title: "CM",
    rating: 2150,
    ratingType: "FIDE Classical",
    languages: ["English", "Swedish", "Norwegian"],
    specialties: ["Youth Coaching", "Opening Repertoire", "Mental Game"],
    bio: "Candidate Master specializing in youth coaching and mental game preparation. Helps players manage tournament pressure and build confidence.",
    lichessUsername: "ninacm",
    hourlyRate: 30,
    currency: "USD",
    available: false,
  },
];

function TitleBadge({ title }: { title: string }) {
  const colors: Record<string, string> = {
    GM: "bg-yellow-900/40 text-yellow-400 border-yellow-500/30",
    IM: "bg-orange-900/40 text-orange-400 border-orange-500/30",
    FM: "bg-blue-900/40 text-blue-400 border-blue-500/30",
    CM: "bg-purple-900/40 text-purple-400 border-purple-500/30",
    NM: "bg-green-900/40 text-green-400 border-green-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${colors[title] ?? "bg-card text-muted border-border"}`}
    >
      {title}
    </span>
  );
}

export default function TeachersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <GraduationCap className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Chess Teachers
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Learn from experienced titled players. Find a coach that matches your
          level, language, and learning goals.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {TEACHERS.map((teacher) => (
          <Card
            key={teacher.id}
            hoverable
            className="flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TitleBadge title={teacher.title} />
                  <h2 className="text-lg font-bold">{teacher.name}</h2>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <Star className="h-3 w-3 text-accent" />
                  {teacher.rating} {teacher.ratingType}
                </div>
              </div>
              {teacher.available ? (
                <span className="flex items-center gap-1 rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                  Unavailable
                </span>
              )}
            </div>

            <p className="mt-3 flex-1 text-sm text-muted leading-relaxed">
              {teacher.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {teacher.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {teacher.languages.join(", ")}
              </span>
              {teacher.hourlyRate && (
                <span className="font-medium text-foreground">
                  ${teacher.hourlyRate}/{teacher.currency?.toLowerCase() ?? "usd"}/hr
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              {teacher.lichessUsername && (
                <Link
                  href={`https://lichess.org/@/${teacher.lichessUsername}`}
                  target="_blank"
                >
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Lichess Profile
                  </Button>
                </Link>
              )}
              <Button
                variant={teacher.available ? "primary" : "secondary"}
                size="sm"
                disabled={!teacher.available}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {teacher.available ? "Contact" : "Unavailable"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-accent/20 bg-accent-muted p-8 text-center">
          <h3 className="text-lg font-bold">Are you a chess coach?</h3>
          <p className="mt-2 text-sm text-muted">
            We&apos;re always looking for qualified coaches to join our platform.
            If you&apos;re a titled player interested in teaching, get in touch.
          </p>
          <div className="mt-4">
            <Button variant="primary">Apply as a Teacher</Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="text-lg font-bold">Teacher Dashboard</h3>
          <p className="mt-2 text-sm text-muted">
            Already coaching? Manage your students, compare their progress,
            and track weaknesses all in one place.
          </p>
          <div className="mt-4">
            <Link href="/teachers/dashboard">
              <Button variant="secondary">
                <GraduationCap className="h-4 w-4" /> Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
