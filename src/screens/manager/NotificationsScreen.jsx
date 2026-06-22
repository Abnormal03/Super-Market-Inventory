import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import BackButton from "../../components/BackButton";
import { useAuth } from "../../context/AuthContext";
import { fetchActiveAlerts, markAlertRead, markAllRead } from "../../lib/notifications";

const TYPE_STYLE = {
  low_stock:    { bg: "#fef3c7", border: "#f59e0b" },
  out_of_stock: { bg: "#fee2e2", border: "#ef4444" },
  expiring:     { bg: "#ffedd5", border: "#f97316" },
  expired:      { bg: "#fecdd3", border: "#e11d48" },
};

export default function NotificationsScreen({ navigation }) {
  const { employee } = useAuth();
  const [alerts, setAlerts]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchActiveAlerts(employee?.id);
      setAlerts(data);
    } catch (err) {
      console.error("Notifications error:", err.message);
      setError("Failed to load notifications.");
    }
  }, [employee?.id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePressAlert = async (alert) => {
    // Optimistically mark read locally
    setAlerts((prev) => prev.map((a) => (a.key === alert.key ? { ...a, read: true } : a)));
    try {
      await markAlertRead(employee?.id, alert.key);
    } catch (err) {
      console.error("Mark read failed:", err.message);
    }
    navigation.navigate("InventoryDashboardDetail", {
      filter: alert.filter,
      title:  alert.title,
    });
  };

  const handleMarkAllRead = async () => {
    const unreadKeys = alerts.filter((a) => !a.read).map((a) => a.key);
    if (!unreadKeys.length) return;
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    try {
      await markAllRead(employee?.id, unreadKeys);
    } catch (err) {
      console.error("Mark all read failed:", err.message);
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0056b3"]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
        </View>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>All clear!</Text>
          <Text style={styles.emptySubtext}>No active alerts right now.</Text>
        </View>
      ) : (
        alerts.map((alert) => {
          const style = TYPE_STYLE[alert.type] ?? TYPE_STYLE.low_stock;
          return (
            <TouchableOpacity
              key={alert.key}
              style={[
                styles.alertCard,
                { borderLeftColor: style.border },
                alert.read && styles.alertRead,
              ]}
              onPress={() => handlePressAlert(alert)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: style.bg }]}>
                <Text style={styles.alertIcon}>{alert.icon}</Text>
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertSubtitle} numberOfLines={1}>{alert.subtitle}</Text>
              </View>
              {!alert.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  header:      { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", flex: 1 },
  markAllBtn:  { paddingVertical: 6, paddingHorizontal: 10 },
  markAllText: { fontSize: 13, fontWeight: "700", color: "#0056b3" },

  errorBanner:      { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:        { fontSize: 13, fontWeight: "600", color: "#dc2626" },
  loadingContainer: { alignItems: "center", marginTop: 60 },

  emptyState:   { alignItems: "center", marginTop: 80 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  emptySubtext: { fontSize: 14, color: "#94a3b8", marginTop: 4 },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  alertRead: { opacity: 0.55 },

  iconWrapper: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  alertIcon:   { fontSize: 20 },

  alertTextContainer: { flex: 1 },
  alertTitle:          { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  alertSubtitle:        { fontSize: 12, color: "#64748b", marginTop: 2 },

  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#0056b3", marginLeft: 8 },
});