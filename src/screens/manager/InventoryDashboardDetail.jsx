import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function InventoryDashboardDetail({ navigation, route }) {
  // Demo data (replace with API/DB fetch)
  const items = [
    {
      name: "Fresh Milk 1L",
      barcode: "123456",
      batch_id: "B001",
      quantity: 12,
      expiry_date: "2026-06-01",
      daysDiff: 12,
    },
    {
      name: "Greek Yogurt 500g",
      barcode: "789012",
      batch_id: "B002",
      quantity: 4,
      expiry_date: "2026-05-15",
      daysDiff: -2,
    },
    {
      name: "Orange Juice 1L",
      barcode: "345678",
      batch_id: "B003",
      quantity: 20,
      expiry_date: "2026-07-10",
      daysDiff: 50,
    },
  ];

  const title = route?.params?.title || "Expiring Soon (Next 60 Days)";

  const getRowStyle = (daysDiff) => {
    if (daysDiff < 0) return styles.rowExpired;
    if (daysDiff <= 14) return styles.rowUrgent;
    if (daysDiff <= 60) return styles.rowWarning;
    return {};
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.navigate("InventoryOverview")} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
         <Text style={styles.headerSubtitle}>
            Found {items.length} items requiring attention.
          </Text>
      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRowHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Product Name</Text>
          <Text style={[styles.th, { flex: 1 }]}>Barcode</Text>
          <Text style={[styles.th, { flex: 1 }]}>Batch ID</Text>
          <Text style={[styles.th, { flex: 1 }]}>Qty</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Expiry</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Status / Days</Text>
        </View>

        {/* Table Body */}
        {items.map((item, index) => (
          <View key={index} style={[styles.tableRow, getRowStyle(item.daysDiff)]}>
            <Text style={[styles.td, { flex: 2, fontWeight: "700" }]}>
              {item.name}
            </Text>
            <Text style={[styles.td, { flex: 1 }]}>{item.barcode}</Text>
            <Text style={[styles.td, { flex: 1 }]}>
              {item.batch_id ? `#${item.batch_id}` : "—"}
            </Text>
            <Text style={[styles.td, { flex: 1 }]}>{item.quantity}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>
              {item.expiry_date ? item.expiry_date : "—"}
            </Text>
            <Text style={[styles.td, { flex: 1.5 }]}>
              {item.daysDiff !== "N/A" ? `${item.daysDiff} days` : "Check Stock"}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    padding: 20,
    paddingTop: 55,
  },
  header: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f6fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  th: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
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
  td: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  // Row Variants
  rowExpired: {
    backgroundColor: "#fff5f5",
  },
  rowUrgent: {
    backgroundColor: "#fffaf0",
  },
  rowWarning: {
    backgroundColor: "#f7fafc",
  },
});
