import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function InventoryOverview({ navigation }) {
  // Demo data (replace with API/DB fetch)
  const stats = {
    total_products: 842,
    sales_today: 50,
    low_stock: 24,
    out_of_stock: 3,
    expired: 5,
    expiring_soon: 12,
  };

  const cards = [
    { title: "Total Products", value: stats.total_products, icon: "📊", variant: "total", subtitle: "Active items in catalog" },
    { title: "Sold Today", value: stats.sales_today, icon: "💹", variant: "sold", subtitle: "Units moved since morning" },
    { title: "Low Stock", value: stats.low_stock, icon: "📉", variant: "low", subtitle: "Items below minimum level" },
    { title: "Expiring Soon", value: stats.expiring_soon, icon: "⚠️", variant: "expiring", subtitle: "Expires within 2 months" },
    { title: "Expired Items", value: stats.expired, icon: "🛑", variant: "expired", subtitle: "Remove from shelf immediately" },
    { title: "Out of Stock", value: stats.out_of_stock, icon: "🚫", variant: "out", subtitle: "Zero units available" },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Inventory Health</Text>
        </View>
      </View>
     <Text style={styles.headerSubtitle}>
            Real-time status of your supermarket stock.
          </Text>
      {/* Stat Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity key={index} style={[styles.card, styles[card.variant]]}>
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Center */}
      <View style={styles.actionCenter}>
        <TouchableOpacity
          style={styles.btnMain}
          onPress={() => navigation?.navigate("InventoryDetails")}
        >
          <Text style={styles.btnMainText}>Explore Detailed Inventory ➔</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7f6",
  },
  container: {
    padding: 20,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    height: 180,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 5,
  },
  cardIcon: {
    backgroundColor: "#e7f0fd",
    width: 55,
    height: 55,
    borderRadius: 27,
    textAlign: "center",
    lineHeight: 55,
    fontSize: 24,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  // Variants
  total: { borderTopWidth: 4, borderTopColor: "#0056b3" },
  sold: { borderTopWidth: 4, borderTopColor: "#2e7d32" },
  low: { borderTopWidth: 4, borderTopColor: "#f39c12" },
  expiring: { backgroundColor: "#fff3e0", borderTopWidth: 4, borderTopColor: "#f57c00" },
  expired: { backgroundColor: "#ffebee", borderTopWidth: 4, borderTopColor: "#c62828" },
  out: { borderTopWidth: 4, borderTopColor: "#dc2626" },
  actionCenter: {
    textAlign: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#0056b3",
    marginBottom: 40,
  },
  btnMain: {
    backgroundColor: "#0056b3",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 40,
    shadowColor: "#0056b3",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnMainText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
});
