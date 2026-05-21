import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
export default function InventoryOverview({ navigation }) {
  // Demo data
  const stats = {
    total_products: 842,
    sales_today: 50,
    low_stock: 24,
    out_of_stock: 3,
    expired: 5,
    expiring_soon: 12,
  };

  const cards = [
    { title: "Total Products", value: stats.total_products, icon: "📦", variant: "total", bg: "#f1f5f9", subtitle: "Active items in catalog" },
    { title: "Sold Today", value: stats.sales_today, icon: "📈", variant: "sold", bg: "#dcfce7", subtitle: "Units moved since morning" },
    { title: "Low Stock", value: stats.low_stock, icon: "📉", variant: "low", bg: "#fef3c7", subtitle: "Below minimum level" },
    { title: "Out of Stock", value: stats.out_of_stock, icon: "🚫", variant: "out", bg: "#fee2e2", subtitle: "Zero units available" },
    { title: "Expiring Soon", value: stats.expiring_soon, icon: "⚠️", variant: "expiring", bg: "#ffedd5", subtitle: "Expires in < 2 months", isAlert: true },
    { title: "Expired Items", value: stats.expired, icon: "🛑", variant: "expired", bg: "#fecdd3", subtitle: "Remove immediately", isAlert: true },
  ];

  // Animation Refs
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(20)).current;
  const fadeCards = useRef(cards.map(() => new Animated.Value(0))).current;
  const slideCards = useRef(cards.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    // Generate an array of parallel animations for each card
    const cardAnimations = cards.map((_, i) =>
      Animated.parallel([
        Animated.timing(fadeCards[i], { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideCards[i], { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );

    // Stagger the header, then cascade through the cards
    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      ...cardAnimations,
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <Animated.View style={[styles.headerContainer, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inventory Health</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Real-time status of your supermarket stock.
        </Text>
      </Animated.View>

      {/* Stat Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <Animated.View 
            key={index} 
            style={{ 
              width: "48%", 
              opacity: fadeCards[index], 
              transform: [{ translateY: slideCards[index] }] 
            }}
          >
            <TouchableOpacity onPress={()=> {navigation.navigate("InventoryDashboardDetail")}}
              activeOpacity={0.7}
              style={[
                styles.card, 
                styles[card.variant], 
                card.isAlert && styles[`${card.variant}AlertBg`] // Apply soft background for alerts
              ]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: card.bg }]}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
              </View>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>{card.subtitle}</Text>
            </TouchableOpacity>
          </Animated.View>        
        ))}
      </View>
          <Button text="+ New Order" variant="tertiary" onPress={()=> navigation.navigate("RestockScreen")}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f8fafc", // Clean slate background
  },
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0056b3",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    minHeight: 160,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
    justifyContent: "center",
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  
  // Left-border variants instead of top borders
  total: { borderLeftWidth: 4, borderLeftColor: "#0056b3" },
  sold: { borderLeftWidth: 4, borderLeftColor: "#2ecc71" },
  low: { borderLeftWidth: 4, borderLeftColor: "#f59e0b" },
  out: { borderLeftWidth: 4, borderLeftColor: "#ef4444" },
  
  // Alert Backgrounds (Soft colors for high-priority items)
  expiring: { borderLeftWidth: 4, borderLeftColor: "#f97316" },
  expiringAlertBg: { backgroundColor: "#fff7ed" },
  expired: { borderLeftWidth: 4, borderLeftColor: "#e11d48" },
  expiredAlertBg: { backgroundColor: "#fff1f2" },
});