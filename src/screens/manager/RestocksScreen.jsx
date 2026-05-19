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
import BackButton from "../../components/BackButton";

export default function RestockScreen() {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => {}} />
          <Text style={styles.headerTitle}>New Stock Entry</Text>
        </View>
        <View style={styles.headerdescription}>
          <Text style={styles.headerSubtitle}>
            Register a new product or add a batch.
          </Text>
        </View>

        {/* Product Identity Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🆔 Product Identity</Text>

          <Text style={styles.label}>Barcode</Text>
          <TextInput
            style={styles.input}
            placeholder="Scan Barcode"
            value={barcode}
            onChangeText={setBarcode}
          />

          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Coca Cola 500ml"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Selling Price</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={sellingPrice}
            onChangeText={setSellingPrice}
          />
        </View>

        {/* Batch Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Batch Details</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Cost per Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={costPrice}
                onChangeText={setCostPrice}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Arrival Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={arrivalDate}
                onChangeText={setArrivalDate}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Clear Form</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Complete Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    paddingTop: 60,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingLeft: 5,
  },
  headerdescription: {
    marginBottom: 30,
    paddingLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eef2f5",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 20,
  },
  btnPrimary: {
    backgroundColor: "#0056b3",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnSecondaryText: {
    color: "#666",
    fontSize: 14,
  },
});
