import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "../../components/BackButton";
import { supabase } from "../../lib/supabase";
import BarcodeScannerModal from "../../components/BarcodeScannerModal";

// ─── Validation ───────────────────────────────────────────────────────────────

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validate({ barcode, name, sellingPrice, category_id, quantity, costPrice, arrivalDate, expiryDate }) {
  const errors = {};
  
  if (!barcode.trim())           errors.barcode      = "Barcode is required.";
  if (!name.trim())              errors.name         = "Product name is required.";
  
  if (!sellingPrice.trim())         errors.sellingPrice = "Selling price is required.";
  else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0)
                                    errors.sellingPrice = "Enter a valid price.";

  if (!quantity.trim())             errors.quantity     = "Quantity is required.";
  else if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0)
                                    errors.quantity     = "Enter a valid whole number.";

  if (!costPrice.trim())            errors.costPrice    = "Cost price is required.";
  else if (isNaN(Number(costPrice)) || Number(costPrice) <= 0)
                                    errors.costPrice = "Enter a valid cost price.";

  if (!category_id)                 errors.category_id  = "Category is a required input!";

  if (!arrivalDate.trim())          errors.arrivalDate  = "Arrival date is required.";
  else if (!DATE_REGEX.test(arrivalDate))
                                    errors.arrivalDate  = "Use format YYYY-MM-DD.";

  const todayStr = new Date().toISOString().split("T")[0]; 

  if (!expiryDate.trim()) {
    errors.expiryDate = "Expiry date is required.";
  } else if (!DATE_REGEX.test(expiryDate)) {
    errors.expiryDate = "Use format YYYY-MM-DD.";
  } else if (expiryDate < todayStr) {
    errors.expiryDate = "Expiry date must be today or a future date.";
  } else if (expiryDate <= arrivalDate) {
    errors.expiryDate = "Expiry must be after arrival date.";
  }

  return errors;
}

// ─── Supabase Logic ───────────────────────────────────────────────────────────

async function submitRestock({ barcode, name, sellingPrice, category_id, quantity, costPrice, arrivalDate, expiryDate }) {
  const qty = Number(quantity);
  const selling = Number(sellingPrice);
  const cost = Number(costPrice);

  const { data: existing, error: fetchErr } = await supabase
    .from("products")
    .select("barcode, quantity")
    .eq("barcode", barcode.trim())
    .maybeSingle();

  if (fetchErr) throw fetchErr;

  if (existing) {
    const { error: updateErr } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        selling_price: selling,
        category_id: category_id, 
        quantity: existing.quantity + qty,
      })
      .eq("barcode", barcode.trim());

    if (updateErr) throw updateErr;
  } else {
    const { error: insertErr } = await supabase
      .from("products")
      .insert({
        barcode: barcode.trim(),
        name: name.trim(),
        selling_price: selling,
        category_id: category_id,
        quantity: qty,
      });

    if (insertErr) throw insertErr;
  }

  const { error: batchErr } = await supabase
    .from("stock_batches")
    .insert({
      product_barcode: barcode.trim(),
      quantity: qty,
      cost_price: cost,
      arrival_date: arrivalDate,
      expiry_date: expiryDate,
    });

  if (batchErr) throw batchErr;
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}


// Default values point arrival dates directly to today automatically
const getTodayString = () => new Date().toISOString().split("T")[0];

const EMPTY = {
  barcode: "", name: "", sellingPrice: "", category_id: "",
  quantity: "", costPrice: "", arrivalDate: getTodayString(), expiryDate: "",
};

export default function RestockScreen({ navigation }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [scannerOpen, setScannerOpen] = useState(false);

  // Category State
  const [categories, setCategories] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);


  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);


  useEffect(()=>{
    if (success) {
      Alert.alert("Success", "✅ Stock entry saved successfully!");
      setSuccess(false);
      navigation.goBack();

    }
  },[success])

  async function loadCategories() {
    try {
      setCategoryLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name")
        .order("category_name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error("Error pulling categories:", err.message);
    } finally {
      setCategoryLoading(false);
    }
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ category_name: newCategoryName.trim() })
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) => [...prev, data].sort((a, b) => a.category_name.localeCompare(b.category_name)));
      setForm((prev) => ({ ...prev, category_id: data.id }));
      setNewCategoryName("");
      setDropdownVisible(false);
      if (errors.category_id) setErrors((prev) => ({ ...prev, category_id: undefined }));
    } catch (err) {
      Alert.alert("Error creating category", err.message);
    } finally {
      setIsCreatingCategory(false);
    }
  }

  const set = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onClear = () => {
    setForm(EMPTY);
    setErrors({});
    setSuccess(false);
    setSubmitError(null);
  };

  const handleEntry = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      await submitRestock(form);
      setSuccess(true);
      setForm(EMPTY);
      setErrors({});
    } catch (err) {
      console.error("Restock error:", err.message);
      setSubmitError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Unified Picker Event Handlers
  const onChangeArrivalDate = (event, selectedDate) => {
    setShowArrivalPicker(false); // Close overlay layer
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      set("arrivalDate")(formatted);
    }
  };

  const onChangeExpiryDate = (event, selectedDate) => {
    setShowExpiryPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      set("expiryDate")(formatted);
    }
  };

  const selectedCategoryLabel = categories.find(c => c.id === form.category_id)?.category_name || "Select a Category";

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>New Stock Entry</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Register a new product or add a batch to an existing one.
        </Text>

        {/* Success Banner
        {success && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>✅ Stock entry saved successfully!</Text>
          </View>
        )} */}

        {/* Submit Error Banner */}
        {submitError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {submitError}</Text>
          </View>
        )}

        {/* Product Identity Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🆔 Product Identity</Text>

          <View>
            <Field label="Barcode" error={errors.barcode}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.input, 
                    styles.disabledInput, 
                    errors.barcode && styles.inputError,
                    { flex: 1 }
                  ]}
                  placeholder="Tap 'Scan' to open camera"
                  placeholderTextColor="#94a3b8"
                  value={form.barcode}
                  editable={false}
                />
                <TouchableOpacity 
                  style={styles.btnScan} 
                  onPress={() => setScannerOpen(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnScanText}>📷 Scan</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <BarcodeScannerModal 
              visible={scannerOpen}
              onClose={() => setScannerOpen(false)}
              onBarcodeScanned={(scannedValue) => {
                set("barcode")(scannedValue);
              }}
            />
          </View>

          <Field label="Product Name" error={errors.name}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g. Coca Cola 500ml"
              value={form.name}
              onChangeText={set("name")}
            />
          </Field>

          <Field label="Category" error={errors.category_id}>
            <TouchableOpacity
              style={[styles.input, styles.dropdownTrigger, errors.category_id && styles.inputError]}
              onPress={() => setDropdownVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={{ color: form.category_id ? "#0f172a" : "#94a3b8", fontSize: 14 }}>
                {selectedCategoryLabel}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </Field>

          <Field label="Selling Price (ETB)" error={errors.sellingPrice}>
            <TextInput
              style={[styles.input, errors.sellingPrice && styles.inputError]}
              placeholder="0.00"
              keyboardType="numeric"
              value={form.sellingPrice}
              onChangeText={set("sellingPrice")}
            />
          </Field>
        </View>

        {/* Batch Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Batch Details</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Field label="Quantity" error={errors.quantity}>
                <TextInput
                  style={[styles.input, errors.quantity && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.quantity}
                  onChangeText={set("quantity")}
                />
              </Field>
            </View>
            <View style={styles.col}>
              <Field label="Cost per Unit (ETB)" error={errors.costPrice}>
                <TextInput
                  style={[styles.input, errors.costPrice && styles.inputError]}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={form.costPrice}
                  onChangeText={set("costPrice")}
                />
              </Field>
            </View>
          </View>

          <View style={styles.row}>
            {/* 👑 Interactive Arrival Date Selector Container */}
            <View style={styles.col}>
              <Field label="Arrival Date" error={errors.arrivalDate}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerTrigger, errors.arrivalDate && styles.inputError]}
                  onPress={() => setShowArrivalPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.datePickerText}>
                    {form.arrivalDate || "Select Date"}
                  </Text>
                  <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
              </Field>
            </View>

            {/* 👑 Interactive Expiry Date Selector Container */}
            <View style={styles.col}>
              <Field label="Expiry Date" error={errors.expiryDate}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerTrigger, errors.expiryDate && styles.inputError]}
                  onPress={() => setShowExpiryPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.datePickerText}>
                    {form.expiryDate || "Select Date"}
                  </Text>
                  <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
              </Field>
            </View>
          </View>
        </View>

        {/* Action Controls Footer */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSecondary} onPress={onClear} disabled={loading}>
            <Text style={styles.btnSecondaryText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleEntry}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>Complete Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Render Conditionals for Date Picker Modules ─── */}
      {showArrivalPicker && (
        <DateTimePicker
          value={form.arrivalDate ? new Date(form.arrivalDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={onChangeArrivalDate}
        />
      )}

      {showExpiryPicker && (
        <DateTimePicker
          value={form.expiryDate ? new Date(form.expiryDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={onChangeExpiryDate}
        />
      )}

      {/* Categories Dropdown Modal */}
      <Modal visible={dropdownVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>

            {categoryLoading ? (
              <ActivityIndicator size="small" color="#0056b3" style={{ padding: 20 }} />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.categoryItem, item.id === form.category_id && styles.categoryItemSelected]}
                    onPress={() => {
                      set("category_id")(item.id);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.categoryItemText, item.id === form.category_id && styles.categoryItemTextSelected]}>
                      {item.category_name}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.listContainer}
              />
            )}

            <View style={styles.createWrapper}>
              <TextInput
                style={styles.modalInlineInput}
                placeholder="Create new category..."
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity 
                style={styles.btnCreateInline} 
                onPress={handleCreateCategory}
                disabled={isCreatingCategory}
              >
                {isCreatingCategory ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnCreateInlineText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll:     { flex: 1, backgroundColor: "#f8fafc" },
  container: { paddingTop: 60, padding: 20, paddingBottom: 40 },
  header:         { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 6 },
  headerTitle:    { fontSize: 22, fontWeight: "bold", color: "#0056b3" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginBottom: 24, paddingLeft: 4 },
  successBanner: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0", borderRadius: 10, padding: 14, marginBottom: 16 },
  successText: { fontSize: 14, fontWeight: "600", color: "#16a34a" },
  errorBanner: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 14, marginBottom: 16 },
  errorBannerText: { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, borderWidth: 1, borderColor: "#eef2f5" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f0f4f8", paddingBottom: 10 },
  fieldWrapper: { marginBottom: 4 },
  label:        { fontSize: 12, fontWeight: "600", color: "#475569", marginBottom: 6, marginTop: 10, textTransform: "uppercase", letterSpacing: 0.4 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, backgroundColor: "#f8fafc", color: "#0f172a" },
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  dropdownTrigger: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dropdownArrow: { fontSize: 10, color: "#64748b" },
  
  // 👑 Date Picker Custom Styling Elements
  datePickerTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  datePickerText: {
    fontSize: 14,
    color: "#0f172a",
  },
  calendarIcon: {
    fontSize: 14,
    opacity: 0.7,
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#ffffff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "75%", paddingHorizontal: 24, paddingVertical: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  closeBtnText: { color: "#0056b3", fontSize: 14, fontWeight: "600" },
  listContainer: { marginBottom: 16 },
  categoryItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  categoryItemSelected: { backgroundColor: "#f0f7ff" },
  categoryItemText: { fontSize: 15, color: "#334155" },
  categoryItemTextSelected: { fontWeight: "600", color: "#0056b3" },
  createWrapper: { flexDirection: "row", gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
  modalInlineInput: { flex: 1, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#f8fafc" },
  btnCreateInline: { backgroundColor: "#0056b3", justifyContent: "center", paddingHorizontal: 20, borderRadius: 8 },
  btnCreateInlineText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  btnPrimary: { backgroundColor: "#0056b3", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, minWidth: 140, alignItems: "center" },
  btnPrimaryText:   { color: "#fff", fontWeight: "700", fontSize: 14 },
  btnDisabled:      { backgroundColor: "#93c5fd" },
  btnSecondary: { backgroundColor: "#f8fafc", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  btnSecondaryText: { color: "#64748b", fontSize: 14, fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%" },
  disabledInput: { backgroundColor: "#f8fafc", color: "#334155" },
  btnScan: { backgroundColor: "#0056b3", paddingHorizontal: 16, height: 48, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  btnScanText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  inputError: { borderColor: "#dc2626", backgroundColor: "#fff5f5" },
  fieldError:  { fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: "500" },
});