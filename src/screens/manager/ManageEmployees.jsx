import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
export default function ManageEmployees({ navigation }) {
  // Example data (replace with API or DB fetch)
  const stats = [
    { role_name: "Cashier", total: 8, icon: "💰" },
    { role_name: "Stock Clerk", total: 5, icon: "📦" },
    { role_name: "Security Guard", total: 4, icon: "🛡️" },
    { role_name: "Management", total: 2, icon: "👔" },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => {}} />
        <Text style={styles.headerTitle}>Staff Management Hub</Text>
      </View>

      {/* Staff Grid */}
      <View style={styles.grid}>
        {stats.map((role, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation?.navigate(
                role.role_name === "Cashier"
                  ? "CashierEmployee"
                  : "DetailedEmployees",
                { role: role.role_name }
              )
            }
          >
            <Text style={styles.icon}>{role.icon}</Text>
            <Text style={styles.cardTitle}>{role.role_name}s</Text>
            <Text style={styles.cardSubtitle}>
              <Text style={{ fontWeight: "bold" }}>{role.total}</Text> Active Staff
            </Text>
            <View style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>View Team</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        text="+ Add New Employee"
        onPress={() => {}}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    padding: 20,
  },
  header: {
    paddingTop: 55,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
    color: "#0056b3",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 30,
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
    transform: [{ translateY: 0 }],
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: "#0056b3",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  btnOutlineText: {
    color: "#0056b3",
    fontWeight: "bold",
    fontSize: 13,
  },
});
