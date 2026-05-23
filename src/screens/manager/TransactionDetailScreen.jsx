import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import BackButton from "../../components/BackButton";

export default function TransactionDetailScreen({ route, navigation }) {
  // Extract transaction details passed via parameters
  const { transaction } = route.params ?? {};

  if (!transaction) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No transaction details loaded.</Text>
          <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formattedDate = new Date(transaction.sale_date).toLocaleString();

  return (
    <View style={styles.safeArea}>
      {/* Header Panel */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Transaction Breakdown</Text>
      </View>

      <View style={styles.container}>
        {/* Receipt Wrapper Card Layout */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptHeader}>🧾 SALE RECEIPT</Text>
          <Text style={styles.receiptId}>Log Identifier: #{transaction.id}</Text>
          <View style={styles.divider} />

          {/* Product Segment Line item info */}
          <View style={styles.metaRow}>
            <Text style={styles.label}>Product Item</Text>
            <Text style={styles.valueFocus}>{transaction.products?.name ?? "—"}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.label}>Item Barcode</Text>
            <Text style={styles.value}>{transaction.products?.barcode ?? "—"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.label}>Unit Valuation</Text>
            <Text style={styles.value}>ETB {(transaction.products?.selling_price ?? 0).toLocaleString()}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.label}>Quantity Sold</Text>
            <Text style={styles.value}>× {transaction.quantity_sold}</Text>
          </View>

          <View style={styles.divider} />

          {/* Payment metadata parameters */}
          <View style={styles.metaRow}>
            <Text style={styles.label}>Cashier Operator</Text>
            <Text style={styles.value}>{transaction.employees?.name ?? "System Auto"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.label}>Settlement Mode</Text>
            <View style={[styles.badge, transaction.payment_method?.toLowerCase() === "card" ? styles.badgeCard : styles.badgeCash]}>
              <Text style={styles.badgeText}>{transaction.payment_method ?? "Cash"}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.label}>Timestamp</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>

          <View style={styles.dividerDouble} />

          {/* Bottom Gross Settlement Panel */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Gross Settlement</Text>
            <Text style={styles.totalValue}>ETB {(transaction.total_price ?? 0).toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btnActionClose} onPress={() => navigation.goBack()}>
          <Text style={styles.btnActionCloseText}>Return to Sales Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#ffffff", borderBottomWidth: 1.5, borderBottomColor: "#edf2f7", ...Platform.select({ android: { paddingTop: 45 } }) },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0056b3", marginLeft: 12 },
  container: { padding: 20, flex: 1, justifyContent: "center" },
  receiptCard: { backgroundColor: "#ffffff", borderRadius: 16, padding: 24, shadowColor: "#0f172a", shadowOpacity: 0.06, shadowRadius: 16, elevation: 4, borderWidth: 1, borderColor: "#e2e8f0" },
  receiptHeader: { fontSize: 13, fontWeight: "800", color: "#64748b", textAlign: "center", letterSpacing: 1.2 },
  receiptId: { fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 4, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16, borderStyle: "dashed", borderWidth: 0.5, borderColor: "#cbd5e1" },
  dividerDouble: { height: 2, backgroundColor: "#e2e8f0", marginVertical: 18 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 8 },
  label: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  value: { fontSize: 13, color: "#334155", fontWeight: "600" },
  valueFocus: { fontSize: 14, color: "#0f172a", fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeCash: { backgroundColor: "#dcfce7" },
  badgeCard: { backgroundColor: "#e0f2fe" },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#1e293b" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
  totalValue: { fontSize: 20, fontWeight: "900", color: "#16a34a" },
  btnActionClose: { backgroundColor: "#0056b3", height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 24 },
  btnActionCloseText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  errorText: { fontSize: 15, color: "#64748b", fontWeight: "600", marginBottom: 16 },
  btnBack: { backgroundColor: "#0056b3", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnBackText: { color: "#fff", fontWeight: "600" }
});