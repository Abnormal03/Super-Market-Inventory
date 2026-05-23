import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";
import { supabase } from "../../lib/supabase";

// ─── Supabase Queries ────────────────────────────────────────────────────────

async function fetchTodaySales() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sales_log")
    .select(`
      id,
      quantity_sold,
      total_price,
      payment_method,
      sale_date,
      employees ( name ),
      products ( name, barcode, selling_price )
    `)
    .gte("sale_date", `${today}T00:00:00`)
    .lte("sale_date", `${today}T23:59:59`)
    .order("sale_date", { ascending: false });

  if (error) throw error;
  return data;
}

async function fetchTopItem() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sales_log")
    .select(`
      product_barcode,
      quantity_sold,
      products ( name )
    `)
    .gte("sale_date", `${today}T00:00:00`)
    .lte("sale_date", `${today}T23:59:59`);

  if (error) throw error;
  if (!data.length) return null;

  const totals = {};
  data.forEach((row) => {
    const key  = row.product_barcode;
    const name = row.products?.name ?? "Unknown";
    if (!totals[key]) totals[key] = { name, qty: 0 };
    totals[key].qty += row.quantity_sold ?? 0;
  });

  const top = Object.values(totals).sort((a, b) => b.qty - a.qty)[0];
  return top;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DailySalesScreen({ navigation }) {
  const [salesLog, setSalesLog]   = useState([]);
  const [topItem, setTopItem]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [sales, top] = await Promise.all([fetchTodaySales(), fetchTopItem()]);
      setSalesLog(sales);
      setTopItem(top);
    } catch (err) {
      console.error("DailySales load error:", err.message);
      setError("Failed to load sales data.");
    }
  }, []);

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

  const totalRevenue = salesLog.reduce((sum, s) => sum + (s.total_price ?? 0), 0);
  const totalUnits   = salesLog.reduce((sum, s) => sum + (s.quantity_sold ?? 0), 0);

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
        <Text style={styles.headerTitle}>Today's Sales</Text>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Fetching today's data...</Text>
        </View>
      ) : (
        <>
          {/* Summary Strip */}
          <View style={styles.summaryStrip}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>ETB {totalRevenue.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{salesLog.length}</Text>
              <Text style={styles.summaryLabel}>Transactions</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalUnits}</Text>
              <Text style={styles.summaryLabel}>Units Sold</Text>
            </View>
          </View>

          {/* Top Selling Item Card */}
          {topItem ? (
            <View style={styles.statCard}>
              <Text style={styles.cardIcon}>🏆</Text>
              <Text style={styles.cardTitle}>Top Selling Item Today</Text>
              <Text style={styles.cardValue}>{topItem.name}</Text>
              <Text style={styles.cardSubtitle}>
                Moved <Text style={{ fontWeight: "700" }}>{topItem.qty}</Text> units today
              </Text>
            </View>
          ) : (
            <View style={styles.statCard}>
              <Text style={styles.cardIcon}>📭</Text>
              <Text style={styles.cardTitle}>No Sales Yet Today</Text>
              <Text style={styles.cardSubtitle}>Sales will appear here once recorded.</Text>
            </View>
          )}

          {/* Cleaned Sales Log Table */}
          <Text style={styles.sectionTitle}>Detailed Sales Log</Text>
          <View style={styles.table}>
            
            {/* Optimized Layout Header Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1, textAlign: "left", paddingLeft: 8 }]}>Time</Text>
              <Text style={[styles.th, { flex: 2, textAlign: "left" }]}>Product</Text>
              <Text style={[styles.th, { flex: 0.6, textAlign: "center" }]}>Qty</Text>
              <Text style={[styles.th, { flex: 1.3, textAlign: "right" }]}>Total</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: "center" }]}>Action</Text>
            </View>

            {/* Rows */}
            {salesLog.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No sales recorded yet today.</Text>
              </View>
            ) : (
              salesLog.map((sale) => (
                <View key={sale.id} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 1, textAlign: "left", paddingLeft: 8 }]}>
                    {formatTime(sale.sale_date)}
                  </Text>
                  
                  <Text style={[styles.td, { flex: 2, textAlign: "left", fontWeight: "500", color: "#1e293b" }]} numberOfLines={1}>
                    {sale.products?.name ?? "—"}
                  </Text>
                  
                  <Text style={[styles.td, { flex: 0.6, textAlign: "center", color: "#64748b" }]}>
                    {sale.quantity_sold}
                  </Text>
                  
                  <Text style={[styles.td, { flex: 1.3, textAlign: "right", fontWeight: "700", color: "#16a34a" }]}>
                    ETB {(sale.total_price ?? 0).toLocaleString()}
                  </Text>
                  
                  {/* Action Navigation Target Trigger */}
                  <View style={[styles.td, { flex: 0.9, alignItems: "center", justifyContent: "center" }]}>
                    <TouchableOpacity
                      style={styles.btnView}
                      onPress={() => navigation.navigate("TransactionDetail", { transaction: sale })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnViewText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:     { flex: 1, backgroundColor: "#f5f7fa" },
  container:  { padding: 20, paddingTop: 55, paddingBottom: 40 },
  header:      { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#0056b3", marginLeft: 10 },
  errorBanner: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  errorText: { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  loadingContainer: { alignItems: "center", marginTop: 60, gap: 12 },
  loadingText:      { fontSize: 14, color: "#64748b", fontWeight: "500" },
  summaryStrip: { flexDirection: "row", backgroundColor: "#0056b3", borderRadius: 16, padding: 16, marginBottom: 20, justifyContent: "space-between", alignItems: "center" },
  summaryItem:    { flex: 1, alignItems: "center" },
  summaryValue:   { fontSize: 16, fontWeight: "800", color: "#ffffff" },
  summaryLabel:   { fontSize: 11, fontWeight: "600", color: "#bfdbfe", marginTop: 4 },
  summaryDivider: { width: 1, height: 36, backgroundColor: "#3b82f6", opacity: 0.5 },
  statCard: { backgroundColor: "#fff", borderRadius: 14, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: "#2ecc71" },
  cardIcon:     { fontSize: 28, marginBottom: 8 },
  cardTitle:    { fontSize: 12, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  cardValue:    { fontSize: 18, fontWeight: "700", color: "#2ecc71", marginVertical: 6 },
  cardSubtitle: { fontSize: 13, color: "#777" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 10 },
  
  // Table Design Layout updates
  table: { backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, overflow: "hidden" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f4f8", paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "#edf2f7", alignItems: "center" },
  th: { fontSize: 11, fontWeight: "700", color: "#0056b3", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "#f8fafc", alignItems: "center" },
  td: { fontSize: 13, color: "#333" },
  
  // Action Button
  btnView: { backgroundColor: "rgba(0, 86, 179, 0.06)", borderWidth: 1, borderColor: "#0056b3", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  btnViewText: { color: "#0056b3", fontSize: 11, fontWeight: "700" },
  emptyRow:  { padding: 24 },
  emptyText: { fontSize: 13, color: "#777", textAlign: "center", fontStyle: "italic" },
});