"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { tutorProfileSchema } from "@/lib/validators";
import { useEffect, useState } from "react";

function TutorDashboardInner() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const profileQ = useQuery({
    queryKey: ["tutor-me"],
    queryFn: async () => (await api.get("/tutors/me/profile")).data.data,
  });

  const bookingsQ = useQuery({
    queryKey: ["my-bookings-tutor"],
    queryFn: async () => (await api.get("/bookings/me")).data.data as any[],
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings-tutor"] });
      toast.success("Updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const form = useForm({
    defaultValues: { subject: "", bio: "", hourlyRate: 0, experience: 0 },
    validators: { onSubmit: tutorProfileSchema },
    onSubmit: async ({ value }) => {
      setBusy(true);
      try {
        await api.put("/tutors/me", {
          ...value,
          hourlyRate: Number(value.hourlyRate),
          experience: Number(value.experience),
        });
        toast.success("Profile saved");
        qc.invalidateQueries({ queryKey: ["tutor-me"] });
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setBusy(false);
      }
    },
  });

  useEffect(() => {
    if (profileQ.data) {
      form.setFieldValue("subject", profileQ.data.subject || "");
      form.setFieldValue("bio", profileQ.data.bio || "");
      form.setFieldValue("hourlyRate", profileQ.data.hourlyRate || 0);
      form.setFieldValue("experience", profileQ.data.experience || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQ.data]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-lg font-semibold">My tutor profile</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="subject">
            {(f) => (
              <div>
                <label className="label">Subject</label>
                <input
                  className="input"
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="bio">
            {(f) => (
              <div>
                <label className="label">Bio</label>
                <textarea
                  className="input"
                  rows={3}
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-2 gap-2">
            <form.Field name="hourlyRate">
              {(f) => (
                <div>
                  <label className="label">Hourly rate</label>
                  <input
                    type="number"
                    className="input"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(Number(e.target.value))}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="experience">
              {(f) => (
                <div>
                  <label className="label">Experience</label>
                  <input
                    type="number"
                    className="input"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(Number(e.target.value))}
                  />
                </div>
              )}
            </form.Field>
          </div>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Booking requests</h2>
        {bookingsQ.isLoading && <p className="mt-3 text-slate-500">Loading...</p>}
        {bookingsQ.data?.length === 0 && (
          <p className="mt-3 text-slate-500">No bookings yet.</p>
        )}
        <ul className="mt-3 space-y-3">
          {bookingsQ.data?.map((b) => (
            <li key={b.id} className="rounded border border-slate-200 p-3">
              <p className="font-medium">{b.student.name}</p>
              <p className="text-sm text-slate-600">
                {new Date(b.scheduledAt).toLocaleString()}
              </p>
              {b.note && <p className="mt-1 text-sm">📝 {b.note}</p>}
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {b.status}
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {b.status === "PENDING" && (
                  <>
                    <button
                      className="btn-primary"
                      onClick={() => updateStatus.mutate({ id: b.id, status: "ACCEPTED" })}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => updateStatus.mutate({ id: b.id, status: "REJECTED" })}
                    >
                      Reject
                    </button>
                  </>
                )}
                {b.status === "ACCEPTED" && (
                  <button
                    className="btn-outline"
                    onClick={() => updateStatus.mutate({ id: b.id, status: "COMPLETED" })}
                  >
                    Mark completed
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute roles={["TUTOR"]}>
      <TutorDashboardInner />
    </ProtectedRoute>
  );
}
