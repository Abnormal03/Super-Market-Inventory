import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function ProfileScreen({ navigation }) {
  // Demo data (replace with API/DB fetch)
  const account = {
    name: "Abebe Kebede",
    role: "Manager",
    username: "abebe123",
    phone: "+251 911 223344",
    status: "Active",
    id: 42,
  };

  const initial = account.name.charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.headerTitle}>Account Details</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text
            style={[
              styles.statusBadge,
              account.status === "Active" ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            {account.status}
          </Text>
        </View>

        {/* Name + Role */}
        <View style={styles.metaHeader}>
          <Text style={styles.name}>{account.name}</Text>
          <Text
            style={[
              styles.roleTag,
              account.role === "Manager" ? styles.managerTag : styles.cashierTag,
            ]}
          >
            {account.role}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Username</Text>
            <Text style={styles.detailValue}>@{account.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{account.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>System ID</Text>
            <Text style={styles.detailValue}>#EMP-{String(account.id).padStart(4, "0")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Session Status</Text>
            <Text style={[styles.detailValue, styles.connected]}>Connected</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { padding: 20, paddingTop: 55 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", marginLeft: 10 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },

  avatarWrapper: { position: "relative", marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#0f6fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f6fff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#fff" },
  statusBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  activeBadge: { backgroundColor: "#10b981" },
  inactiveBadge: { backgroundColor: "#e74c3c" },

  metaHeader: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 },
  roleTag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    fontSize: 13,
    fontWeight: "600",
  },
  managerTag: { backgroundColor: "rgba(15,111,255,0.08)", color: "#0f6fff" },
  cashierTag: { backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981" },

  divider: { height: 1, backgroundColor: "#f0f4f8", width: "100%", marginVertical: 20 },

  details: { width: "100%", marginBottom: 25 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f4f8",
  },
  detailLabel: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  detailValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
  connected: { color: "#10b981" },

  btnDashboard: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  btnDashboardText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
