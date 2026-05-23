import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from "react-native";
import BackButton from "../../components/BackButton";
import BarcodeScannerModal from "../../components/BarcodeScannerModal"; 
import { supabase } from "../../lib/supabase.js";      
import { useAuth } from "../../context/AuthContext.jsx";

export default function CashierDeskScreen({ navigation }) {
  const [cart, setCart] = useState([]); 
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [focusedInput, setFocusedInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.15; 
  const grandTotal = subtotal + tax;

  //emplyee...
  const { employee, logout } = useAuth();

  const handleAddItemByBarcode = async (scannedBarcode) => {
    const targetBarcode = scannedBarcode?.trim() || manualBarcode.trim();
    if (!targetBarcode) return;

    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("barcode, name, selling_price, quantity")
        .eq("barcode", targetBarcode)
        .single(); 

      if (error || !product) {
        Alert.alert("Product Not Found", "No registered item matches this barcode.");
        return;
      }

      if (product.quantity <= 0) {
        Alert.alert("Out of Stock", `${product.name} has been recorded as 0 remaining units. Please report!`);
        return;
      }

      setCart((currentCart) => {
        const existingItemIndex = currentCart.findIndex((item) => item.barcode === product.barcode);

        if (existingItemIndex > -1) {
          if (currentCart[existingItemIndex].qty >= product.quantity) {
            Alert.alert("Stock Limit Reached", `Only ${product.quantity} items available.`);
            return currentCart;
          }
          const updatedCart = [...currentCart];
          updatedCart[existingItemIndex].qty += 1;
          return updatedCart;
        } else {
          return [...currentCart, {
            barcode: product.barcode,
            name: product.name,
            price: Number(product.selling_price),
            qty: 1,
            maxAvailable: product.quantity 
          }];
        }
      });

      setManualBarcode("");

    } catch (err) {
      console.error(err);
      Alert.alert("System Error", "Failed to reach inventory service.");
    }
  };

  const handleLogout = ()=>{
    logout();
  }

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      Alert.alert("Empty Order", "Add items before completing transaction.");
      return;
    }

    setIsProcessing(true);
    try {
      for (const item of cart) {
        const { data: freshProduct } = await supabase
          .from("products")
          .select("quantity")
          .eq("barcode", item.barcode)
          .single();

        const currentAvailableStock = freshProduct?.quantity || item.maxAvailable;
        const finalCalculatedStock = currentAvailableStock - item.qty;

        const { error: updateError } = await supabase
          .from("products")
          .update({ quantity: finalCalculatedStock })
          .eq("barcode", item.barcode);

        if (updateError) throw updateError;

        const { error: logError } = await supabase
          .from("sales_log")
          .insert({
            cashier_id: employee.id,
            product_barcode: item.barcode,
            quantity_sold: item.qty,
            total_price: item.price * item.qty,
            payment_method: paymentMode,
            sale_date: new Date().toISOString()
          });

        if (logError) throw logError;
      }

      Alert.alert("Success", "Transaction finalized! Stock updated.", [
        { text: "Next Order", onPress: () => setCart([]) }
      ]);

    } catch (err) {
      console.error(err);
      Alert.alert("Transaction Failed", "Could not complete transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{employee.name.split(" ")[0]}'s Desk</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Terminal Active - -  Happy Selling</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Exit Session</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Controls Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.btnScan} 
              activeOpacity={0.75}
              onPress={() => setScannerOpen(true)}
            >
              <Text style={styles.btnScanText}>📷 Open Barcode Scanner Camera</Text>
            </TouchableOpacity>
            
            <View style={styles.manualGroup}>
              <View style={[styles.inputWrapper, focusedInput && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🏷️</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Scan the barcode..." 
                  placeholderTextColor="#94a3b8"
                  value={manualBarcode}
                  onChangeText={setManualBarcode}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  editable={false}

                />
              </View>
              <TouchableOpacity 
                style={styles.btnAdd} 
                onPress={() => handleAddItemByBarcode()}
              >
                <Text style={styles.btnAddText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cart Table Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🛒 Active Cart</Text>
            
            {cart.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Cart is currently empty.</Text>
                <Text style={styles.emptySubtext}>Scan items or enter an SKU to begin.</Text>
              </View>
            ) : (
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "left" }]}>Item Description</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.6, textAlign: "center" }]}>Qty</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Price</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Total</Text>
                </View>

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

          {/* Checkout Block */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💵 Transaction Overview</Text>
            
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
                <Text style={styles.summaryLabel}>VAT / Tax (15%項目)</Text>
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
                  >
                    <Text style={[styles.methodText, isActive && styles.methodTextActive]}>
                      {mode === "Telebirr" ? "📱 " : mode === "Card" ? "💳 " : "💵 "}
                      {mode}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              style={[styles.btnFinish, isProcessing && { backgroundColor: "#94a3b8" }]} 
              onPress={handleCompleteTransaction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnFinishText}>Complete Transaction</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🚨 SAFE TRIGGER: Only loads the code when scannerOpen is true */}
      {scannerOpen && (
        <BarcodeScannerModal
          visible={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onBarcodeScanned={(scannedValue) => {
            handleAddItemByBarcode(scannedValue);
          }}
        />
      )}
    </View>
  );
}

// Keep your existing layout styles exactly as they were at the bottom
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#ffffff", borderBottomWidth: 1.5, borderBottomColor: "#f1f5f9", ...Platform.select({ ios: { paddingTop: 12 }, android: { marginTop: 40 } }) },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitleContainer: { marginLeft: 14 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0f172a", letterSpacing: -0.3 },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2ecc71", marginRight: 6 },
  statusText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  logoutBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fef2f2", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#fee2e2" },
  logoutIcon: { fontSize: 12, marginRight: 6 },
  logoutText: { fontSize: 12, fontWeight: "700", color: "#ef4444" },
  card: { backgroundColor: "#ffffff", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#0f172a", shadowOpacity: 0.04, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: "#e2e8f0" },
  sectionTitle: { fontSize: 12, fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 },
  btnScan: { backgroundColor: "#f1f5f9", borderWidth: 1.5, borderColor: "#e2e8f0", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 14 },
  btnScanText: { color: "#475569", fontWeight: "700", fontSize: 14 },
  manualGroup: { flexDirection: "row", gap: 12 },
  inputWrapper: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 14, height: 48 },
  inputWrapperFocused: { borderColor: "#0056b3", backgroundColor: "#ffffff" },
  inputIcon: { fontSize: 14, marginRight: 8, opacity: 0.8 },
  input: { flex: 1, fontSize: 14, fontWeight: "500", color: "#0f172a", height: "100%" },
  btnAdd: { backgroundColor: "rgba(0, 86, 179, 0.06)", borderWidth: 1.5, borderColor: "#0056b3", paddingHorizontal: 18, borderRadius: 12, justifyContent: "center" },
  btnAddText: { color: "#0056b3", fontWeight: "700", fontSize: 14 },
  table: { marginTop: 2 },
  tableHeaderRow: { flexDirection: "row", paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: "#e2e8f0", marginBottom: 6 },
  tableHeaderCell: { fontSize: 11, fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingVertical: 14 },
  cell: { fontSize: 14, color: "#334155" },
  emptyContainer: { paddingVertical: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#64748b", fontWeight: "700" },
  emptySubtext: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  amountBox: { backgroundColor: "#f8fafc", borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 14, padding: 18, marginBottom: 18, alignItems: "center" },
  amountLabel: { fontSize: 11, color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  amountValue: { fontSize: 26, fontWeight: "900", color: "#0f172a", letterSpacing: -0.5 },
  summaryContainer: { borderBottomWidth: 1.5, borderBottomColor: "#f1f5f9", paddingBottom: 14, marginBottom: 4 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { color: "#64748b", fontSize: 14, fontWeight: "500" },
  summaryValue: { color: "#334155", fontWeight: "700", fontSize: 14 },
  methodGrid: { flexDirection: "row", gap: 10, marginBottom: 4 },
  methodBtn: { flex: 1, backgroundColor: "#ffffff", borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  methodActive: { backgroundColor: "rgba(0, 86, 179, 0.04)", borderColor: "#0056b3" },
  methodText: { fontSize: 13, fontWeight: "700", color: "#475569" },
  methodTextActive: { color: "#0056b3" },
  btnFinish: { backgroundColor: "#2ecc71", height: 54, borderRadius: 14, marginTop: 24, alignItems: "center", justifyContent: "center", shadowColor: "#2ecc71", shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  btnFinishText: { color: "#ffffff", fontWeight: "800", fontSize: 16 }
});