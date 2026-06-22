import { supabase } from "./supabase";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Computes the current set of alerts (low stock, out of stock, expiring,
 * expired) and marks each as read/unread based on notification_reads
 * for the given employee.
 *
 * Returns an array of:
 *   { key, type, icon, title, subtitle, filter, read }
 * sorted unread-first.
 */
export async function fetchActiveAlerts(employeeId) {
  const today = new Date().toISOString().split("T")[0];
  const in7   = new Date(Date.now() + 7 * DAY_MS).toISOString().split("T")[0];

  const [
    { data: stockRows,    error: stockErr },
    { data: outRows,      error: outErr },
    { data: expiringRows, error: expiringErr },
    { data: expiredRows,  error: expiredErr },
    { data: readRows,     error: readErr },
  ] = await Promise.all([
    supabase.from("products").select("barcode, name, quantity, min_stock_level").gt("quantity", 0).eq("is_active", true),
    supabase.from("products").select("barcode, name").eq("quantity", 0).eq("is_active", true),
    supabase
      .from("stock_batches")
      .select("id, expiry_date, products ( name, barcode, is_active )")
      .gte("expiry_date", today)
      .lte("expiry_date", in7),

    supabase
      .from("stock_batches")
      .select("id, expiry_date, products ( name, barcode, is_active )")
      .lt("expiry_date", today),

    employeeId
      ? supabase.from("notification_reads").select("notification_key").eq("employee_id", employeeId)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (stockErr || outErr || expiringErr || expiredErr || readErr) {
    throw stockErr || outErr || expiringErr || expiredErr || readErr;
  }

  const readKeys = new Set((readRows ?? []).map((r) => r.notification_key));
  const alerts = [];

  // Low stock — quantity > 0 but below min_stock_level
  (stockRows ?? [])
    .filter((p) => p.quantity < p.min_stock_level)
    .forEach((p) => {
      const key = `low_stock:${p.barcode}`;
      alerts.push({
        key, type: "low_stock", icon: "📉",
        title: "Low Stock",
        subtitle: `${p.name} — ${p.quantity} left`,
        filter: "low_stock",
        read: readKeys.has(key),
      });
    });

  // Out of stock
  (outRows ?? []).forEach((p) => {
    const key = `out_of_stock:${p.barcode}`;
    alerts.push({
      key, type: "out_of_stock", icon: "🚫",
      title: "Out of Stock",
      subtitle: p.name,
      filter: "out_of_stock",
      read: readKeys.has(key),
    });
  });

  // Expiring soon
  (expiringRows ?? [])
  .filter((b) => b.products?.is_active)
  .forEach((b) => {
    const key  = `expiring:${b.id}`;
    const days = Math.ceil((new Date(b.expiry_date) - new Date(today)) / DAY_MS);
    alerts.push({
      key, type: "expiring", icon: "⚠️",
      title: "Expiring Soon",
      subtitle: `${b.products?.name ?? "Unknown"} — ${days}d left`,
      filter: "expiring",
      read: readKeys.has(key),
    });
  });

  // Already expired
  (expiredRows ?? [])
  .filter((b) => b.products?.is_active)
  .forEach((b) => {
    const key = `expired:${b.id}`;
    alerts.push({
      key, type: "expired", icon: "🛑",
      title: "Expired",
      subtitle: `${b.products?.name ?? "Unknown"} — remove from shelf`,
      filter: "expired",
      read: readKeys.has(key),
    });
  });

  // Unread first
  return alerts.sort((a, b) => Number(a.read) - Number(b.read));
}

/** Lightweight count for the bell badge */
export async function fetchUnreadCount(employeeId) {
  const alerts = await fetchActiveAlerts(employeeId);
  return alerts.filter((a) => !a.read).length;
}

/** Mark a single alert as read */
export async function markAlertRead(employeeId, key) {
  const { error } = await supabase
    .from("notification_reads")
    .upsert(
      { employee_id: employeeId, notification_key: key },
      { onConflict: "employee_id,notification_key" }
    );
  if (error) throw error;
}

/** Mark several alerts as read at once (e.g. "Mark all as read") */
export async function markAllRead(employeeId, keys) {
  if (!keys.length) return;
  const rows = keys.map((key) => ({ employee_id: employeeId, notification_key: key }));
  const { error } = await supabase
    .from("notification_reads")
    .upsert(rows, { onConflict: "employee_id,notification_key" });
  if (error) throw error;
}