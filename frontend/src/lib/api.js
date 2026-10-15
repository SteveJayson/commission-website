// Set VITE_USE_MOCKS=false in .env once your backend is live.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";
export const AUTH_KEY = "commissions.auth";

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || "null");
  } catch { return null; }
}

/* ---------- Real requests ---------- */
async function realRequest(path, { method = "GET", body } = {}) {
  const token = getStoredAuth()?.token;
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.message || "Something went wrong. Try again.", res.status);
  }
  return res.status === 204 ? null : res.json();
}

/* ---------- In-memory mock backend (demo only) ---------- */
const db = {
  offers: [
    { id: "o1", icon: "system", title: "Custom Web System", description: "Booking, inventory, or client portals built around how your business actually runs. Includes admin panel and deployment.", price: 1200 },
    { id: "o2", icon: "deck", title: "Professional Pitch Deck", description: "A clear, persuasive PowerPoint for investors or clients: custom layout, charts, and two rounds of revisions.", price: 180 },
    { id: "o3", icon: "deck", title: "Presentation Redesign", description: "Send your existing slides and get them back restructured, on-brand, and easy to present.", price: 90 },
  ],
  orders: [
    { id: "r1", client: "Maria Santos", email: "maria@example.com", offerTitle: "Professional Pitch Deck", brief: "Seed round deck, 12 slides.", status: "new", createdAt: "2026-10-14T09:12:00Z" },
    { id: "r2", client: "Daniel Cruz", email: "daniel@example.com", offerTitle: "Custom Web System", brief: "Clinic appointment system.", status: "in_progress", createdAt: "2026-10-10T15:40:00Z" },
  ],
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

async function mockRequest(path, { method = "GET", body } = {}) {
  await wait(300);
  if (path === "/api/auth/login") {
    const { email, password } = body;
    if (email === "admin@example.com" && password === "admin123")
      return { token: "mock-admin", user: { email, name: "Admin", role: "admin" } };
    if (email === "client@example.com" && password === "client123")
      return { token: "mock-client", user: { email, name: "Client", role: "client" } };
    throw new ApiError("Email or password is incorrect.", 401);
  }
  if (path === "/api/offers") return clone(db.offers);
  if (path === "/api/orders" && method === "POST") {
    db.orders.unshift({ id: `r${Date.now()}`, client: body.name, email: body.email, offerTitle: body.offerTitle, brief: body.brief, status: "new", createdAt: new Date().toISOString() });
    return { ok: true };
  }
  if (getStoredAuth()?.user?.role !== "admin") throw new ApiError("Admin access required.", 403);

  if (path === "/api/admin/offers" && method === "GET") return clone(db.offers);
  if (path === "/api/admin/offers" && method === "POST") {
    const offer = { id: `o${Date.now()}`, ...body };
    db.offers.unshift(offer);
    return clone(offer);
  }
  if (path === "/api/admin/orders") return clone(db.orders);

  const offerMatch = path.match(/^\/api\/admin\/offers\/(.+)$/);
  if (offerMatch) {
    const i = db.offers.findIndex((o) => o.id === offerMatch[1]);
    if (method === "PUT") { db.offers[i] = { ...db.offers[i], ...body }; return clone(db.offers[i]); }
    if (method === "DELETE") { db.offers.splice(i, 1); return null; }
  }
  const orderMatch = path.match(/^\/api\/admin\/orders\/(.+)$/);
  if (orderMatch && method === "PATCH") {
    const o = db.orders.find((x) => x.id === orderMatch[1]);
    Object.assign(o, body);
    return clone(o);
  }
  throw new ApiError("Not found.", 404);
}

export const api = (path, opts) => (USE_MOCKS ? mockRequest(path, opts) : realRequest(path, opts));
