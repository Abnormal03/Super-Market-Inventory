import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Animated } from "react-native";

const BORDER_COLORS = {
  total:    "#0056b3",
  sold:     "#2ecc71",
  low:      "#f59e0b",
  out:      "#ef4444",
  expiring: "#f97316",
  expired:  "#e11d48",
};

const ALERT_BG = {
  expiring: "#fff7ed",
  expired:  "#fff1f2",
};

export default function InventoryStatCard({
  title,
  value,
  icon,
  subtitle,
  variant = "total",
  bg = "#f1f5f9",
  isAlert = false,
  loading = false,
  onPress,
  fadeAnim,
  slideAnim,
}) {
  const borderColor = BORDER_COLORS[variant] ?? "#0056b3";
  const alertBg     = isAlert ? (ALERT_BG[variant] ?? "#ffffff") : "#ffffff";

  const card = (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: borderColor, backgroundColor: alertBg }]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {loading ? (
        <>
          <View style={styles.skeletonValue} />
          <View style={styles.skeletonTitle} />
        </>
      ) : (
        <>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (fadeAnim && slideAnim) {
    return (
      <Animated.View
        style={{ width: "48%", opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {card}
      </Animated.View>
    );
  }

  return <View style={{ width: "48%" }}>{card}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    minHeight: 160,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
    justifyContent: "center",
    borderLeftWidth: 4,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  icon:     { fontSize: 20 },
  value:    { fontSize: 24, fontWeight: "800", color: "#0f172a", marginBottom: 4 },
  title:    { fontSize: 13, fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },

  // Skeleton
  skeletonValue: { height: 28, width: "50%", borderRadius: 8, backgroundColor: "#e2e8f0", marginBottom: 8 },
  skeletonTitle: { height: 14, width: "80%", borderRadius: 6, backgroundColor: "#e2e8f0" },
});