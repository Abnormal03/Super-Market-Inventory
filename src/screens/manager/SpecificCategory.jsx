import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import BackButton from "../../components/BackButton";
import { supabase } from "../../lib/supabase";

// ─── Supabase Queries ─────────────────────────────────────────────────────────

async function fetchProductsByCategory(categoryId) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      barcode,
      name,
      quantity,
      min_stock_level,
      selling_price,
      stock_batches ( cost_price )
    `)
    .eq("category_id", categoryId)
    .order("name");

  if (error) throw error;

  return data.map((p) => {
    // Average cost across batches
    const batches  = p.stock_batches ?? [];
    const avgCost  = batches.length
      ? batches.reduce((sum, b) => sum + (b.cost_price ?? 0), 0) / batches.length
      : 0;

    const status = p.quantity === 0
      ? "out"
      : p.quantity < p.min_stock_level
      ? "urgent"
      : "healthy";

    return {
      barcode:   p.barcode,
      name:      p.name,
      quantity:  p.quantity,
      avgCost,
      sellingPrice: p.selling_price,
      status,
    };
  });
}

async function deleteProduct(barcode) {
  // Delete batches first (foreign key), then product
  const { error: batchErr } = await supabase
    .from("stock_batches")
    .delete()
    .eq("product_barcode", barcode);
  if (batchErr) throw batchErr;

  const { error: productErr } = await supabase
    .from("products")
    .delete()
    .eq("barcode", barcode);
  if (productErr) throw productErr;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL = { healthy: "In Stock", urgent: "Low Stock", out: "Out of Stock" };
const STATUS_STYLE = { healthy: "pillHealthy", urgent: "pillUrgent", out: "pillOut" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpecificCategory({ navigation, route }) {
  const categoryId   = route?.params?.categoryId;
  const categoryName = route?.params?.categoryName ?? "Category";
  const categoryIcon = route?.params?.categoryIcon ?? "🏷️";

  const [products, setProducts]     = useState([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    if (!categoryId) return;
    try {
      setError(null);
      const data = await fetchProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      console.error("SpecificCategory error:", err.message);
      setError("Failed to load products.");
    }
  }, [categoryId]);

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

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = (product) => {
    Alert.alert(
      "Delete Product",
      `Remove "${product.name}" and all its stock batches? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(product.barcode);
            try {
              await deleteProduct(product.barcode);
              // Remove locally for instant UI feedback
              setProducts((prev) => prev.filter((p) => p.barcode !== product.barcode));
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete product.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // ── Filtered list ───────────────────────────────────────────────────────────

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.categoryIcon}>{categoryIcon}</Text>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
      </View>

      {/* Search + Restock shortcut */}
      <View style={styles.actions}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation?.navigate("RestockScreen")}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <View style={styles.card}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Product</Text>
            <Text style={[styles.th, { flex: 1 }]}>Stock</Text>
            <Text style={[styles.th, { flex: 1 }]}>Avg Cost</Text>
            <Text style={[styles.th, { flex: 1 }]}>Price</Text>
            <Text style={[styles.th, { flex: 1 }]}>Status</Text>
            <Text style={[styles.th, { flex: 0.6 }]}></Text>
          </View>

          {/* Rows */}
          {filtered.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>
                {search ? "No products match your search." : "No products in this category yet."}
              </Text>
            </View>
          ) : (
            filtered.map((p) => (
              <View
                key={p.barcode}
                style={[
                  styles.tableRow,
                  p.status === "urgent" && styles.urgentRow,
                  p.status === "out"    && styles.outRow,
                ]}
              >
                <Text style={[styles.td, { flex: 2, fontWeight: "700", color: "#0f172a" }]} numberOfLines={2}>
                  {p.name}
                </Text>
                <Text style={[styles.td, { flex: 1 }]}>{p.quantity}</Text>
                <Text style={[styles.td, { flex: 1 }]}>
                  ETB {p.avgCost.toFixed(2)}
                </Text>
                <Text style={[styles.td, { flex: 1 }]}>
                  ETB {(p.sellingPrice ?? 0).toFixed(2)}
                </Text>
                <View style={[styles.td, { flex: 1 }]}>
                  <Text style={[styles.statusPill, styles[STATUS_STYLE[p.status]]]}>
                    {STATUS_LABEL[p.status]}
                  </Text>
                </View>
                <View style={[styles.td, { flex: 0.6, alignItems: "center" }]}>
                  {deletingId === p.barcode ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(p)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Summary footer */}
      {!loading && filtered.length > 0 && (
        <Text style={styles.footerNote}>
          Showing {filtered.length} of {products.length} products
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  header:        { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  categoryIcon:  { fontSize: 22 },
  categoryTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", flex: 1 },

  actions:   { flexDirection: "row", gap: 12, marginBottom: 16 },
  searchBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#0f172a",
  },
  addBtn:     { backgroundColor: "#0056b3", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  errorBanner:      { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:        { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  loadingContainer: { alignItems: "center", marginTop: 60, gap: 12 },
  loadingText:      { fontSize: 14, color: "#64748b" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f4f8",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  th: { fontSize: 10, fontWeight: "700", color: "#0056b3", textTransform: "uppercase", textAlign: "center" },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  urgentRow: { backgroundColor: "#fffbeb" },
  outRow:    { backgroundColor: "#fff5f5" },

  td: { fontSize: 12, color: "#334155", textAlign: "center" },

  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    overflow: "hidden",
    textAlignVertical: "center"
  },
  pillHealthy: { backgroundColor: "#dcfce7", color: "#16a34a" },
  pillUrgent:  { backgroundColor: "#fef3c7", color: "#d97706" },
  pillOut:     { backgroundColor: "#fee2e2", color: "#dc2626" },

  deleteBtn:     { padding: 6 },
  deleteBtnText: { fontSize: 16 },

  emptyRow:    { padding: 24 },
  emptyText:   { fontSize: 13, color: "#94a3b8", textAlign: "center", fontStyle: "italic" },
  footerNote:  { fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 14 },
});