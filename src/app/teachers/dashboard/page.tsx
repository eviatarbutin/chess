"use client";

import { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import { StudentManager } from "@/components/teachers/StudentManager";
import { StudentOverview } from "@/components/teachers/StudentOverview";
import { StudentCompare } from "@/components/teachers/StudentCompare";
import { StudentWeaknesses } from "@/components/teachers/StudentWeaknesses";
import {
  GraduationCap,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "compare", label: "Compare", icon: BarChart3 },
  { id: "weaknesses", label: "Weaknesses", icon: AlertTriangle },
  { id: "manage", label: "Manage", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TeacherDashboardPage() {
  const { students, loaded, addStudent, removeStudent, updateNotes } =
    useStudents();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (!loaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20 text-muted">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Teacher Dashboard</h1>
            <p className="text-xs text-muted">
              {students.length} student{students.length !== 1 ? "s" : ""}{" "}
              &middot; All data from Lichess
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-border mb-6">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.id === "manage" && students.length > 0 && (
                  <span className="rounded-full bg-card border border-border px-1.5 py-0.5 text-[10px] tabular-nums">
                    {students.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "overview" && <StudentOverview students={students} />}

      {activeTab === "compare" && <StudentCompare students={students} />}

      {activeTab === "weaknesses" && (
        <StudentWeaknesses students={students} />
      )}

      {activeTab === "manage" && (
        <StudentManager
          students={students}
          onAdd={addStudent}
          onRemove={removeStudent}
          onUpdateNotes={updateNotes}
        />
      )}
    </div>
  );
}
