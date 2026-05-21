import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";
import { LineChart } from "react-native-chart-kit";
import Button from "../../components/Button";

export default function DashboardScreen({ navigation }) {
  const screenWidth = Dimensions.get("window").width;

  // Animation values
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeChart = useRef(new Animated.Value(0)).current;
  const fadeStats = useRef(new Animated.Value(0)).current;
  const fadeTopSeller = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Smooth staggered orchestration sequence
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(fadeChart, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeStats, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeTopSeller, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // Base Data Metrics
  const chartLabels = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  const chartData = [1200, 800, 950, 1400, 1600, 1100, 1300];

  const stats = [
    { title: "Total Stock", value: "8,420", icon: "📦", variant: "default", bg: "#f1f5f9" },
    { title: "Staff Active", value: "42", icon: "👥", variant: "blue", bg: "#e0f2fe" },
    { title: "Expiring (7d)", value: "12", icon: "⏳", variant: "orange", bg: "#ffedd5" },
    { title: "Today's Revenue", value: "ETB 15,200", icon: "💵", variant: "green", bg: "#dcfce7" },
  ];

  // Cashier Team Data
  const team = [
    { id: 1, name: "Abebe Kebede", status: "active", total_sales: 12450 },
    { id: 2, name: "Sara Mohammed", status: "active", total_sales: 10200 },
    { id: 3, name: "John Doe", status: "inactive", total_sales: 0 },
  ];

  // Performance calculations
  const totalDailyRevenue = team.reduce((sum, emp) => sum + emp.total_sales, 0);
  const topSeller = team.length > 0 ? team[0] : null; // Assumes sorted by sales
  const sharePercent = totalDailyRevenue > 0 && topSeller 
    ? ((topSeller.total_sales / totalDailyRevenue) * 100).toFixed(1) 
    : 0;

  // Helper to extract initials for custom profile avatar placeholder
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideY }] }]}>
        <View>
          <Text style={styles.headerSubtitle}>Operational Overview</Text>
          <Text style={styles.headerTitle}>Central Command</Text>
        </View>
        <TouchableOpacity style={styles.avatarMini} onPress={()=>navigation.navigate("ProfileScreen")}>
          <Text style={{ fontSize: 16 }}>👑</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Chart Section */}
      <Animated.View style={[styles.chartCard, { opacity: fadeChart }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>Weekly Sales Trend</Text>
          <Text style={styles.trendIndicator}>📈 +12%</Text>
        </View>
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{ data: chartData }],
          }}
          width={screenWidth - 48} 
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
            style: { borderRadius: 16 },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#0056b3",
            },
          }}
          bezier
          style={styles.chart}
        />
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View style={[styles.statsGrid, { opacity: fadeStats }]}>
        {stats.map((s, index) => (
          <View key={index} style={[styles.statCard, styles[s.variant]]}>
            <View style={[styles.iconWrapper, { backgroundColor: s.bg }]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statTitle}>{s.title}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Premium Top Performer Spotlight Card */}
      {topSeller && (
        <Animated.View style={[styles.sellerCard, { opacity: fadeTopSeller }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>🏆 Today's Top Seller</Text>
            <TouchableOpacity 
              activeOpacity={0.6} 
              onPress={() => navigation.navigate("CashierLeaderboard")} // Or explicit leaderboard screen if separate
            >
              <Text style={styles.viewAllLink}>View Team</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            {/* User Profile Emblem */}
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{getInitials(topSeller.name)}</Text>
            </View>

            {/* Identity & Shift Status */}
            <View style={styles.identityContainer}>
              <Text style={styles.sellerName}>{topSeller.name}</Text>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, topSeller.status === "active" ? styles.dotGreen : styles.dotGray]} />
                <Text style={styles.statusLabel}>
                  {topSeller.status === "active" ? "On Duty" : "Offline"}
                </Text>
              </View>
            </View>

            {/* Performance Analytics Column */}
            <View style={styles.revenueContainer}>
              <Text style={styles.salesSubLabel}>Revenue Generated</Text>
              <Text style={styles.salesValueText}>ETB {topSeller.total_sales.toLocaleString()}</Text>
              <Text style={styles.contributionText}>{sharePercent}% of shift volume</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Action Button */}
      <View style={styles.footerAction}>
        <Button text="View Daily Sales Details" variant="tertiary" onPress={() => { navigation.navigate("DailySales") }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f8fafc" }, 
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  headerSubtitle: { fontSize: 13, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#0056b3", marginTop: 2 },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },

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
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  trendIndicator: { fontSize: 13, fontWeight: "600", color: "#2ecc71", backgroundColor: "#dcfce7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  chart: { marginVertical: 8, borderRadius: 16, marginLeft: -12 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "48%",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  statIcon: { fontSize: 20 },
  statTextContainer: { flex: 1, justifyContent: "center" },
  statTitle: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginTop: 2 },
  
  blue: { borderLeftWidth: 4, borderLeftColor: "#3498db" },
  orange: { borderLeftWidth: 4, borderLeftColor: "#f39c12" },
  green: { borderLeftWidth: 4, borderLeftColor: "#2ecc71" },
  default: { borderLeftWidth: 4, borderLeftColor: "#64748b" },

  // New Modern Top Seller Card Layout Styles
  sellerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#0056b3", // Anchoring to core brand coloring
  },
  viewAllLink: { fontSize: 13, fontWeight: "700", color: "#0056b3" },
  profileRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: "#0056b3" },
  identityContainer: { flex: 1.2 },
  sellerName: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  statusPill: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f8fafc", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  dotGreen: { backgroundColor: "#2ecc71" },
  dotGray: { backgroundColor: "#94a3b8" },
  statusLabel: { fontSize: 11, fontWeight: "600", color: "#64748b" },
  revenueContainer: { flex: 1, alignItems: "flex-end" },
  salesSubLabel: { fontSize: 11, fontWeight: "600", color: "#64748b" },
  salesValueText: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginTop: 2 },
  contributionText: { fontSize: 11, fontWeight: "600", color: "#2ecc71", marginTop: 2 },
  
  footerAction: { marginTop: 8 },
});