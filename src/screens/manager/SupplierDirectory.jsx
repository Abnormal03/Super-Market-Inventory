import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl, // ─── Added for Pull-to-Refresh
} from "react-native";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase.js";

// ─── Supabase Fetch Logic 

async function fetchSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*, categories (category_name)"); // Fetches the directly linked category row

  if (error) {
    throw error.message;
  }

  if (data) {
    return data.map((supplier) => ({
      ...supplier,
      // Fallback cleanly to "Uncategorized" if no category id is linked
      categories: supplier.categories?.category_name || "Uncategorized",
    }));
  }
  return [];
}

// ─── Main Component ────────

export default function SupplierDirectory({ navigation }) {
  const [suppliers, setSuppliers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ─── Added Refresh State

  // Menu Modal State Trackers
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const sups = await fetchSuppliers();
      setSuppliers(sups);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Pull-to-Refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const sups = await fetchSuppliers();
      setSuppliers(sups);
    } catch (err) {
      setError(err);
    } finally {
      setRefreshing(false);
    }
  };

  // ─── Row Action Core Operations 

  const handleCall = (phone) => {
    setMenuVisible(false);
    if (!phone) return Alert.alert("Error", "No phone number available.");
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    setMenuVisible(false);
    if (!email) return Alert.alert("Error", "No email address available.");
    Linking.openURL(`mailto:${email}`);
  };

  const handleDeleteSupplier = (supplier) => {
    setMenuVisible(false);
    
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove "${supplier.supplier_name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error: deleteErr } = await supabase
                .from("suppliers")
                .delete()
                .eq("id", supplier.id);

              if (deleteErr) throw deleteErr;

              // Locally remove from state array immediately
              setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id));
            } catch (err) {
              Alert.alert("Delete failed", err.message);
            }
          },
        },
      ]
    );
  };

  const openActionMenu = (supplier) => {
    setSelectedSupplier(supplier);
    setMenuVisible(true);
  };

  return (
    <ScrollView 
      style={styles.scroll} 
      contentContainerStyle={styles.container}
      // Configures native pull-down refresh behavior
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
          colors={["#0056b3"]} // Android loading spinner color
          tintColor="#0056b3"  // iOS loading spinner color
        />
      }
    >
      {/* Header (BackButton Completely Removed) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supplier Directory</Text>
      </View>
      
      <View style={styles.pageHeader}>
        <Text style={styles.headerSubtitle}>
          Manage your vendor relationships and procurement contacts. Pull down the screen to reload latest data.
        </Text>
      </View>

      {/* Table Card */}
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 3 }]}>Company / Contact</Text>
          <Text style={[styles.th, { flex: 2 }]}>Category</Text>
          <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Actions</Text>
        </View>

        {/* Table Body Loading / Error States */}
        {loading && !refreshing && <ActivityIndicator style={{ margin: 20 }} color="#0056b3" />}

        {!loading && (!suppliers || suppliers?.length === 0) ? (
          <Text style={styles.emptyRow}>
            {error ? "Error happened while fetching suppliers!" : "No suppliers registered yet."}
          </Text>
        ) : (
          suppliers?.map((sup) => (
            <View key={sup.id} style={styles.tr}>
              {/* Identity Details Block */}
              <View style={{ flex: 3 }}>
                <Text style={styles.primaryText} numberOfLines={1}>
                  {sup.supplier_name}
                </Text>
                <Text style={styles.subText} numberOfLines={1}>
                  {sup.contact_person || "No contact name"}
                </Text>
              </View>

              {/* Category Metadata Tag Column */}
              <View style={{ flex: 2, alignItems: "flex-start" }}>
                <View style={styles.badgeWrapper}>
                  <Text style={styles.categoryBadge} numberOfLines={1}>
                    {sup.categories}
                  </Text>
                </View>
              </View>

              {/* Three-Dot Context Trigger Button */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.btnActionTrigger}
                  onPress={() => openActionMenu(sup)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.actionTriggerText}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Button
        text="+ New Supplier"
        variant="tertiary"
        onPress={() => navigation.navigate("RegisterSupplier")}
      />

      {/* Popover Action Bottom Sheet Sheet Overlay */}
      <Modal visible={menuVisible} animationType="fade" transparent={true}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuContextTitle}>
              {selectedSupplier?.supplier_name}
            </Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleCall(selectedSupplier?.phone)}
            >
              <Text style={styles.menuItemText}>📞 Call Provider ({selectedSupplier?.phone || "N/A"})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleEmail(selectedSupplier?.email)}
            >
              <Text style={styles.menuItemText}>✉️ Send Email Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDestructive]}
              onPress={() => handleDeleteSupplier(selectedSupplier)}
            >
              <Text style={styles.menuItemTextDelete}>🗑️ Remove Supplier Relationship</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCancelBtn}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

// ─── Styles ────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f4f7fb" },
  container: { padding: 10, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 55, marginBottom: 15 },
  pageHeader: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", marginLeft: 5 }, // Reset margins since button is removed
  headerSubtitle: { fontSize: 13, color: "#777", marginTop: 4 },
  
  card: { backgroundColor: "#fff", borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, overflow: "hidden", marginBottom: 40 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f8f9fa", paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: "#eef2f5" },
  th: { color: "#0056b3", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  
  tr: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#f0f4f8" },
  primaryText: { fontSize: 14, fontWeight: "600", color: "#1e293b", marginBottom: 2 },
  subText: { fontSize: 12, color: "#64748b" },
  
  badgeWrapper: { backgroundColor: "#eef2f5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, maxWidth: "95%" },
  categoryBadge: { color: "#475569", fontSize: 11, fontWeight: "600" },
  
  btnActionTrigger: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  actionTriggerText: { fontSize: 18, fontWeight: "bold", color: "#64748b", textAlign: "center" },
  emptyRow: { textAlign: "center", padding: 20, fontSize: 14, color: "#666" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.35)", justifyContent: "flex-end" },
  menuContent: { backgroundColor: "#ffffff", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: Platform.OS === "ios" ? 34 : 20 },
  menuContextTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a", marginBottom: 16, textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingBottom: 10 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  menuItemDestructive: { borderBottomWidth: 0, marginTop: 4 },
  menuItemText: { fontSize: 14, color: "#334155", fontWeight: "500" },
  menuItemTextDelete: { fontSize: 14, color: "#dc2626", fontWeight: "600" },
  menuCancelBtn: { marginTop: 14, backgroundColor: "#f1f5f9", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  menuCancelText: { fontSize: 14, fontWeight: "600", color: "#475569" },
});