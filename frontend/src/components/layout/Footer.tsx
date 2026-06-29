export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-brand-600">SkillBridge</h3>
          <p className="mt-2 text-sm text-slate-600">
            Connect with expert tutors and grow your skills.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Explore</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Find Tutors</li>
            <li>Subjects</li>
            <li>Pricing</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Company</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>About</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Legal</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>
    </footer>
  );
}
