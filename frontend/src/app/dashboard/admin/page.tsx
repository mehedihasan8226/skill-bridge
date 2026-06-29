"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

function AdminInner() {
  const qc = useQueryClient();
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin/stats")).data.data,
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data.data as any[],
  });
  const bookings = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => (await api.get("/admin/bookings")).data.data as any[],
  });

  const block = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      api.patch(`/admin/users/${id}/${blocked ? "unblock" : "block"}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.data &&
          (["users", "tutors", "bookings", "reviews"] as const).map((k) => (
            <div key={k} className="card text-center">
              <p className="text-xs uppercase text-slate-500">{k}</p>
              <p className="text-2xl font-bold">{stats.data[k]}</p>
            </div>
          ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Users</h2>
        {users.isLoading && <p className="mt-3">Loading...</p>}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.data?.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.isBlocked ? (
                      <span className="text-red-600">Blocked</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>
                  <td className="space-x-2 text-right">
                    {u.role !== "ADMIN" && (
                      <>
                        <button
                          className="btn-outline"
                          onClick={() => block.mutate({ id: u.id, blocked: u.isBlocked })}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => {
                            if (confirm("Delete user?")) del.mutate(u.id);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">All bookings</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Student</th>
                <th>Tutor</th>
                <th>Subject</th>
                <th>Scheduled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.data?.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-2">{b.student.name}</td>
                  <td>{b.tutor.user.name}</td>
                  <td>{b.tutor.subject}</td>
                  <td>{new Date(b.scheduledAt).toLocaleString()}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminInner />
    </ProtectedRoute>
  );
}
