import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Layers,
  Loader2,
  Presentation,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { api } from "../lib/api";
import { BRAND, formatPrice } from "../lib/config";
import { useAuth } from "../context/AuthContext";

export const ICONS = { system: Code2, deck: Presentation, other: Sparkles };

const HIGHLIGHTS = [
  { icon: Clock, text: "24h quote turnaround" },
  { icon: ShieldCheck, text: "Fixed scope & pricing" },
  { icon: Sparkles, text: "100% bespoke deliverables" },
];

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [offers, setOffers] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api("/api/offers")
      .then(setOffers)
      .catch(() => setError("Offers could not be loaded. Refresh the page to try again."));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAFAFC] overflow-hidden text-slate-900">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-72 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Floating glassmorphic header */}
      <header className="sticky top-0 z-40 glass-nav">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <Layers size={18} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              {BRAND}
            </span>
            <span className="hidden sm:inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-700/15">
              Studio
            </span>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="rounded-lg bg-indigo-50 px-3.5 py-2 font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:border-indigo-500/40 hover:text-indigo-600 hover:shadow-sm"
              >
                Sign in
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-24 text-center sm:text-left">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-xs backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
          </span>
          Bespoke Digital Studio • Now Accepting Commissions
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl text-slate-950 font-display">
          Systems and slide decks,{" "}
          <span className="text-gradient-accent">made to order</span> for you.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Pick a service, describe what you need, and receive a clear quote and timeline within one working day. No bloat, no generic templates.
        </p>

        {/* Feature / Trust Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 pt-2">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Current Offers Section */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-display">
              Current commission offers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fixed-scope deliverables crafted with clean code and polished design.
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers === null && !error &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-slate-200/60 bg-white p-7 shadow-xs"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
                <div className="mt-6 h-6 w-3/4 rounded-lg bg-slate-100" />
                <div className="mt-3 h-16 rounded-lg bg-slate-100" />
                <div className="mt-8 h-10 rounded-xl bg-slate-100" />
              </div>
            ))}

          {offers?.map((offer) => {
            const Icon = ICONS[offer.icon] || ICONS.other;
            return (
              <article
                key={offer.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 ring-1 ring-indigo-500/15 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/25">
                      <Icon size={22} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      Commission
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {offer.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Starting at</span>
                    <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                      {formatPrice(offer.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelected(offer)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-indigo-600 group-hover:shadow-md group-hover:shadow-indigo-500/25 active:scale-[0.98]"
                  >
                    <span>Request commission</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {offers?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
            <Sparkles className="mx-auto text-slate-400 mb-3" size={32} />
            <p className="font-medium text-slate-700">No commissions are currently open.</p>
            <p className="mt-1 text-sm text-slate-500">Check back soon or send an email inquiry.</p>
          </div>
        )}
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white/50 py-10 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs">
              <Layers size={13} />
            </span>
            <span className="font-bold text-slate-800">{BRAND}</span>
          </div>
          <p>© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          <p className="text-xs text-slate-400">Quotes returned within 1 business day.</p>
        </div>
      </footer>

      {/* Request Commission Modal */}
      <AnimatePresence>
        {selected && <RequestModal offer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function RequestModal({ offer, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", brief: "" });
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      await api("/api/orders", { method: "POST", body: { ...form, offerId: offer.id, offerTitle: offer.title } });
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("idle");
    }
  };

  const field =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10";

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 backdrop-blur-sm sm:place-items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Request ${offer.title}`}
        className="w-full max-w-lg rounded-t-3xl bg-white p-7 sm:rounded-3xl shadow-2xl border border-slate-200/90"
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              Commission Brief
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-display">
              {offer.title}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Starting from {formatPrice(offer.price)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {state === "done" ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 font-display">Commission request sent!</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              We received your brief. A detailed quote will arrive at <strong className="text-slate-800">{form.email}</strong> within one business day.
            </p>
            <button
              onClick={onClose}
              className="mt-7 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Your Name
              </label>
              <input
                required
                className={field}
                placeholder="Jane Doe"
                value={form.name}
                onChange={set("name")}
                aria-label="Your name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Business Email
              </label>
              <input
                required
                type="email"
                className={field}
                placeholder="jane@company.com"
                value={form.email}
                onChange={set("email")}
                aria-label="Email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Project Details &amp; Brief
              </label>
              <textarea
                required
                rows={4}
                className={field}
                placeholder="Describe what you need: target audience, timeline, key features, or reference links."
                value={form.brief}
                onChange={set("brief")}
                aria-label="Project details"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
            >
              {state === "sending" && <Loader2 size={18} className="animate-spin" />}
              Send commission request
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
