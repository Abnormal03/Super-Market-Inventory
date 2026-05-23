import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * CategoryCard
 * Props:
 *  - name:      string
 *  - icon:      emoji string
 *  - products:  number
 *  - units:     number
 *  - onPress:   () => void  — View Items
 *  - loading:   bool (optional)
 */
export default function CategoryCard({ name, icon, products, units, onPress, loading = false }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{name}</Text>

      {loading ? (
        <View style={styles.skeletonStats}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      ) : (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{units}</Text>
            <Text style={styles.statLabel}>Units</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.btnText}>View Items →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "47%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderTopWidth: 3,
    borderTopColor: "#0056b3",
  },
  iconWrapper: {
    backgroundColor: "#eff6ff",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  icon:      { fontSize: 30 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#1e293b", marginBottom: 12, textAlign: "center" },

  stats:        { flexDirection: "row", alignItems: "center", marginBottom: 14, width: "100%" },
  statItem:     { flex: 1, alignItems: "center" },
  statValue:    { fontSize: 16, fontWeight: "800", color: "#0056b3" },
  statLabel:    { fontSize: 11, color: "#94a3b8", fontWeight: "500", marginTop: 2 },
  statDivider:  { width: 1, height: 28, backgroundColor: "#e2e8f0" },

  btn:     { backgroundColor: "#eff6ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, width: "100%", alignItems: "center" },
  btnText: { color: "#0056b3", fontWeight: "700", fontSize: 13 },

  // Skeleton
  skeletonStats: { width: "100%", gap: 6, marginBottom: 14 },
  skeletonLine:  { height: 14, borderRadius: 6, backgroundColor: "#e2e8f0", width: "70%", alignSelf: "center" },
});