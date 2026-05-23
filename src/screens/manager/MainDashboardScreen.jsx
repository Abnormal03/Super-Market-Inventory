import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import StatCard from "../../components/StatCard";
import TopSellerCard from "../../components/TopSellerCard";

const { width } = Dimensions.get("window");

// ─── Supabase Queries ────────────────────────────────────────────────────────

/** Total quantity across all products */
async function fetchTotalStock() {
  const { data, error } = await supabase
    .from("products")
    .select("quantity");
  if (error) throw error;
  return data.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
}

/** Count of active employees (excluding managers — role_id != 1, adjust if needed) */
async function fetchActiveStaff() {
  const { count, error } = await supabase
    .from("employees")
    .select("id", { count: "exact", head: true })
    .eq("status", "Active");
  if (error) throw error;
  return count ?? 0;
}

/** Stock batches expiring within the next 7 days */
async function fetchExpiringSoon() {
  const today = new Date().toISOString().split("T")[0];
  const in7   = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { count, error } = await supabase
    .from("stock_batches")
    .select("id", { count: "exact", head: true })
    .gte("expiry_date", today)
    .lte("expiry_date", in7);
  if (error) throw error;
  return count ?? 0;
}

/** Today's total revenue from sales_log */
async function fetchTodayRevenue() {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const { data, error } = await supabase
    .from("sales_log")
    .select("total_price")
    .gte("sale_date", `${today}T00:00:00`)
    .lte("sale_date", `${today}T23:59:59`);
  if (error) throw error;
  return data.reduce((sum, s) => sum + (s.total_price ?? 0), 0);
}

/**
 * Last 7 days of daily revenue for the chart.
 * Returns { labels: string[], data: number[] }
 */
async function fetchWeeklySales() {
  const days   = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const from = days[0].toISOString().split("T")[0];
  const to   = days[6].toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sales_log")
    .select("total_price, sale_date")
    .gte("sale_date", `${from}T00:00:00`)
    .lte("sale_date", `${to}T23:59:59`);
  if (error) throw error;

  // Aggregate per day
  const dayTotals = {};
  days.forEach(d => { dayTotals[d.toISOString().split("T")[0]] = 0; });
  data.forEach(row => {
    const key = row.sale_date.split("T")[0];
    if (key in dayTotals) dayTotals[key] += row.total_price ?? 0;
  });

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    labels: days.map(d => DAY_LABELS[d.getDay()]),
    data:   days.map(d => dayTotals[d.toISOString().split("T")[0]]),
  };
}

/**
 * Today's top seller — cashier with highest total_price sum today.
 * Returns { name, status, total_sales } or null
 */
async function fetchTopSeller() {
  const today = new Date().toISOString().split("T")[0];

  // Aggregate sales per cashier for today
  const { data: sales, error: sErr } = await supabase
    .from("sales_log")
    .select("cashier_id, total_price")
    .gte("sale_date", `${today}T00:00:00`)
    .lte("sale_date", `${today}T23:59:59`);
  if (sErr) throw sErr;
  if (!sales.length) return { topSeller: null, totalRevenue: 0 };

  // Sum per cashier
  const totals = {};
  sales.forEach(s => {
    totals[s.cashier_id] = (totals[s.cashier_id] ?? 0) + (s.total_price ?? 0);
  });

  const totalRevenue  = Object.values(totals).reduce((a, b) => a + b, 0);
  const topCashierId  = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  const topSalesValue = totals[topCashierId];

  // Fetch employee details
  const { data: emp, error: eErr } = await supabase
    .from("employees")
    .select("name, status")
    .eq("id", topCashierId)
    .single();
  if (eErr) throw eErr;

  return {
    topSeller:    { name: emp.name, status: emp.status, total_sales: topSalesValue },
    totalRevenue,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MainDashboardScreen({ navigation }) {
  const { employee } = useAuth();

  // Data state
  const [stats, setStats]           = useState({ stock: 0, staff: 0, expiring: 0, revenue: 0 });
  const [weekly, setWeekly]         = useState({ labels: ["","","","","","",""], data: [0,0,0,0,0,0,0] });
  const [topSeller, setTopSeller]   = useState(null);
  const [sharePercent, setShare]    = useState("0");
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  // Animations
  const fadeHeader    = useRef(new Animated.Value(0)).current;
  const fadeChart     = useRef(new Animated.Value(0)).current;
  const fadeStats     = useRef(new Animated.Value(0)).current;
  const fadeTopSeller = useRef(new Animated.Value(0)).current;
  const slideY        = useRef(new Animated.Value(30)).current;

  const runAnimations = () => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideY,     { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(fadeChart,     { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeStats,     { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeTopSeller, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [stock, staff, expiring, revenue, weeklyData, sellerData] =
        await Promise.all([
          fetchTotalStock(),
          fetchActiveStaff(),
          fetchExpiringSoon(),
          fetchTodayRevenue(),
          fetchWeeklySales(),
          fetchTopSeller(),
        ]);

      setStats({ stock, staff, expiring, revenue });
      setWeekly(weeklyData);
      setTopSeller(sellerData.topSeller);

      const pct = sellerData.totalRevenue > 0 && sellerData.topSeller
        ? ((sellerData.topSeller.total_sales / sellerData.totalRevenue) * 100).toFixed(1)
        : "0";
      setShare(pct);
    } catch (err) {
      console.error("Dashboard load error:", err.message);
      setError("Failed to load dashboard data.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
      runAnimations();
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Stat card definitions — values come from state
  const statCards = [
    { title: "Total Stock",      value: loading ? "" : stats.stock.toLocaleString(),          icon: "📦", variant: "default" },
    { title: "Staff Active",     value: loading ? "" : String(stats.staff),                   icon: "👥", variant: "blue"    },
    { title: "Expiring (7d)",    value: loading ? "" : String(stats.expiring),                icon: "⏳", variant: "orange"  },
    { title: "Today's Revenue",  value: loading ? "" : `ETB ${stats.revenue.toLocaleString()}`, icon: "💵", variant: "green" },
  ];

  // Week-over-week % change (last day vs 6 days ago)
  const chartTrend = (() => {
    const d = weekly.data;
    if (!d || d.length < 2 || d[0] === 0) return null;
    const pct = (((d[6] - d[0]) / d[0]) * 100).toFixed(1);
    return { label: `${pct > 0 ? "+" : ""}${pct}%`, positive: pct >= 0 };
  })();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0056b3"]} />}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideY }] }]}>
        <View>
          <Text style={styles.headerSubtitle}>Managers Dashboard</Text>
          <Text style={styles.headerTitle}>Welcome back, {employee?.name.split(" ")[0]}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarMini}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Text style={{ fontSize: 16 }}>
            {employee?.name ? employee.name[0].toUpperCase() : "👑"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Chart */}
      <Animated.View style={[styles.chartCard, { opacity: fadeChart }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>Weekly Sales Trend</Text>
          {chartTrend && (
            <Text style={[styles.trendIndicator, chartTrend.positive ? styles.trendGreen : styles.trendRed]}>
              {chartTrend.positive ? "📈" : "📉"} {chartTrend.label}
            </Text>
          )}
        </View>
        <LineChart
          data={{ labels: weekly.labels, datasets: [{ data: weekly.data.map(v => v || 0) }] }}
          width={width - 48}
          height={200}
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 86, 179, ${opacity})`,
            labelColor: () => "#94a3b8",
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#0056b3" },
          }}
          bezier
          style={styles.chart}
        />
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View style={[styles.statsGrid, { opacity: fadeStats }]}>
        {statCards.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
            variant={s.variant}
            loading={loading}
          />
        ))}
      </Animated.View>

      {/* Top Seller */}
      <Animated.View style={{ opacity: fadeTopSeller }}>
        <TopSellerCard
          seller={topSeller}
          sharePercent={sharePercent}
          loading={loading}
          onViewTeam={() => navigation.navigate("CashierLeaderboard")}
        />
      </Animated.View>

      {/* Footer CTA */}
      <View style={styles.footerAction}>
        <Button
          text="View Daily Sales Details"
          variant="tertiary"
          onPress={() => navigation.navigate("DailySales")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:     { flex: 1, backgroundColor: "#f8fafc" },
  container:  { padding: 24, paddingTop: 60, paddingBottom: 40 },

  header:         { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 24 },
  headerSubtitle: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#64748b", 
    textTransform: "uppercase", 
    letterSpacing: 0.5 },
  headerTitle:    { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#0056b3", 
    marginTop: 2 },
  avatarMini:     { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: "#e2e8f0", 
    alignItems: "center", 
    justifyContent: "center" },

  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  cardHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 },
  sectionTitle:  { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1e293b" },
  trendIndicator: { 
    fontSize: 13, 
    fontWeight: "600", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 20 },
  trendGreen:     { 
    color: "#2ecc71", 
    backgroundColor: "#dcfce7" },
  trendRed:       { 
    color: "#ef4444", 
    backgroundColor: "#fee2e2" },
  chart:          { 
    marginVertical: 8, 
    borderRadius: 16, 
    marginLeft: -12 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  errorBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#dc2626" 
  },

  footerAction: { marginTop: 8 },
});
