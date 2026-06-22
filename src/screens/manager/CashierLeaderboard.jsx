import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import BackButton from "../../components/BackButton";
import { supabase } from "../../lib/supabase";

// ─── Supabase Query ───────────────────────────────────────────────────────────

async function fetchCashierLeaderboard() {
  const today = new Date().toISOString().split("T")[0];

  // 1. Resolve the "Cashier" role id dynamically (don't hardcode it)
  const { data: role, error: roleErr } = await supabase
    .from("roles")
    .select("id")
    .eq("role_name", "Cashier")
    .single();
  if (roleErr) throw roleErr;

  // 2. All employees with that role
  const { data: employees, error: empErr } = await supabase
    .from("employees")
    .select("id, name, status")
    .eq("role_id", role.id)
    .order("name");
  if (empErr) throw empErr;

  // 3. Today's sales, grouped by cashier
  const { data: sales, error: salesErr } = await supabase
    .from("sales_log")
    .select("cashier_id, total_price")
    .gte("sale_date", `${today}T00:00:00`)
    .lte("sale_date", `${today}T23:59:59`);
  if (salesErr) throw salesErr;

  const totals = {};
  sales.forEach((s) => {
    totals[s.cashier_id] = (totals[s.cashier_id] ?? 0) + (s.total_price ?? 0);
  });

  // 4. Merge + sort by revenue, highest first
  const team = employees.map((e) => ({
    id: e.id,
    name: e.name,
    status: e.status,
    total_sales: totals[e.id] ?? 0,
  }));

  team.sort((a, b) => b.total_sales - a.total_sales);
  return team;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CashierLeaderboard({ navigation }) {
  const [team, setTeam]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]       = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCashierLeaderboard();
      setTeam(data);
    } catch (err) {
      console.error("CashierLeaderboard error:", err.message);
      setError("Failed to load leaderboard.");
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

  const totalDailyRevenue = team.reduce((sum, emp) => sum + emp.total_sales, 0);
  const topCashierId = team.length > 0 && team[0].total_sales > 0 ? team[0].id : null;

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
        <Text style={styles.headerTitle}>Cashier Performance</Text>
      </View>
      <Text style={styles.headerSubtitle}>Real-time sales tracking for today's shift</Text>

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
        </View>
      ) : (
        <View style={styles.leaderboard}>
          {team.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No cashiers found in the system.</Text>
            </View>
          ) : (
            team.map((emp, index) => {
              const percent = totalDailyRevenue > 0 ? (emp.total_sales / totalDailyRevenue) * 100 : 0;
              const isWinner = emp.id === topCashierId;
              const rank = index + 1;
              return (
                <View key={emp.id} style={[styles.row, isWinner && styles.winner]}>
                  {/* Rank Zone */}
                  <View style={styles.rankZone}>
                    {isWinner ? (
                      <Text style={styles.trophy}>🏆</Text>
                    ) : (
                      <Text style={styles.rankNumber}>#{rank}</Text>
                    )}
                  </View>

                  {/* Info Zone */}
                  <View style={styles.infoZone}>
                    <View style={styles.nameStatus}>
                      <Text style={styles.name}>{emp.name}</Text>
                      {/* <View
                        style={[
                          styles.statusDot,
                          emp.status === "active" ? styles.activeDot : styles.inactiveDot,
                        ]}
                      /> */}
                    </View>
                  </View>

                  {/* Performance Zone */}
                  <View style={styles.performanceZone}>
                    <Text style={styles.salesLabel}>
                      Revenue: <Text style={{ fontWeight: "700" }}>ETB {emp.total_sales.toLocaleString()}</Text>
                    </Text>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.percentText}>{percent.toFixed(1)}%</Text>
                  </View>
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
  scroll: { flex: 1, backgroundColor: "#f4f7f6" },
  container: { padding: 20, paddingTop: 55, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", marginLeft: 10 },
  headerSubtitle: { fontSize: 13, color: "#777", marginBottom: 20 },

  errorBanner: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:   { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  loadingContainer: { alignItems: "center", marginTop: 60 },

  leaderboard: { gap: 15 },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e6eb",
  },
  winner: { borderLeftColor: "#0056b3", backgroundColor: "#fffdf5" },
  rankZone: { width: 50, alignItems: "center" },
  trophy: { fontSize: 20, color: "#0056b3" },
  rankNumber: { fontSize: 14, fontWeight: "700", color: "#555758" },
  infoZone: { flex: 1 },
  nameStatus: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 14, fontWeight: "700", color: "#0056b3" },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  activeDot: { backgroundColor: "#2ecc71" },
  inactiveDot: { backgroundColor: "#e74c3c", marginLeft: 18 },
  performanceZone: { flex: 2, paddingHorizontal: 20 },
  salesLabel: { fontSize: 12, color: "#555", marginBottom: 6 },
  progressBg: {
    height: 12,
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  percentText: { fontSize: 11, color: "#4b4949", textAlign: "right", marginTop: 4 },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyText: { fontSize: 13, color: "#777", fontStyle: "italic" },
});