import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import CategoryCard from "../../components/CategoryCard";


const ICON_MAP = [
  { keywords: ["dairy", "egg", "milk"],          icon: "🥛" },
  { keywords: ["bak", "bread", "pastry"],        icon: "🍞" },
  { keywords: ["bever", "drink", "juice", "soda"], icon: "🥤" },
  { keywords: ["produce", "fruit", "veg"],       icon: "🍎" },
  { keywords: ["meat", "poult", "chicken"],      icon: "🍗" },
  { keywords: ["snack", "chip", "crisp"],        icon: "🍿" },
  { keywords: ["frozen"],                        icon: "🧊" },
  { keywords: ["clean", "detergents", "hygiene"],    icon: "🧴" },
  { keywords: ["candy", "sweet", "chocol"],      icon: "🍬" },
  { keywords: ["spice", "condiment", "sauce"],   icon: "🌶️" },
  { keywords: ["grain", "rice", "pasta", "cereal"], icon: "🌾" },
  { keywords: ["seafood", "fish"],               icon: "🐟" },
];

export function getCategoryIcon(name = "") {
  const lower = name.toLowerCase();
  for (const entry of ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.icon;
  }
  return "🏷️"; // default
}

// ─── Supabase Queries ─────────────────────────────────────────────────────────

async function fetchCategories() {
  // Fetch categories with product count and total units
  const { data, error } = await supabase
    .from("categories")
    .select("id, category_name, products ( barcode, quantity ) ")
    .order("category_name");

  if (error){
    throw error;
  } 


  return data.map((cat) => ({
    id:       cat.id,
    name:     cat.category_name,
    icon:     getCategoryIcon(cat.category_name),
    products: cat.products?.length ?? 0,
    units:    cat.products?.reduce((sum, p) => sum + (p.quantity ?? 0), 0) ?? 0,
  }));
}

async function addCategory(name) {
  const { error } = await supabase
    .from("categories")
    .insert({ category_name: name.trim() });
  if (error) throw error;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryExplorer({ navigation }) {
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState(null);

  // Add modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName]           = useState("");
  const [nameError, setNameError]       = useState(null);
  const [adding, setAdding]             = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("CategoryExplorer error:", err.message);
      setError("Failed to load categories.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ── Add category ────────────────────────────────────────────────────────────

  const openModal  = () => { setNewName(""); setNameError(null); setModalVisible(true); };
  const closeModal = () => { if (!adding) setModalVisible(false); };

  const handleAdd = async () => {
    if (!newName.trim()) { setNameError("Category name is required."); return; }
    if (newName.trim().length < 2) { setNameError("Name must be at least 2 characters."); return; }

    // Check duplicate locally before hitting DB
    if (categories.some((c) => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      setNameError("A category with this name already exists.");
      return;
    }

    setAdding(true);
    try {
      await addCategory(newName);
      setModalVisible(false);
      await loadData(); // refresh list
    } catch (err) {
      setNameError(err.message || "Failed to add category.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0056b3"]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Category Explorer</Text>
            <Text style={styles.headerSubtitle}>
              Browse supermarket categories with real-time stock insights.
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openModal} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Grid */}
        <View style={styles.grid}>
          {loading
            ? // Skeleton placeholders
              Array.from({ length: 4 }).map((_, i) => (
                <CategoryCard
                  key={i}
                  name="Loading..."
                  icon="⏳"
                  products={0}
                  units={0}
                  loading={true}
                  onPress={() => {}}
                />
              ))
            : categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  icon={cat.icon}
                  products={cat.products}
                  units={cat.units}
                  onPress={() =>
                    navigation.navigate("SpecificCategory", {
                      categoryId:   cat.id,
                      categoryName: cat.name,
                      categoryIcon: cat.icon,
                    })
                  }
                />
              ))}
        </View>

        {!loading && categories.length === 0 && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏷️</Text>
            <Text style={styles.emptyText}>No categories yet.</Text>
            <Text style={styles.emptySubtext}>Tap "+ New" to create the first one.</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <Text style={styles.modalSubtitle}>
              An emoji icon will be assigned automatically based on the name.
            </Text>

            <Text style={styles.modalLabel}>Category Name</Text>
            <View style={styles.modalPreviewRow}>
              <Text style={styles.modalIconPreview}>
                {getCategoryIcon(newName)}
              </Text>
              <TextInput
                style={[styles.modalInput, nameError && styles.modalInputError]}
                placeholder="e.g. Dairy & Eggs"
                value={newName}
                onChangeText={(t) => { setNewName(t); setNameError(null); }}
                autoFocus
              />
            </View>
            {nameError && <Text style={styles.modalFieldError}>{nameError}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closeModal}
                disabled={adding}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, adding && styles.btnDisabled]}
                onPress={handleAdd}
                disabled={adding}
              >
                {adding
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalConfirmText}>Add Category</Text>
                }
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  header:         { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  headerTitle:    { fontSize: 22, fontWeight: "700", color: "#0056b3" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },

  addBtn:     { backgroundColor: "#0056b3", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, marginTop: 4 },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  errorBanner: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:   { fontSize: 13, fontWeight: "600", color: "#dc2626" },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  emptyState:   { alignItems: "center", marginTop: 60 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  emptySubtext: { fontSize: 14, color: "#94a3b8", marginTop: 4 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle:      { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 4 },
  modalSubtitle:   { fontSize: 13, color: "#94a3b8", marginBottom: 20 },
  modalLabel:      { fontSize: 12, fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 },
  modalPreviewRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalIconPreview:{ fontSize: 28, width: 44, textAlign: "center" },
  modalInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  modalInputError:  { borderColor: "#ef4444" },
  modalFieldError:  { fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: "500" },
  modalActions:     { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 24 },
  modalCancelBtn:   { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  modalCancelText:  { color: "#64748b", fontWeight: "600" },
  modalConfirmBtn:  { backgroundColor: "#0056b3", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, minWidth: 120, alignItems: "center" },
  modalConfirmText: { color: "#fff", fontWeight: "700" },
  btnDisabled:      { backgroundColor: "#93c5fd" },
});