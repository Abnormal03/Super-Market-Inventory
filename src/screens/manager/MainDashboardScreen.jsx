import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function DashboardScreen({ navigation }) {
  const screenWidth = Dimensions.get("window").width;

  // Demo data (replace with API/DB fetch)
  const chartLabels = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  const chartData = [1200, 800, 950, 1400, 1600, 1100, 1300];

  const stats = [
    { title: "Total Stock", value: "8,420", icon: "📦", variant: "default" },
    { title: "Staff Active", value: "42", icon: "👥", variant: "blue" },
    { title: "Expiring (7d)", value: "12", icon: "⏳", variant: "orange" },
    { title: "Today's Revenue", value: "ETB 15,200", icon: "💵", variant: "green" },
  ];

  const aiInsights = [
    "Restock Alert: 'Greek Yogurt 500g' is critically low (4 left).",
    "Waste Prevention: 'Fresh Milk 1L' expires in 2 days. Apply clearance discount.",
    "System Status: All operations running within target metrics.",
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.headerTitle}>Central Command</Text>
      </View>

      {/* Chart Section */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>📈 Weekly Sales Trend</Text>
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{ data: chartData }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            labelColor: () => "#555",
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#3498db",
            },
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 12 }}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((s, index) => (
          <View key={index} style={[styles.statCard, styles[s.variant]]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statTitle}>{s.title}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </View>

      {/* AI Insights */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiIcon}>🤖</Text>
          <Text style={styles.aiTitle}>AI Smart Pilot</Text>
        </View>
        {aiInsights.map((insight, idx) => (
          <View key={idx} style={styles.insightBubble}>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.btnRefresh}>
          <Text style={styles.btnRefreshText}>Update Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f4f7f6" },
  container: { padding: 20, paddingTop: 55 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#0056b3", marginLeft: 10 },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 10 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "47%",
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statTitle: { fontSize: 13, fontWeight: "600", color: "#555" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#333", marginTop: 4 },
  blue: { borderTopWidth: 4, borderTopColor: "#3498db" },
  orange: { borderTopWidth: 4, borderTopColor: "#f39c12" },
  green: { borderTopWidth: 4, borderTopColor: "#2ecc71" },
  aiCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 40,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  aiIcon: { fontSize: 22, marginRight: 8 },
  aiTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  insightBubble: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  insightText: { fontSize: 13, color: "#444" },
  btnRefresh: {
    backgroundColor: "#0056b3",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  btnRefreshText: { color: "#fff", fontWeight: "700" },
});
