import { AnalyzeLayoutInner } from "@/components/analyze/AnalyzeLayoutInner";

export default async function AnalyzeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <AnalyzeLayoutInner username={username}>{children}</AnalyzeLayoutInner>;
}
