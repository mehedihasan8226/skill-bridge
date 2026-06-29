"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "@tanstack/react-form";
import { bookingSchema } from "@/lib/validators";
import toast from "react-hot-toast";
import { useState } from "react";

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutor", id],
    queryFn: async () => {
      const res = await api.get(`/tutors/${id}`);
      return res.data.data;
    },
  });

  const form = useForm({
    defaultValues: { scheduledAt: "", note: "" },
    validators: { onSubmit: bookingSchema },
    onSubmit: async ({ value }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "STUDENT") {
        toast.error("Only students can book sessions");
        return;
      }
      setSubmitting(true);
      try {
        await api.post("/bookings", {
          tutorId: id,
          scheduledAt: new Date(value.scheduledAt).toISOString(),
          note: value.note,
        });
        toast.success("Booking created!");
        router.push("/dashboard/student");
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isLoading) return <p className="mx-auto max-w-4xl px-4 py-10">Loading...</p>;
  if (error) return <p className="mx-auto max-w-4xl px-4 py-10 text-red-600">{(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card">
        <h1 className="text-2xl font-bold">{data.user.name}</h1>
        <p className="text-brand-600">{data.subject}</p>
        <p className="mt-3 text-slate-700">{data.bio}</p>
        <div className="mt-4 flex gap-6 text-sm">
          <span>💰 ${data.hourlyRate}/hr</span>
          <span>🎓 {data.experience} yrs experience</span>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Reviews</h2>
        {data.reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
        <ul className="mt-3 space-y-3">
          {data.reviews.map((r: any) => (
            <li key={r.id} className="rounded border border-slate-200 p-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{r.author.name}</span>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold">Book a session</h3>
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="scheduledAt">
            {(f) => (
              <div>
                <label className="label">Date & time</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
                {f.state.meta.errors?.[0] && (
                  <p className="mt-1 text-xs text-red-600">{String(f.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="note">
            {(f) => (
              <div>
                <label className="label">Note (optional)</label>
                <textarea
                  className="input"
                  rows={3}
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Booking..." : "Book now"}
          </button>
          {!user && (
            <p className="text-xs text-slate-500">You'll be asked to log in first.</p>
          )}
        </form>
      </div>
    </div>
  );
}
