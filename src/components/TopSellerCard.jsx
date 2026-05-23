import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0]?.toUpperCase() ?? "?";
};

/**
 * TopSellerCard
 * Props:
 *  - seller:       { name, status, total_sales }
 *  - sharePercent: string  e.g. "42.5"
 *  - onViewTeam:   () => void
 *  - loading:      bool (optional)
 */
export default function TopSellerCard({ seller, sharePercent, onViewTeam, loading = false }) {
  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>🏆 Today's Top Seller</Text>
        </View>
        <View style={styles.skeletonRow}>
          <View style={styles.skeletonAvatar} />
          <View style={{ flex: 1, gap: 8 }}>
            <View style={[styles.skeletonLine, { width: "60%" }]} />
            <View style={[styles.skeletonLine, { width: "40%" }]} />
          </View>
        </View>
      </View>
    );
  }

  if (!seller) return null;

  const isActive = seller.status === "active";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.sectionTitle}>🏆 Today's Top Seller</Text>
        <TouchableOpacity activeOpacity={0.6} onPress={onViewTeam}>
          <Text style={styles.viewAllLink}>View Team</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileRow}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(seller.name)}</Text>
        </View>

        {/* Name & Status */}
        <View style={styles.identityContainer}>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, isActive ? styles.dotGreen : styles.dotGray]} />
            <Text style={styles.statusLabel}>{isActive ? "On Duty" : "Offline"}</Text>
          </View>
        </View>

        {/* Revenue */}
        <View style={styles.revenueContainer}>
          <Text style={styles.salesSubLabel}>Revenue</Text>
          <Text style={styles.salesValue}>
            ETB {seller.total_sales.toLocaleString()}
          </Text>
          <Text style={styles.contributionText}>{sharePercent}% of shift</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#0056b3",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle:  { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  viewAllLink:   { fontSize: 13, fontWeight: "700", color: "#0056b3" },
  profileRow:    { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText:         { fontSize: 15, fontWeight: "700", color: "#0056b3" },
  identityContainer:  { flex: 1.2 },
  sellerName:         { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusDot:    { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  dotGreen:     { backgroundColor: "#2ecc71" },
  dotGray:      { backgroundColor: "#94a3b8" },
  statusLabel:  { fontSize: 11, fontWeight: "600", color: "#64748b" },
  revenueContainer: { flex: 1, alignItems: "flex-end" },
  salesSubLabel:    { fontSize: 11, fontWeight: "600", color: "#64748b" },
  salesValue:       { fontSize: 16, fontWeight: "800", color: "#0f172a", marginTop: 2 },
  contributionText: { fontSize: 11, fontWeight: "600", color: "#2ecc71", marginTop: 2 },

  // Skeleton
  skeletonRow:   { flexDirection: "row", alignItems: "center", gap: 14 },
  skeletonAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#e2e8f0" },
  skeletonLine:   { height: 14, borderRadius: 7, backgroundColor: "#e2e8f0" },
});