import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import InventoryStatCard from "../../components/InventoryStatCard";

// ─── Supabase Queries ────────────────────────────────────────────────────────

async function fetchInventoryStats() {
  const today  = new Date().toISOString().split("T")[0];
  const in60   = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [
    { count: total_products },
    { data: soldRows },
    { count: low_stock },
    { count: out_of_stock },
    { count: expiring_soon },
    { count: expired },
  ] = await Promise.all([
    // Total distinct products
    supabase.from("products").select("barcode", { count: "exact", head: true }),

    // Units sold today
    supabase
      .from("sales_log")
      .select("quantity_sold")
      .gte("sale_date", `${today}T00:00:00`)
      .lte("sale_date", `${today}T23:59:59`),

    // Low stock: quantity > 0 but below min_stock_level
    supabase
      .from("products")
      .select("barcode", { count: "exact", head: true })
      .gt("quantity", 0)
      .filter("quantity", "lt", "min_stock_level"),

    // Out of stock
    supabase
      .from("products")
      .select("barcode", { count: "exact", head: true })
      .eq("quantity", 0),

    // Expiring soon (within 60 days, not yet expired)
    supabase
      .from("stock_batches")
      .select("id", { count: "exact", head: true })
      .gte("expiry_date", today)
      .lte("expiry_date", in60),

    // Already expired
    supabase
      .from("stock_batches")
      .select("id", { count: "exact", head: true })
      .lt("expiry_date", today),
  ]);

  const sales_today = soldRows?.reduce((sum, r) => sum + (r.quantity_sold ?? 0), 0) ?? 0;

  return {
    total_products: total_products ?? 0,
    sales_today,
    low_stock:      low_stock     ?? 0,
    out_of_stock:   out_of_stock  ?? 0,
    expiring_soon:  expiring_soon ?? 0,
    expired:        expired       ?? 0,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryOverview({ navigation }) {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]       = useState(null);
  
  // Animated must be imported — add it here since we use it in ref init
  const { Animated } = require("react-native");

  // Animation refs — one pair per card (6 cards)
  const fadeAnims  = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;
  const slideAnims = useRef(Array.from({ length: 6 }, () => new Animated.Value(30))).current;
  const fadeHeader  = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(20)).current;


  const runAnimations = () => {
    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(fadeHeader,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      ...fadeAnims.map((fade, i) =>
        Animated.parallel([
          Animated.timing(fade,         { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(slideAnims[i],{ toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ),
    ]).start();
  };

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchInventoryStats();
      setStats(data);
    } catch (err) {
      console.error("InventoryOverview error:", err.message);
      setError("Failed to load inventory data.");
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

  // Navigate to detail with a filter key + human-readable title
  const goToDetail = (filter, title) => {
    navigation.navigate("InventoryDashboardDetail", { filter, title });
  };

  const CARDS = [
    {
      title: "Total Products", icon: "📦", variant: "total", bg: "#f1f5f9",
      subtitle: "Active items in catalog",
      value: stats?.total_products,
      filter: "total", label: "All Products",
    },
    {
      title: "Sold Today", icon: "📈", variant: "sold", bg: "#dcfce7",
      subtitle: "Units moved since morning",
      value: stats?.sales_today,
      filter: "sold_today", label: "Sold Today",
    },
    {
      title: "Low Stock", icon: "📉", variant: "low", bg: "#fef3c7",
      subtitle: "Below minimum level",
      value: stats?.low_stock,
      filter: "low_stock", label: "Low Stock Items",
    },
    {
      title: "Out of Stock", icon: "🚫", variant: "out", bg: "#fee2e2",
      subtitle: "Zero units available",
      value: stats?.out_of_stock,
      filter: "out_of_stock", label: "Out of Stock",
    },
    {
      title: "Expiring Soon", icon: "⚠️", variant: "expiring", bg: "#ffedd5",
      subtitle: "Expires in < 2 months", isAlert: true,
      value: stats?.expiring_soon,
      filter: "expiring", label: "Expiring Soon (60 days)",
    },
    {
      title: "Expired Items", icon: "🛑", variant: "expired", bg: "#fecdd3",
      subtitle: "Remove immediately", isAlert: true,
      value: stats?.expired,
      filter: "expired", label: "Expired Items",
    },
  ];

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
      <Animated.View style={{ opacity: fadeHeader, transform: [{ translateY: slideHeader }], marginBottom: 28 }}>
        <Text style={styles.headerTitle}>Inventory Health</Text>
        <Text style={styles.headerSubtitle}>Real-time status of your supermarket stock.</Text>
      </Animated.View>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Cards Grid */}
      <View style={styles.grid}>
        {CARDS.map((card, i) => (
          <InventoryStatCard
            key={i}
            title={card.title}
            value={loading ? "" : (card.value ?? 0).toLocaleString()}
            icon={card.icon}
            subtitle={card.subtitle}
            variant={card.variant}
            bg={card.bg}
            isAlert={card.isAlert}
            loading={loading}
            fadeAnim={fadeAnims[i]}
            slideAnim={slideAnims[i]}
            onPress={() => goToDetail(card.filter, card.label)}
          />
        ))}
      </View>

      <Button
        text="+ New Order"
        variant="tertiary"
        onPress={() => navigation.navigate("RestockScreen")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:         { flex: 1, backgroundColor: "#f8fafc" },
  container:      { padding: 24, paddingTop: 60, paddingBottom: 40 },
  headerTitle:    { fontSize: 24, fontWeight: "800", color: "#0056b3", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: "#64748b", marginTop: 6, fontWeight: "500" },
  grid:           { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 30 },
  errorBanner:    { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:      { fontSize: 13, fontWeight: "600", color: "#dc2626" },
});