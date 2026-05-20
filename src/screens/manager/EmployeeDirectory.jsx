import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function EmployeeDirectory({ navigation }) {
  // Demo data (replace with API/DB fetch)
  const team = [
    { name: "Abebe Kebede", phone: "+251 911 223344", status: "active" },
    { name: "Sara Mohammed", phone: "+251 912 556677", status: "active" },
    { name: "John Doe", phone: "+251 913 889900", status: "inactive" },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.headerTitle}>Staff Directory</Text>
      </View>

      {/* Table Card */}
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Employee Name</Text>
          <Text style={[styles.th, { flex: 2 }]}>Phone Number</Text>
          <Text style={[styles.th, { flex: 1 }]}>Status</Text>
        </View>

        {team.length === 0 ? (
          <Text style={styles.emptyRow}>No staff found for this role.</Text>
        ) : (
          team.map((emp, index) => (
            <View
              key={index}
              style={[
                styles.tr,
                emp.status !== "active" ? styles.offlineRow : null,
              ]}
            >
              <Text style={[styles.td, { flex: 2, fontWeight: "700" }]}>
                {emp.name}
              </Text>
              <Text style={[styles.td, { flex: 2 }]}>{emp.phone}</Text>
              <Text
                style={[
                  styles.td,
                  { flex: 1 },
                  emp.status === "active"
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}
              >
                ● {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  container: {

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingLeft: 20,
    gap: 12,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0056b3",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  th: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tr: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  td: {
    fontSize: 13,
    color: "#334155",
  },
  emptyRow: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    color: "#666",
  },
  offlineRow: {
    opacity: 0.65,
    backgroundColor: "#f8f9fa",
  },
  statusActive: {
    color: "#16a34a",
    fontWeight: "700",
  },
  statusInactive: {
    color: "#dc2626",
    fontWeight: "700",
  },
  btnSmall: {
    backgroundColor: "#3498db",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnSmallText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
