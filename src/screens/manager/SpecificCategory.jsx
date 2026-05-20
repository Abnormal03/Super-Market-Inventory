import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function SpecificCategory({ navigation, route }) {
  const categoryName = route?.params?.name || "Dairy & Eggs";

  // Demo data (replace with API/DB fetch)
  const products = [
    { name: "Fresh Milk 1L", stock: 120, avgCost: 1.2, status: "healthy" },
    { name: "Greek Yogurt 500g", stock: 4, avgCost: 3.5, status: "urgent" },
    { name: "Orange Juice 1L", stock: 20, avgCost: 2.1, status: "healthy" },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.categoryTitle}>{categoryName}</Text>
      </View>

      {/* Search + Actions */}
      <View style={styles.actions}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation?.navigate("RegisterProduct")}
        >
          <Text style={styles.addBtnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Product Name</Text>
          <Text style={[styles.th, { flex: 1 }]}>Stock</Text>
          <Text style={[styles.th, { flex: 1 }]}>Avg. Cost</Text>
          <Text style={[styles.th, { flex: 1 }]}>Status</Text>
          <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
        </View>

        {filteredProducts.map((p, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              p.status === "urgent" ? styles.urgentRow : null,
            ]}
          >
            <Text style={[styles.td, { flex: 2, fontWeight: "700" }]}>
              {p.name}
            </Text>
            <Text style={[styles.td, { flex: 1 }]}>{p.stock} Units</Text>
            <Text style={[styles.td, { flex: 1 }]}>${p.avgCost.toFixed(2)}</Text>
            <View style={[styles.td, { flex: 1 }]}>
              <Text
                style={[
                  styles.statusPill,
                  p.status === "healthy" ? styles.healthy : styles.urgent,
                ]}
              >
                {p.status === "healthy" ? "In Stock" : "Low Stock"}
              </Text>
            </View>
            <View style={[styles.td, { flex: 1, flexDirection: "row", gap: 8 }]}>
              <TouchableOpacity style={styles.btnView}>
                <Text style={styles.btnViewText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnEdit}>
                <Text style={styles.btnEditText}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7f6",
  },
  container: {
    padding: 20,
    paddingTop: 55,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0056b3",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#0056b3",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#eef2f5",
  },
  th: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0056b3",
    textTransform: "uppercase",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f4f8",
  },
  td: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  urgentRow: {
    backgroundColor: "#fff5f5",
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  healthy: {
    backgroundColor: "#e6fcf5",
    color: "#0ca678",
  },
  urgent: {
    backgroundColor: "#fff5f5",
    color: "#f03e3e",
  },
  btnView: {
    backgroundColor: "#0056b3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnViewText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  btnEdit: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnEditText: {
    fontSize: 12,
    color: "#333",
  },
});
