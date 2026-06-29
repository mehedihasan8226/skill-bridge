"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const dashboardLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "TUTOR"
      ? "/dashboard/tutor"
      : "/dashboard/student";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          SkillBridge
        </Link>
        <button
          className="md:hidden rounded p-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
        <nav
          className={`${
            open ? "block" : "hidden"
          } md:flex absolute md:static top-full left-0 right-0 bg-white md:bg-transparent border-b md:border-0 px-4 md:px-0 py-3 md:py-0 gap-6 items-center`}
        >
          <Link href="/tutors" className="block py-2 md:py-0 text-slate-700 hover:text-brand-600">
            Find Tutors
          </Link>
          {user && (
            <Link
              href={dashboardLink}
              className="block py-2 md:py-0 text-slate-700 hover:text-brand-600"
            >
              Dashboard
            </Link>
          )}
          {!user ? (
            <div className="flex gap-2 mt-2 md:mt-0">
              <Link href="/auth/login" className="btn-outline">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <span className="text-sm text-slate-600">
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn-outline">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
