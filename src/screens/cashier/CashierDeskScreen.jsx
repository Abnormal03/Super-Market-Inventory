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
  // Mock data included for visual presentation; handles dynamic additions flawlessly
  const [cart, setCart] = useState([
    { name: "Premium Sunflower Oil 5L", qty: 2, price: 1200.0 },
    { name: "White Long Grain Rice 5kg", qty: 1, price: 650.0 },
  ]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [focusedInput, setFocusedInput] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.15; // Standard 15% VAT calculation
  const grandTotal = subtotal + tax;


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Operational Header */}
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

          {/* Premium Header Logout Action */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={()=> navigation.replace("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Exit Session</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Hardware & Manual Scanning Controls Card */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.btnScan} activeOpacity={0.75}>
              <Text style={styles.btnScanText}>📷 Toggle Barcode Camera</Text>
            </TouchableOpacity>
            
            <View style={styles.manualGroup}>
              <View style={[styles.inputWrapper, focusedInput && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🏷️</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter Item Barcode or SKU..." 
                  placeholderTextColor="#94a3b8"
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                />
              </View>
              <TouchableOpacity style={styles.btnAdd} activeOpacity={0.8}>
                <Text style={styles.btnAddText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Real-time Active Cart Table Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🛒 Active Cart</Text>
            
            {cart.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Cart is currently empty.</Text>
                <Text style={styles.emptySubtext}>Scan items or enter an SKU to begin.</Text>
              </View>
            ) : (
              <View style={styles.table}>
                {/* Table Header Row */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "left" }]}>Item Description</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.6, textAlign: "center" }]}>Qty</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Price</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Total</Text>
                </View>

                {/* Table Dynamic Rows */}
                {cart.map((item, idx) => (
                  <View key={idx} style={styles.row}>
                    <Text style={[styles.cell, { flex: 2, textAlign: "left", fontWeight: "600", color: "#0f172a" }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.cell, { flex: 0.6, textAlign: "center", fontWeight: "600", color: "#64748b" }]}>
                      {item.qty}
                    </Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "right", color: "#64748b", fontWeight: "500" }]}>
                      {item.price.toFixed(0)}
                    </Text>
                    <Text style={[styles.cell, { flex: 1.2, textAlign: "right", fontWeight: "700", color: "#0f172a" }]}>
                      ETB {(item.price * item.qty).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Core Checkout & Invoicing Summary Block */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💵 Transaction Overview</Text>
            
            {/* Focal Point Total Box */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Grand Total Due</Text>
              <Text style={styles.amountValue}>ETB {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>ETB {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>VAT / Tax (15%)</Text>
                <Text style={styles.summaryValue}>ETB {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Payment Method</Text>
            <View style={styles.methodGrid}>
              {["Cash", "Telebirr", "Card"].map((mode) => {
                const isActive = paymentMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.methodBtn, isActive && styles.methodActive]}
                    onPress={() => setPaymentMode(mode)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.methodText, isActive && styles.methodTextActive]}>
                      {mode === "Telebirr" ? "📱 " : mode === "Card" ? "💳 " : "💵 "}
                      {mode}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* High-Contrast Finalization Button */}
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
    backgroundColor: "#ffffff",
  },
  scroll: { 
    flex: 1, 
    backgroundColor: "#f8fafc",
  },
  container: { 
    padding: 20, 
    paddingBottom: 40, 
  },

  /* Premium Header Matrix */
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1.5,
    borderBottomColor: "#f1f5f9",
    ...Platform.select({
      ios: { paddingTop: 12 },
      android: { marginTop: 40 }
    })
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    marginLeft: 14,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  statusDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: "#2ecc71", // Vibrant emerald indicator
    marginRight: 6 
  },
  statusText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  
  /* Modern Clean Logout Element */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2", // Ultra-light subtle crimson red block tint
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  logoutIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ef4444", // Clean soft operational red text
  },

  /* Unified Form Card Shells */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: "800", 
    color: "#475569", 
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16 
  },

  /* Input and Camera Blocks */
  btnScan: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  btnScanText: { 
    color: "#475569", 
    fontWeight: "700",
    fontSize: 14,
  },
  manualGroup: { 
    flexDirection: "row", 
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapperFocused: {
    borderColor: "#0056b3",
    backgroundColor: "#ffffff",
  },
  inputIcon: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    height: "100%",
  },
  btnAdd: {
    backgroundColor: "rgba(0, 86, 179, 0.06)", // Tertiary style matching your layout framework
    borderWidth: 1.5,
    borderColor: "#0056b3",
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: "center",
  },
  btnAddText: { 
    color: "#0056b3", 
    fontWeight: "700",
    fontSize: 14,
  },

  /* Cart Layout Structures */
  table: {
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e2e8f0",
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 14,
  },
  cell: { 
    fontSize: 14, 
    color: "#334155",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: { 
    fontSize: 14, 
    color: "#64748b", 
    fontWeight: "700",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },

  /* Grand Total Summary Window */
  amountBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
  },
  amountLabel: { 
    fontSize: 11, 
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  amountValue: { 
    fontSize: 26, 
    fontWeight: "900", 
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  summaryContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 14,
    marginBottom: 4,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValue: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Payment Selection Framework */
  methodGrid: { 
    flexDirection: "row", 
    gap: 10,
    marginBottom: 4,
  },
  methodBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  methodActive: { 
    backgroundColor: "rgba(0, 86, 179, 0.04)", 
    borderColor: "#0056b3",
  },
  methodText: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#475569",
  },
  methodTextActive: { 
    color: "#0056b3",
  },

  /* Premium Complete Transaction Button */
  btnFinish: {
    backgroundColor: "#2ecc71", // Clean operational emerald checkout color
    height: 54,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2ecc71",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnFinishText: { 
    color: "#ffffff", 
    fontWeight: "800", 
    fontSize: 16,
  },
});