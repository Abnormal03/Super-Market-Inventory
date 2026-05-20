import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function DailySalesScreen({ navigation }) {
  // Demo data (replace with API/DB fetch)
  const topItem = { name: "Fresh Milk 1L", total_qty: 45 };
  const salesLog = [
    {
      id: 1,
      time: "09:15 AM",
      cashier: "Abebe Kebede",
      product: "Fresh Milk 1L",
      qty: 3,
      total: 150,
      method: "Cash",
    },
    {
      id: 2,
      time: "10:30 AM",
      cashier: "Sara Mohammed",
      product: "Orange Juice 1L",
      qty: 2,
      total: 120,
      method: "Card",
    },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.headerTitle}>Today's Performance Overview</Text>
      </View>

      {/* Top Seller Card */}
      {topItem && (
        <View style={styles.statCard}>
          <Text style={styles.cardIcon}>🏆</Text>
          <Text style={styles.cardTitle}>Top Selling Item Today</Text>
          <Text style={styles.cardValue}>{topItem.name}</Text>
          <Text style={styles.cardSubtitle}>
            Moved <Text style={{ fontWeight: "700" }}>{topItem.total_qty}</Text> units today
          </Text>
        </View>
      )}

      {/* Sales Log */}
      <Text style={styles.sectionTitle}>Detailed Sales Log</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1 }]}>Time</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Cashier</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Product</Text>
          <Text style={[styles.th, { flex: 0.7 }]}>Qty</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Total</Text>
          <Text style={[styles.th, { flex: 1 }]}>Method</Text>
        </View>

        {salesLog.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No sales recorded yet today.</Text>
          </View>
        ) : (
          salesLog.map((sale) => (
            <View key={sale.id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 1 }]}>{sale.time}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{sale.cashier}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{sale.product}</Text>
              <Text style={[styles.td, { flex: 0.7 }]}>{sale.qty}</Text>
              <Text style={[styles.td, { flex: 1.2, fontWeight: "700", color: "#2e7d32" }]}>
                ETB {sale.total.toLocaleString()}
              </Text>
              <View style={[styles.td, { flex: 1 }]}>
                <Text style={styles.badge}>{sale.method}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { padding: 20, paddingTop: 55 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#0056b3", marginLeft: 10 },

  statCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: "#2ecc71",
  },
  cardIcon: {
    backgroundColor: "#e7f0fd",
    width: 30,
    height: 30,
    borderRadius: 27,
    textAlign: "center",
    lineHeight: 30,
    fontSize: 24,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#555", textTransform: "uppercase" },
  cardValue: { fontSize: 18, fontWeight: "700", color: "#2ecc71", marginVertical: 8 },
  cardSubtitle: { fontSize: 13, color: "#777" },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 10 },

  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f4f8",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  th: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0056b3",
    textTransform: "uppercase",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
    alignItems: "center",
  },
  td: { fontSize: 13, color: "#333", textAlign: "center" },
  badge: {
    backgroundColor: "#e7f0fd",
    color: "#0056b3",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyRow: { padding: 20 },
  emptyText: { fontSize: 13, color: "#777", textAlign: "center", fontStyle: "italic" },
});
