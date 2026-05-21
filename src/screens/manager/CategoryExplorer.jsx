import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";
export default function CategoryExplorer({ navigation }) {
  // Demo data (replace with API/DB fetch)
  const categories = [
    { id: 1, name: "Dairy & Eggs", icon: "🥛", products: 45, units: 1200 },
    { id: 2, name: "Bakery", icon: "🍞", products: 12, units: 310 },
    { id: 3, name: "Beverages", icon: "🥤", products: 88, units: 2450 },
    { id: 4, name: "Produce", icon: "🍎", products: 30, units: 900 },
    { id: 5, name: "Meat", icon: "🍗", products: 20, units: 500 },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Category Explorer</Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>
        Browse supermarket categories with real-time stock insights.
      </Text>
      {/* Category Grid */}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <View key={cat.id} style={styles.card}>
            <View style={styles.iconWrapper}>
              <Text style={styles.icon}>{cat.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{cat.name}</Text>
            <View style={styles.stats}>
              <Text style={styles.statText}>
                <Text style={styles.statValue}>{cat.products}</Text> Products
              </Text>
              <Text style={styles.statText}>
                <Text style={styles.statValue}>{cat.units}</Text> Units
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() =>
                navigation?.navigate("SpecificCategory")
              }
            >
              <Text style={styles.btnOutlineText}>View Items</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "47%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: "#ecf6fc",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    color: "#3498db",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  statText: {
    fontSize: 12,
    color: "#666",
  },
  statValue: {
    fontWeight: "700",
    color: "#333",
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: "#0056b3",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  btnOutlineText: {
    color: "#0056b3",
    fontWeight: "700",
    fontSize: 13,
  },
});
