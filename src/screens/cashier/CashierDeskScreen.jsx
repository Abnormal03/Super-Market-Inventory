import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function CashierDeskScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BackButton onPress={() => navigation?.goBack()} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Cashier Desk</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Terminal Active</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Scanner Controls */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.btnScan}>
              <Text style={styles.btnScanText}>📷 Toggle Barcode Camera</Text>
            </TouchableOpacity>
            
            <View style={styles.manualGroup}>
              <TextInput 
                style={styles.input} 
                placeholder="Enter Item Barcode or SKU..." 
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.btnAdd}>
                <Text style={styles.btnAddText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cart Table */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🛒 Active Cart</Text>
            
            {cart.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Cart is currently empty.</Text>
                <Text style={styles.emptySubtext}>Scan items or enter an SKU to begin.</Text>
              </View>
            ) : (
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "left" }]}>Item Description</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.6, textAlign: "center" }]}>Qty</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Price</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Total</Text>
                </View>

                {/* Table Body */}
                {cart.map((item, idx) => (
                  <View key={idx} style={styles.row}>
                    <Text style={[styles.cell, { flex: 2, textAlign: "left", fontWeight: "500" }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.cell, { flex: 0.6, textAlign: "center", color: "#64748B" }]}>
                      {item.qty}
                    </Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "right", color: "#64748B" }]}>
                      {item.price.toFixed(2)}
                    </Text>
                    <Text style={[styles.cell, { flex: 1.2, textAlign: "right", fontWeight: "600", color: "#0F172A" }]}>
                      ETB {(item.price * item.qty).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Checkout Panel */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💰 Transaction Overview</Text>
            
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Grand Total Due</Text>
              <Text style={styles.amountValue}>ETB {grandTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>ETB {subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>VAT / Tax (15%)</Text>
                <Text style={styles.summaryValue}>ETB {tax.toFixed(2)}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 12, marginBottom: 12 }]}>Payment Method</Text>
            <View style={styles.methodGrid}>
              {["Cash", "Telebirr", "Card"].map((mode) => {
                const isActive = paymentMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.methodBtn, isActive && styles.methodActive]}
                    onPress={() => setPaymentMode(mode)}
                  >
                    <Text style={[styles.methodText, isActive && styles.methodTextActive]}>
                      {mode === "Telebirr" ? "📱 " : mode === "Card" ? "💳 " : "💵 "}
                      {mode}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.btnFinish} activeOpacity={0.8}>
              <Text style={styles.btnFinishText}>Complete Transaction</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" // Slate premium background 
  },
  container: { 
    padding: 16, 
    paddingBottom: 40, 
  },

  /* Header Configuration */
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    marginTop:55,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    marginLeft: 15,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#0F172A" 
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: "#10B981", // Emerald active online state
    marginRight: 6 
  },
  statusText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  /* Card Base Style */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#334155", 
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14 
  },

  /* Scanner Component Group */
  btnScan: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  btnScanText: { 
    color: "#475569", 
    fontWeight: "600",
    fontSize: 14
  },
  manualGroup: { 
    flexDirection: "row", 
    gap: 10 
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
  },
  btnAdd: {
    backgroundColor: "#4F46E5", // Elegant Tech Indigo
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnAddText: { 
    color: "#FFFFFF", 
    fontWeight: "600",
    fontSize: 14
  },

  /* Structural Cart Layout Grid */
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 12,
  },
  cell: { 
    fontSize: 14, 
    color: "#334155" 
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: { 
    fontSize: 14, 
    color: "#64748B", 
    fontWeight: "600"
  },
  emptySubtext: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  /* Modern Invoice Box Layout */
  amountBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  amountLabel: { 
    fontSize: 12, 
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4
  },
  amountValue: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#0F172A" 
  },
  summaryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 4,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 14,
  },
  summaryValue: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },

  /* Payment Interface Grid Selector */
  methodGrid: { 
    flexDirection: "row", 
    gap: 8,
    marginBottom: 8
  },
  methodBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  methodActive: { 
    backgroundColor: "#EEF2FF", 
    borderColor: "#4F46E5",
  },
  methodText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#475569" 
  },
  methodTextActive: { 
    color: "#4F46E5" 
  },

  /* POS Finish Primary Interaction Button */
  btnFinish: {
    backgroundColor: "#10B981", // Modern Retail Checkout Emerald 
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  btnFinishText: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
    fontSize: 15 
  },
});