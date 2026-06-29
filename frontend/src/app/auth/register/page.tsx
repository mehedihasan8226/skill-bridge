"use client";

import { useForm } from "@tanstack/react-form";
import { registerSchema } from "@/lib/validators";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT" as "STUDENT" | "TUTOR",
      subject: "",
      bio: "",
      hourlyRate: 0,
      experience: 0,
    },
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      try {
        const payload: any = {
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,
        };
        if (value.role === "TUTOR") {
          payload.subject = value.subject;
          payload.bio = value.bio;
          payload.hourlyRate = Number(value.hourlyRate);
          payload.experience = Number(value.experience);
        }
        const res = await api.post("/auth/register", payload);
        const { token, user } = res.data.data;
        login(token, user);
        toast.success("Account created");
        router.push(value.role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student");
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="role">
            {(field) => (
              <div>
                <label className="label">I am a</label>
                <select
                  className="input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as any)}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                </select>
              </div>
            )}
          </form.Field>

          {(["name", "email", "password"] as const).map((name) => (
            <form.Field key={name} name={name}>
              {(field) => (
                <div>
                  <label className="label capitalize">{name}</label>
                  <input
                    className="input"
                    type={name === "password" ? "password" : name === "email" ? "email" : "text"}
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="mt-1 text-xs text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          ))}

          <form.Subscribe selector={(s) => s.values.role}>
            {(role) =>
              role === "TUTOR" ? (
                <div className="space-y-4 border-t pt-4">
                  <p className="text-sm font-medium text-slate-700">Tutor details</p>
                  <form.Field name="subject">
                    {(f) => (
                      <div>
                        <label className="label">Subject</label>
                        <input
                          className="input"
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                        />
                        {f.state.meta.errors?.[0] && (
                          <p className="mt-1 text-xs text-red-600">
                            {String(f.state.meta.errors[0])}
                          </p>
                        )}
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
                        {f.state.meta.errors?.[0] && (
                          <p className="mt-1 text-xs text-red-600">
                            {String(f.state.meta.errors[0])}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <div className="grid grid-cols-2 gap-3">
                    <form.Field name="hourlyRate">
                      {(f) => (
                        <div>
                          <label className="label">Hourly rate ($)</label>
                          <input
                            className="input"
                            type="number"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(Number(e.target.value))}
                          />
                        </div>
                      )}
                    </form.Field>
                    <form.Field name="experience">
                      {(f) => (
                        <div>
                          <label className="label">Experience (yrs)</label>
                          <input
                            className="input"
                            type="number"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(Number(e.target.value))}
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              ) : null
            }
          </form.Subscribe>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Have an account?{" "}
          <Link href="/auth/login" className="text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
