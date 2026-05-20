import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";

export default function RegisterSupplier({ navigation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState([]);

  const availableCategories = [
    "Dairy & Produce",
    "Beverages",
    "Bakery Supplies",
    "Dry Goods",
    "Cleaning Agents",
  ];

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
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

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Abyssinia General Trading"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Business Categories</Text>
          <View style={styles.categoryWrapper}>
            {availableCategories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.categoryBadge,
                  categories.includes(cat) && styles.categorySelected,
                ]}
                onPress={() => toggleCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    categories.includes(cat) && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
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
            placeholder="+251..."
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

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => {
              setName("");
              setContactPerson("");
              setPhone("");
              setEmail("");
              setNotes("");
            }}
          >
            <Text style={styles.btnSecondaryText}>Clear</Text>
          </TouchableOpacity>
          <Button text="Save" onPress={() => {}} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7f6",
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    paddingLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eef2f5",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  cardIcon: {
    backgroundColor: "#e7f0fd",
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: "center",
    lineHeight: 50,
    fontSize: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: "#eef2f5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categorySelected: {
    backgroundColor: "#0056b3",
  },
  categoryText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  btnSecondary: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnSecondaryText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});
