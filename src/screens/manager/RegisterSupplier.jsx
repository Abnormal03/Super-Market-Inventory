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
  Alert,
} from "react-native";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase.js";

export default function RegisterSupplier({ navigation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  
  // 👑 CHANGE: Tracks a single selected Category ID string/integer instead of an array
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [dbCategories, setDbCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, category_name")
          .order("category_name", { ascending: true });

        if (error) throw error;
        setDbCategories(data || []);
      } catch (err) {
        console.error("Error loading categories:", err.message);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // 👑 CHANGE: Selects or deselects a single category ID
  const selectCategory = (id) => {
    setSelectedCategoryId((prevId) => (prevId === id ? null : id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a Company Name.");
      return;
    }

    setSaving(true);
    try {
      // 👑 CHANGE: Saves the category_id directly inside the supplier object payload
      const { error: supplierErr } = await supabase
        .from("suppliers")
        .insert({
          supplier_name: name.trim(),
          contact_person: contactPerson.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          notes: notes.trim(),
          category_id: selectedCategoryId, // Directly saves foreign key relation
        });

      if (supplierErr) throw supplierErr;

      Alert.alert("Success", "Supplier registered successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert("Submission Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const onClearAll = () => {
    setName("");
    setAddress("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSelectedCategoryId(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation?.goBack()} />
          <Text style={styles.headerTitle}>Supplier Registration</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Add a new vendor to your network to streamline procurement and
          inventory restocking.
        </Text>

        {/* Company Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🏢</Text>
          <Text style={styles.cardTitle}>Company Profile</Text>

          <Text style={styles.label}>Company Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Abyssinia General Trading"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Business Category</Text>
          <View style={styles.categoryWrapper}>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#0056b3" style={{ padding: 10 }} />
            ) : dbCategories.length === 0 ? (
              <Text style={styles.noCategoriesText}>No categories found in database.</Text>
            ) : (
              dbCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryBadge,
                    selectedCategoryId === cat.id && styles.categorySelected,
                  ]}
                  onPress={() => selectCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategoryId === cat.id && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.category_name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <Text style={styles.label}>Office Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Bole, Addis Ababa, Ethiopia"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>📞</Text>
          <Text style={styles.cardTitle}>Primary Contact Details</Text>

          <Text style={styles.label}>Contact Person Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={contactPerson}
            onChangeText={setContactPerson}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+251925142512"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="vendor@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Notes / Logistics Info</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Delivery schedules, lead times, etc."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        {/* Actions - Equal 50/50 Split Grid Row */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={onClearAll}
            disabled={saving}
          >
            <Text style={styles.btnSecondaryText}>Clear</Text>
          </TouchableOpacity>
          
          <View style={styles.btnPrimaryWrapper}>
            <Button 
              text={saving ? "Saving..." : "Save"} 
              onPress={handleSave} 
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f4f7f6" },
  container: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#0056b3" },
  headerSubtitle: { fontSize: 14, color: "#666", marginBottom: 25, paddingLeft: 5 },
  
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, borderWidth: 1, borderColor: "#eef2f5" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 15 },
  cardIcon: { backgroundColor: "#e7f0fd", width: 50, height: 50, borderRadius: 25, textAlign: "center", lineHeight: 50, fontSize: 20, marginBottom: 12 },
  
  label: { fontSize: 12, fontWeight: "600", color: "#444", marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: "#F9F9F9", color: "#333" },
  
  categoryWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  categoryBadge: { backgroundColor: "#eef2f5", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  categorySelected: { backgroundColor: "#0056b3" },
  categoryText: { fontSize: 12, color: "#555", fontWeight: "500" },
  categoryTextSelected: { color: "#fff", fontWeight: "600" },
  noCategoriesText: { fontSize: 13, color: "#94a3b8", padding: 4 },
  
  actions: { flexDirection: "row", width: "100%", gap: 12, marginTop: 20 },
  btnSecondary: { flex: 1, backgroundColor: "#f8f9fa", paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", alignItems: "center", justifyContent: "center" },
  btnSecondaryText: { color: "#475569", fontWeight: "700", fontSize: 14 },
  btnPrimaryWrapper: { flex: 1 }
});