import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ACCENT_COLORS = {
  default: "#64748b",
  blue:    "#3498db",
  orange:  "#f39c12",
  green:   "#2ecc71",
  red:     "#ef4444",
};

const BG_COLORS = {
  default: "#f1f5f9",
  blue:    "#e0f2fe",
  orange:  "#ffedd5",
  green:   "#dcfce7",
  red:     "#fee2e2",
};


export default function StatCard({ title, value, icon, variant = "default", loading = false }) {
  const accent = ACCENT_COLORS[variant] ?? ACCENT_COLORS.default;
  const bg     = BG_COLORS[variant]    ?? BG_COLORS.default;

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {loading ? (
          <View style={styles.skeleton} />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "48%",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  textContainer: { flex: 1, justifyContent: "center" },
  title: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  value: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginTop: 2 },
  skeleton: {
    marginTop: 6,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    width: "70%",
  },
});