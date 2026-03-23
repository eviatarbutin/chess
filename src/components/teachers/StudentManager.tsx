"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  UserPlus,
  Trash2,
  Loader2,
  ExternalLink,
  StickyNote,
  Check,
  X,
} from "lucide-react";
import type { StoredStudent } from "@/hooks/useStudents";
import Link from "next/link";

interface Props {
  students: StoredStudent[];
  onAdd: (username: string) => boolean;
  onRemove: (username: string) => void;
  onUpdateNotes: (username: string, notes: string) => void;
}

export function StudentManager({
  students,
  onAdd,
  onRemove,
  onUpdateNotes,
}: Props) {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setAdding(true);
    setError("");

    try {
      const res = await fetch(
        `https://lichess.org/api/user/${encodeURIComponent(input.trim())}`
      );
      if (!res.ok) {
        setError(`User "${input.trim()}" not found on Lichess.`);
        setAdding(false);
        return;
      }
      const added = onAdd(input.trim());
      if (!added) {
        setError("Student already in your list.");
      } else {
        setInput("");
      }
    } catch {
      setError("Failed to verify username. Check your connection.");
    }
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-sm font-semibold mb-3">Add Student</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Lichess username..."
            className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          />
          <Button onClick={handleAdd} disabled={!input.trim() || adding}>
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Add
              </>
            )}
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </Card>

      {students.length === 0 ? (
        <Card>
          <p className="text-sm text-muted text-center py-4">
            No students yet. Add a Lichess username above to get started.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-6 py-3">
            <h3 className="text-sm font-semibold">
              Students ({students.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {students.map((student) => (
              <div
                key={student.username}
                className="flex items-center gap-3 px-6 py-3 hover:bg-card-hover transition-colors group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted text-accent text-xs font-bold uppercase">
                  {student.username.slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/analyze/${student.username}`}
                      className="text-sm font-medium hover:text-accent transition-colors"
                    >
                      {student.username}
                    </Link>
                    <Link
                      href={`https://lichess.org/@/${student.username}`}
                      target="_blank"
                      className="text-muted hover:text-accent"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {editingNotes === student.username ? (
                    <div className="mt-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onUpdateNotes(student.username, noteDraft);
                            setEditingNotes(null);
                          }
                          if (e.key === "Escape") setEditingNotes(null);
                        }}
                        autoFocus
                        className="flex-1 rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground focus:border-accent focus:outline-none"
                        placeholder="Add a note..."
                      />
                      <button
                        onClick={() => {
                          onUpdateNotes(student.username, noteDraft);
                          setEditingNotes(null);
                        }}
                        className="text-accent hover:text-accent-hover"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="text-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-0.5">
                      {student.notes ? (
                        <button
                          onClick={() => {
                            setEditingNotes(student.username);
                            setNoteDraft(student.notes || "");
                          }}
                          className="text-xs text-muted hover:text-foreground transition-colors truncate max-w-[200px]"
                        >
                          {student.notes}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNotes(student.username);
                            setNoteDraft("");
                          }}
                          className="text-xs text-muted/50 hover:text-muted transition-colors flex items-center gap-0.5 opacity-0 group-hover:opacity-100"
                        >
                          <StickyNote className="h-3 w-3" /> Add note
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted">
                  {new Date(student.addedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {confirmRemove === student.username ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onRemove(student.username);
                        setConfirmRemove(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Confirm
                    </Button>
                    <button
                      onClick={() => setConfirmRemove(null)}
                      className="text-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemove(student.username)}
                    className="text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
