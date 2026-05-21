import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";

export default function SupplierDirectory({ navigation }) {
  const suppliers = [
    {
      supplier_name: "Abyssinia General Trading",
      contact_person: "Mulugeta",
      categories: "Beverages",
      phone: "+251911234567",
      email: "vendor@example.com",
    },
    {
      supplier_name: "Ethio Dairy",
      contact_person: "Sara",
      categories: "Dairy & Produce",
      phone: "+251912345678",
      email: "ethio@example.com",
    },
  ];

  const handleCall = (phone) => Linking.openURL(`tel:${phone}`);
  const handleEmail = (email) => Linking.openURL(`mailto:${email}`);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supplier Directory</Text>
      </View>
      <View style={styles.pageHeader}>
        <Text style={styles.headerSubtitle}>
          Manage your vendor relationships and procurement contacts.
        </Text>
      </View>

      {/* Table Card */}
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Company Name</Text>
          <Text style={[styles.th, { flex: 2 }]}>Contact Person</Text>
          <Text style={[styles.th, { flex: 2 }]}>Categories</Text>
          <Text style={[styles.th, { flex: 1 }]}>Phone</Text>
          <Text style={[styles.th, { flex: 2, paddingLeft: 30 }]}>Email</Text>
        </View>

        {/* Table Body */}
        {suppliers.length === 0 ? (
          <Text style={styles.emptyRow}>No suppliers registered yet.</Text>
        ) : (
          suppliers.map((sup, index) => (
            <View key={index} style={styles.tr}>
              <Text style={[styles.td, { flex: 2, fontWeight: "700" }]}>
                {sup.supplier_name}
              </Text>
              <Text style={[styles.td, { flex: 2 }]}>{sup.contact_person}</Text>
              <Text style={[styles.td, { flex: 2 }]}>
                <Text style={styles.categoryBadge}>
                  {sup.categories || "Uncategorized"}
                </Text>
              </Text>

              {/* Call Button */}
              <View style={[styles.td, { flex: 1, alignItems: "center" }]}>
                <TouchableOpacity
                  style={styles.btnCall}
                  onPress={() => handleCall(sup.phone)}
                >
                  <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>
              </View>

              {/* Email Button */}
              <View style={[styles.td, { flex: 2, alignItems: "flex-end" }]}>
                <TouchableOpacity
                  style={styles.btnEmail}
                  onPress={() => handleEmail(sup.email)}
                >
                  <Text style={styles.btnText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Button text="+ New Supplier" onPress={() => navigation.navigate("RegisterSupplier")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  container: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    marginBottom: 15,
  },
  pageHeader: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0056b3",
    marginLeft: 15,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#eef2f5",
  },
  th: {
    color: "#0056b3",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tr: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f4f8",
  },
  td: {
    fontSize: 13,
    color: "#333",
  },
  emptyRow: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    color: "#666",
  },
  categoryBadge: {
    backgroundColor: "#eef2f5",
    color: "#555",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "500",
  },
  btnCall: {
    backgroundColor: "#16a34a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 55,
    alignItems: "center",
  },
  btnEmail: {
    backgroundColor: "#3498db",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
