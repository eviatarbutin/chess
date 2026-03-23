"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "chesslens-students";

export interface StoredStudent {
  username: string;
  addedAt: number;
  notes?: string;
}

export function useStudents() {
  const [students, setStudents] = useState<StoredStudent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStudents(JSON.parse(raw));
    } catch {
      /* empty */
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((list: StoredStudent[]) => {
    setStudents(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addStudent = useCallback(
    (username: string) => {
      const normalized = username.trim().toLowerCase();
      if (!normalized) return false;
      if (students.some((s) => s.username.toLowerCase() === normalized))
        return false;
      persist([...students, { username: username.trim(), addedAt: Date.now() }]);
      return true;
    },
    [students, persist]
  );

  const removeStudent = useCallback(
    (username: string) => {
      persist(
        students.filter(
          (s) => s.username.toLowerCase() !== username.toLowerCase()
        )
      );
    },
    [students, persist]
  );

  const updateNotes = useCallback(
    (username: string, notes: string) => {
      persist(
        students.map((s) =>
          s.username.toLowerCase() === username.toLowerCase()
            ? { ...s, notes }
            : s
        )
      );
    },
    [students, persist]
  );

  return { students, loaded, addStudent, removeStudent, updateNotes };
}
