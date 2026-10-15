import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BRAND } from "../lib/config";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setDemoCredentials = (email, password) => {
    setForm({ email, password });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email.trim(), form.password, remember);
      navigate(user.role === "admin" ? location.state?.from?.pathname || "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10";

  return (
    <main className="grid min-h-screen bg-[#FAFAFC] lg:grid-cols-2">
      {/* Visual Left Banner (Desktop) */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
              <Layers size={20} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">{BRAND}</span>
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-indigo-200 backdrop-blur-sm">
            Client &amp; Admin Portal
          </span>
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white font-display sm:text-5xl">
              Your brief goes in. <br />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100 bg-clip-text text-transparent">
                Finished work comes out.
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-indigo-100/70">
              Follow real-time commission status, download finalized slide decks, and approve milestone revisions in one seamless portal.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-indigo-100/90">
              &ldquo;The fastest commission experience we have ever had. The deck helped us close our seed round within three weeks.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-xs font-bold text-white">
                RC
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rachel Chen</p>
                <p className="text-[11px] text-indigo-200/70">Founder, Synapse AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-6">
          <p>© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-indigo-200/60">
            <ShieldCheck size={14} /> End-to-end encrypted
          </div>
        </div>
      </section>

      {/* Right Column (Sign in Form) */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Layers size={16} />
              </span>
              <span className="font-display text-lg font-bold">{BRAND}</span>
            </Link>
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
              ← Home
            </Link>
          </div>

          <div className="hidden lg:block mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={14} /> Back to studio
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Access your orders, briefs, or studio administration.
          </p>

          {/* Quick Demo Fill Button */}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5 mb-2.5">
              <Sparkles size={14} /> Quick Admin Login
            </p>
            <button
              type="button"
              onClick={() => setDemoCredentials("steve@gmail.com", "hirosama123")}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200/70 bg-white py-2 px-3 text-xs font-medium text-indigo-900 shadow-xs hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
            >
              <KeyRound size={13} className="text-indigo-600" /> Auto-fill Admin Credentials
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Business Email" icon={Mail}>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@company.com"
                className={input}
              />
            </Field>

            <Field label="Password" icon={Lock}>
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                className={`${input} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={remember}
                  aria-labelledby="remember-label"
                  onClick={() => setRemember((r) => !r)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${remember ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${remember ? "translate-x-4" : "translate-x-0"
                      }`}
                  />
                </button>
                <span id="remember-label" className="text-xs text-slate-600">Remember me</span>
              </label>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign in to portal"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </span>
      <span className="relative block">
        <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        {children}
      </span>
    </label>
  );
}