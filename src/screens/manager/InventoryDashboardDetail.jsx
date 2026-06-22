import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import BackButton from "../../components/BackButton";
import { supabase } from "../../lib/supabase";

// ─── Query per filter type ────────────────────────────────────────────────────

async function fetchByFilter(filter) {
  const today = new Date().toISOString().split("T")[0];
  const in60  = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  switch (filter) {

    case "total": {
      // All products with their stock batches
      const { data, error } = await supabase
        .from("products")
        .select("name, barcode, quantity, min_stock_level, stock_batches(id, expiry_date)")
        .order("name")
        .eq("is_active", true);
      if (error) throw error;
      return data.map((p) => ({
        name:        p.name,
        barcode:     p.barcode,
        batch_id:    p.stock_batches?.[0]?.id ?? null,
        quantity:    p.quantity,
        expiry_date: p.stock_batches?.[0]?.expiry_date ?? null,
        status:      p.quantity === 0 ? "Out of Stock"
                   : p.quantity < p.min_stock_level ? "Low Stock"
                   : "OK",
      }));
    }

    case "low_stock": {
      const { data, error } = await supabase
        .from("products")
        .select("name, barcode, quantity, min_stock_level, stock_batches(id, expiry_date)")
        .gt("quantity", 0)
        .eq("is_active", true);
      if (error) throw error;
      // Filter client-side: quantity < min_stock_level
      // (Supabase can't compare two columns in .filter directly without RPC)
      return data
        .filter((p) => p.quantity < p.min_stock_level)
        .map((p) => ({
          name:        p.name,
          barcode:     p.barcode,
          batch_id:    p.stock_batches?.[0]?.id ?? null,
          quantity:    p.quantity,
          expiry_date: p.stock_batches?.[0]?.expiry_date ?? null,
          status:      `Min: ${p.min_stock_level}`,
        }));
    }

    case "out_of_stock": {
      const { data, error } = await supabase
        .from("products")
        .select("name, barcode, quantity, min_stock_level")
        .eq("quantity", 0)
        .order("name")
        .eq("is_active", true);
      if (error) throw error;
      return data.map((p) => ({
        name:        p.name,
        barcode:     p.barcode,
        batch_id:    null,
        quantity:    0,
        expiry_date: null,
        status:      "Out of Stock",
      }));
    }

    case "expiring": {
      const { data, error } = await supabase
      .from("stock_batches")
      .select("id, expiry_date, quantity, products ( name, barcode, is_active )")
      .gte("expiry_date", today)
      .lte("expiry_date", in60)
      .order("expiry_date");
      if (error) throw error;
      return data.map((b) => {
        const diff = Math.ceil(
          (new Date(b.expiry_date) - new Date(today)) / (1000 * 60 * 60 * 24)
        );
        return {
          name:        b.products?.name ?? "Unknown",
          barcode:     b.products?.barcode ?? "—",
          batch_id:    b.id,
          quantity:    b.quantity,
          expiry_date: b.expiry_date,
          status:      `${diff}d left`,
          daysDiff:    diff,
        };
      });
    }

    case "expired": {
      const { data, error } = await supabase
        .from("stock_batches")
        .select("id, expiry_date, quantity, products(name, barcode)")
        .lt("expiry_date", today)
        .order("expiry_date", { ascending: false })
        .eq("products.is_active", true);
      if (error) throw error;
      return data.map((b) => {
        const diff = Math.ceil(
          (new Date(b.expiry_date) - new Date(today)) / (1000 * 60 * 60 * 24)
        );
        return {
          name:        b.products?.name ?? "Unknown",
          barcode:     b.products?.barcode ?? "—",
          batch_id:    b.id,
          quantity:    b.quantity,
          expiry_date: b.expiry_date,
          status:      `${Math.abs(diff)}d ago`,
          daysDiff:    diff,
        };
      });
    }

    case "sold_today": {
      const { data, error } = await supabase
        .from("sales_log")
        .select("quantity_sold, total_price, products(name, barcode), employees(name)")
        .gte("sale_date", `${today}T00:00:00`)
        .lte("sale_date", `${today}T23:59:59`)
        .order("sale_date", { ascending: false });
      if (error) throw error;
      return data.map((s) => ({
        name:        s.products?.name ?? "Unknown",
        barcode:     s.products?.barcode ?? "—",
        batch_id:    null,
        quantity:    s.quantity_sold,
        expiry_date: null,
        status:      `ETB ${(s.total_price ?? 0).toLocaleString()}`,
        cashier:     s.employees?.name ?? "—",
      }));
    }

    default:
      return [];
  }
}

// ─── Row color by urgency ─────────────────────────────────────────────────────

function getRowStyle(filter, item) {
  if (filter === "expired")   return styles.rowExpired;
  if (filter === "out_of_stock") return styles.rowExpired;
  if (filter === "expiring" && item.daysDiff <= 14) return styles.rowUrgent;
  if (filter === "expiring" && item.daysDiff <= 60) return styles.rowWarning;
  if (filter === "low_stock") return styles.rowWarning;
  return {};
}

// ─── Column config per filter ─────────────────────────────────────────────────

const COLUMNS = {
  total:       ["Product", "Barcode", "Qty", "Status"],
  low_stock:   ["Product", "Barcode", "Qty", "Min Level"],
  out_of_stock:["Product", "Barcode", "Qty", "Status"],
  expiring:    ["Product", "Batch", "Qty", "Expiry", "Days Left"],
  expired:     ["Product", "Batch", "Qty", "Expiry", "Expired"],
  sold_today:  ["Product", "Cashier", "Qty Sold", "Revenue"],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function InventoryDashboardDetail({ navigation, route }) {
  const filter = route?.params?.filter ?? "total";
  const title  = route?.params?.title  ?? "Inventory Detail";

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]       = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchByFilter(filter);
      setItems(data);
    } catch (err) {
      console.error("InventoryDetail error:", err.message);
      setError("Failed to load data.");
    }
  }, [filter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const cols = COLUMNS[filter] ?? COLUMNS.total;

  // Render a single row's cells based on filter
  const renderCells = (item) => {
    switch (filter) {
      case "total":
        return [item.name, item.barcode, item.quantity, item.status];
      case "low_stock":
        return [item.name, item.barcode, item.quantity, item.status];
      case "out_of_stock":
        return [item.name, item.barcode, item.quantity, item.status];
      case "expiring":
      case "expired":
        return [item.name, item.batch_id ? `#${item.batch_id}` : "—", item.quantity, item.expiry_date ?? "—", item.status];
      case "sold_today":
        return [item.name, item.cashier, item.quantity, item.status];
      default:
        return [];
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0056b3"]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      {!loading && !error && (
        <Text style={styles.headerSubtitle}>
          {items.length === 0
            ? "No items found."
            : `${items.length} item${items.length !== 1 ? "s" : ""} found.`}
        </Text>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            {cols.map((col, i) => (
              <Text
                key={i}
                style={[styles.th, { flex: i === 0 ? 2 : 1 }]}
              >
                {col}
              </Text>
            ))}
          </View>

          {/* Table Body */}
          {items.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>All clear — nothing to show here.</Text>
            </View>
          ) : (
            items.map((item, index) => {
              const cells = renderCells(item);
              return (
                <View
                  key={index}
                  style={[styles.tableRow, getRowStyle(filter, item)]}
                >
                  {cells.map((cell, ci) => (
                    <Text
                      key={ci}
                      style={[
                        styles.td,
                        { flex: ci === 0 ? 2 : 1 },
                        ci === 0 && styles.tdBold,
                      ]}
                      numberOfLines={1}
                    >
                      {cell ?? "—"}
                    </Text>
                  ))}
                </View>
              );
            })
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:     { flex: 1, backgroundColor: "#f5f7fa" },
  container:  { padding: 20, paddingTop: 55, paddingBottom: 40 },

  header:         { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8, marginTop: 10 },
  headerTitle:    { fontSize: 22, fontWeight: "700", color: "#0056b3" },
  headerSubtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },

  errorBanner:      { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:        { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  loadingContainer: { alignItems: "center", marginTop: 60, gap: 12 },
  loadingText:      { fontSize: 14, color: "#64748b" },

  table:          { backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, elevation: 3, overflow: "hidden" },
  tableRowHeader: { flexDirection: "row", backgroundColor: "#f8fafc", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#edf2f7" },
  th:             { fontSize: 11, fontWeight: "700", color: "#0056b3", textTransform: "uppercase", textAlign: "center" },
  tableRow:       { flexDirection: "row", paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#f8fafc", alignItems: "center" },
  td:             { fontSize: 12, color: "#333", textAlign: "center" },
  tdBold:         { fontWeight: "700", color: "#0f172a" },

  emptyRow:  { padding: 24 },
  emptyText: { fontSize: 13, color: "#777", textAlign: "center", fontStyle: "italic" },

  rowExpired: { backgroundColor: "#fff5f5" },
  rowUrgent:  { backgroundColor: "#fffaf0" },
  rowWarning: { backgroundColor: "#f7fafc" },
});