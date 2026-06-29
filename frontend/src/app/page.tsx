import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Learn anything from <span className="text-brand-600">expert tutors</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            SkillBridge connects students with verified tutors across math, science, languages,
            and more. Book a session in minutes.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/tutors" className="btn-primary">Find a Tutor</Link>
            <Link href="/auth/register" className="btn-outline">Become a Tutor</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-900">Why SkillBridge?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { t: "Verified tutors", d: "Every tutor is reviewed before going live." },
            { t: "Flexible booking", d: "Pick a slot that fits your schedule." },
            { t: "Honest reviews", d: "See real feedback from past students." },
          ].map((f) => (
            <div key={f.t} className="card text-center">
              <h3 className="text-lg font-semibold text-slate-800">{f.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-slate-900">Popular subjects</h2>
          <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-4">
            {["Math", "Physics", "English", "Coding", "Chemistry", "Music", "Art", "Biology"].map(
              (s) => (
                <Link
                  key={s}
                  href={`/tutors?subject=${s}`}
                  className="card text-center hover:border-brand-500 hover:shadow"
                >
                  <span className="font-medium text-slate-800">{s}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "1", t: "Sign up", d: "Create your free account as a student or tutor." },
            { n: "2", t: "Find & book", d: "Browse tutors, view profiles, book a session." },
            { n: "3", t: "Learn & review", d: "Attend your session and leave honest feedback." },
          ].map((s) => (
            <div key={s.n} className="card">
              <div className="h-10 w-10 rounded-full bg-brand-600 text-white grid place-items-center font-bold">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-800">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start learning?</h2>
          <p className="mt-2 opacity-90">Join thousands of students leveling up every day.</p>
          <Link href="/auth/register" className="btn mt-6 bg-white text-brand-700 hover:bg-slate-100">
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}
