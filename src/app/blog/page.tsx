import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-analyze-your-games",
    title: "How to Analyze Your Chess Games Effectively",
    excerpt:
      "Most players review their games wrong. Here's a structured approach to game analysis that actually helps you improve, using data from your own playing history.",
    date: "March 20, 2026",
    readTime: "5 min read",
    category: "Improvement",
  },
  {
    slug: "understanding-rating-fluctuations",
    title: "Why Your Rating Fluctuates (And Why That's OK)",
    excerpt:
      "Rating anxiety is real. We break down the math behind Elo rating systems and explain why even strong players experience significant rating swings.",
    date: "March 15, 2026",
    readTime: "4 min read",
    category: "Ratings",
  },
  {
    slug: "opening-repertoire-guide",
    title: "Building an Opening Repertoire Based on Your Data",
    excerpt:
      "Stop picking openings because a GM plays them. Learn how to choose openings that match your playing style using your actual game statistics.",
    date: "March 10, 2026",
    readTime: "7 min read",
    category: "Openings",
  },
  {
    slug: "time-management-chess",
    title: "Time Management in Chess: What Your Clock Data Reveals",
    excerpt:
      "Are you spending too long in the opening? Moving too fast in critical positions? Your activity data holds the answers.",
    date: "March 5, 2026",
    readTime: "6 min read",
    category: "Strategy",
  },
  {
    slug: "from-1200-to-1600",
    title: "From 1200 to 1600: A Data-Driven Improvement Plan",
    excerpt:
      "We analyzed thousands of players who made the jump from 1200 to 1600. Here are the common patterns and what they changed.",
    date: "February 28, 2026",
    readTime: "8 min read",
    category: "Improvement",
  },
];

const CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Tips, analysis guides, and insights to help you improve at chess.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:border-accent/30 hover:text-foreground transition-colors cursor-pointer"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Card key={post.slug} hoverable className="flex flex-col">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-accent-muted px-2 py-0.5 text-accent font-medium">
                {post.category}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug">
              {post.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                Read <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
