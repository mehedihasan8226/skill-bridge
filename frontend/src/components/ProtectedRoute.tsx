"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Array<"STUDENT" | "TUTOR" | "ADMIN">;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/auth/login");
    else if (roles && !roles.includes(user.role)) router.push("/");
  }, [user, loading, roles, router]);

  if (loading) return <p className="mx-auto max-w-4xl px-4 py-10">Loading...</p>;
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
