import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

/**
 * NotificationBell
 * Props:
 *  - count:   number — unread alert count
 *  - onPress: () => void
 */
export default function NotificationBell({ count = 0, onPress }) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>🔔</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 17 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
