import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Inbox, 
  Layers, 
  LayoutDashboard, 
  Loader2, 
  LogOut, 
  Menu, 
  Package, 
  Plus, 
  Trash2, 
  User, 
  X 
} from "lucide-react";
import { api } from "../lib/api";
import { BRAND, STATUS, formatPrice } from "../lib/config";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "offers", label: "Manage offers", icon: Package },
  { id: "orders", label: "View orders", icon: Inbox },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [offers, setOffers] = useState(null);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  useEffect(() => {
    Promise.all([api("/api/admin/offers"), api("/api/admin/orders")])
      .then(([o, r]) => { setOffers(o); setOrders(r); })
      .catch((e) => setError(e.message));
  }, []);

  const go = (id) => { setTab(id); setMenuOpen(false); };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 p-6 text-white border-r border-slate-800/80">
      {/* Brand & Close */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/40">
            <Layers size={18} />
          </span>
          <div>
            <span className="font-display text-base font-bold tracking-tight text-white block">
              {BRAND}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block -mt-0.5">
              Studio Admin
            </span>
          </div>
        </Link>
        <button 
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden" 
          onClick={() => setMenuOpen(false)} 
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-1.5" aria-label="Admin Navigation">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => go(id)} 
            aria-current={tab === id ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              tab === id 
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30" 
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="mt-auto border-t border-slate-800/80 pt-5">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/30 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/30">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-200">{user?.name || "Admin"}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC] lg:pl-64 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.aside 
              className="relative h-full w-64 shadow-2xl" 
              initial={{ x: -256 }} 
              animate={{ x: 0 }} 
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 py-3.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMenuOpen(true)} 
            aria-label="Open menu" 
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-slate-900">
            {NAV.find((n) => n.id === tab)?.label}
          </span>
        </div>
        <Link to="/" className="text-xs font-semibold text-indigo-600 hover:underline">
          View public site →
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl p-6 sm:p-10">
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {!error && (offers === null || orders === null) && (
          <div className="flex items-center gap-2.5 text-sm text-slate-500 py-12 justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={20} /> Loading studio dashboard...
          </div>
        )}

        {offers && orders && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={tab} 
              initial={{ opacity: 0, y: 6 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.15 }}
            >
              {tab === "overview" && <Overview offers={offers} orders={orders} go={go} />}
              {tab === "offers" && <OffersEditor offers={offers} setOffers={setOffers} notify={notify} />}
              {tab === "orders" && <OrdersTable orders={orders} setOrders={setOrders} notify={notify} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            role="status" 
            initial={{ opacity: 0, y: 16, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white shadow-xl ring-1 ring-white/10"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ offers, orders, go }) {
  const open = orders.filter((o) => o.status !== "delivered").length;
  const fresh = orders.filter((o) => o.status === "new").length;
  
  const stats = [
    { label: "New requests", value: fresh, note: "Needs review", icon: Inbox, color: "text-amber-600 bg-amber-50" },
    { label: "Open orders", value: open, note: "In progress", icon: LayoutDashboard, color: "text-indigo-600 bg-indigo-50" },
    { label: "Live offers", value: offers.length, note: "Catalog", icon: Package, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Summary of current commission briefs and active catalog packages.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.label} 
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {s.label}
                </span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-950">
                {s.value}
              </p>
              <p className="mt-2 text-xs font-medium text-slate-400">
                {s.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 font-display">
              Latest commission requests
            </h2>
            <p className="text-xs text-slate-500">Recent client briefs submitted through the landing page.</p>
          </div>
          <button 
            onClick={() => go("orders")} 
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            View all orders <ArrowRight size={13} />
          </button>
        </div>

        <ul className="divide-y divide-slate-100">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                  {o.client ? o.client[0].toUpperCase() : "C"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{o.client}</p>
                  <p className="text-xs text-slate-500">{o.offerTitle} • <a href={`mailto:${o.email}`} className="hover:text-indigo-600">{o.email}</a></p>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </li>
          ))}
          {orders.length === 0 && (
            <li className="p-8 text-center text-sm text-slate-500">
              No requests received yet. Share your studio link to begin accepting commissions.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Offers editor ---------------- */
function OffersEditor({ offers, setOffers, notify }) {
  const [adding, setAdding] = useState(false);

  const addOffer = async () => {
    setAdding(true);
    try {
      const created = await api("/api/admin/offers", {
        method: "POST",
        body: { title: "New Offer Package", description: "Describe scope, timeline, and deliverables.", price: 250, icon: "system" },
      });
      setOffers((list) => [created, ...list]);
      notify("New offer created");
    } catch (e) { 
      notify(e.message); 
    } finally { 
      setAdding(false); 
    }
  };

  const saveOffer = async (id, draft) => {
    const saved = await api(`/api/admin/offers/${id}`, {
      method: "PUT",
      body: { title: draft.title, description: draft.description, price: Number(draft.price), icon: draft.icon },
    });
    setOffers((list) => list.map((o) => (o.id === id ? saved : o)));
    notify("Offer updated successfully");
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer? Customers will no longer see it.")) return;
    try {
      await api(`/api/admin/offers/${id}`, { method: "DELETE" });
      setOffers((list) => list.filter((o) => o.id !== id));
      notify("Offer deleted");
    } catch (e) { 
      notify(e.message); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display">
            Manage offers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Packages listed here are instantly reflected on the public landing page.
          </p>
        </div>
        <button 
          onClick={addOffer} 
          disabled={adding}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add package
        </button>
      </div>

      <div className="space-y-4">
        {offers.map((o) => <OfferCard key={o.id} offer={o} onSave={saveOffer} onDelete={deleteOffer} />)}
        {offers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 bg-white">
            No offers defined yet. Click &quot;Add package&quot; to publish your first commission.
          </div>
        )}
      </div>
    </div>
  );
}

function OfferCard({ offer, onSave, onDelete }) {
  const [draft, setDraft] = useState(offer);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const dirty = ["title", "description", "price", "icon"].some((k) => String(draft[k]) !== String(offer[k]));
  
  const field = 
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10";

  const save = async () => {
    setSaving(true);
    try { 
      await onSave(offer.id, draft); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all">
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem_9rem]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Package Title
          </label>
          <input className={field} value={draft.title} onChange={set("title")} placeholder="e.g. Custom Web System" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Starting Price (₱)
          </label>
          <input type="number" min="0" className={field} value={draft.price} onChange={set("price")} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Icon Style
          </label>
          <select className={field} value={draft.icon} onChange={set("icon")}>
            <option value="system">System (Code)</option>
            <option value="deck">Presentation (Deck)</option>
            <option value="other">Other (Sparkle)</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Description &amp; Deliverables
        </label>
        <textarea rows={3} className={field} value={draft.description} onChange={set("description")} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button 
          onClick={() => onDelete(offer.id)} 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <Trash2 size={15} /> Delete offer
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Preview: <strong className="text-slate-700">{formatPrice(draft.price)}</strong>
          </span>
          {dirty && (
            <button 
              onClick={() => setDraft(offer)} 
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Discard
            </button>
          )}
          <button 
            onClick={save} 
            disabled={!dirty || saving}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Orders Table ---------------- */
function OrdersTable({ orders, setOrders, notify }) {
  const setStatus = async (id, status) => {
    const prev = orders;
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await api(`/api/admin/orders/${id}`, { method: "PATCH", body: { status } });
      notify("Order status updated");
    } catch (e) {
      setOrders(prev);
      notify(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display">
          Commission orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          All client commission briefs and workflow statuses.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Client</th>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-5 py-3.5">Brief Details</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="align-top hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{o.client}</p>
                    <a href={`mailto:${o.email}`} className="text-xs text-slate-500 hover:text-indigo-600">
                      {o.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {o.offerTitle}
                  </td>
                  <td className="max-w-xs px-5 py-4 text-xs leading-relaxed text-slate-600">
                    {o.brief}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString(undefined, { 
                      month: "short", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <select 
                      value={o.status} 
                      onChange={(e) => setStatus(o.id, e.target.value)} 
                      aria-label={`Status for ${o.client}`}
                      className={`cursor-pointer rounded-full border-0 py-1.5 pl-3 pr-8 text-xs font-semibold ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 ${STATUS[o.status].cls}`}
                    >
                      {Object.entries(STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No client commission requests have been submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
