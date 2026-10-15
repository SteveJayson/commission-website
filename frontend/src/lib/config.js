export const BRAND = "Your Studio";
export const CURRENCY = "PHP";

export const formatPrice = (n) => {
  const num = Number(n) || 0;
  return `₱${num.toLocaleString("en-PH")}`;
};

export const STATUS = {
  new: { label: "New", cls: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/25 font-medium" },
  in_progress: { label: "In progress", cls: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/25 font-medium" },
  delivered: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/25 font-medium" },
};
