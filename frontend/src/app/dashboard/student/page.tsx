"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { reviewSchema } from "@/lib/validators";
import { useState } from "react";

function StudentDashboardInner() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => (await api.get("/bookings/me")).data.data as any[],
  });

  const cancel = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/bookings/${id}/status`, { status: "CANCELLED" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Cancelled");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">My bookings</h1>
      {isLoading && <p className="mt-4 text-slate-500">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{(error as Error).message}</p>}
      {data && data.length === 0 && (
        <p className="mt-4 text-slate-500">No bookings yet. Browse tutors to get started.</p>
      )}
      <div className="mt-6 space-y-4">
        {data?.map((b) => (
          <div key={b.id} className="card">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold">{b.tutor.user.name} — {b.tutor.subject}</h3>
                <p className="text-sm text-slate-600">
                  {new Date(b.scheduledAt).toLocaleString()}
                </p>
                <span
                  className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${
                    b.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : b.status === "REJECTED" || b.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : b.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              {b.status === "PENDING" && (
                <button
                  onClick={() => cancel.mutate(b.id)}
                  className="btn-outline"
                  disabled={cancel.isPending}
                >
                  Cancel
                </button>
              )}
            </div>
            {b.status === "COMPLETED" && !b.review && (
              <ReviewForm bookingId={b.id} onDone={() => qc.invalidateQueries({ queryKey: ["my-bookings"] })} />
            )}
            {b.review && (
              <p className="mt-3 text-sm text-slate-600">
                Your review: {"⭐".repeat(b.review.rating)} — {b.review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const form = useForm({
    defaultValues: { rating: 5, comment: "" },
    validators: { onSubmit: reviewSchema },
    onSubmit: async ({ value }) => {
      setBusy(true);
      try {
        await api.post("/reviews", { bookingId, ...value });
        toast.success("Review submitted");
        onDone();
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setBusy(false);
      }
    },
  });
  return (
    <form
      className="mt-4 border-t pt-3 space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-sm font-medium">Leave a review</p>
      <form.Field name="rating">
        {(f) => (
          <select
            className="input"
            value={f.state.value}
            onChange={(e) => f.handleChange(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        )}
      </form.Field>
      <form.Field name="comment">
        {(f) => (
          <div>
            <textarea
              className="input"
              rows={2}
              placeholder="Comment"
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
            />
            {f.state.meta.errors?.[0] && (
              <p className="text-xs text-red-600">{String(f.state.meta.errors[0])}</p>
            )}
          </div>
        )}
      </form.Field>
      <button className="btn-primary" disabled={busy}>
        {busy ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

export default function Page() {
  return (
    <ProtectedRoute roles={["STUDENT"]}>
      <StudentDashboardInner />
    </ProtectedRoute>
  );
}
