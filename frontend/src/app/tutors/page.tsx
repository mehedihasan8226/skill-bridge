"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { useState } from "react";

interface Tutor {
  id: string;
  subject: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  user: { id: string; name: string };
}

export default function TutorsPage() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutors", q, subject],
    queryFn: async () => {
      const res = await api.get("/tutors", { params: { q, subject } });
      return res.data.data as { items: Tutor[]; total: number };
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Find a tutor</h1>
      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <input
          className="input"
          placeholder="Search by name, subject, or bio"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className="input md:w-60"
          placeholder="Filter subject (e.g. Math)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {isLoading && <p className="mt-8 text-slate-500">Loading tutors...</p>}
      {error && (
        <p className="mt-8 text-red-600">Failed to load tutors: {(error as Error).message}</p>
      )}

      {data && data.items.length === 0 && (
        <p className="mt-8 text-slate-500">No tutors found.</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((t) => (
          <div key={t.id} className="card flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900">{t.user.name}</h3>
            <p className="text-sm text-brand-600">{t.subject}</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">{t.bio}</p>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
              <span>${t.hourlyRate}/hr</span>
              <span>{t.experience} yrs exp</span>
            </div>
            <Link href={`/tutors/${t.id}`} className="btn-primary mt-4">
              View profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
