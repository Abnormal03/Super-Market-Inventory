import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function CashierLeaderboard({ navigation }) {
  const team = [
    { id: 1, name: "Abebe Kebede", status: "active", total_sales: 12450 },
    { id: 2, name: "Sara Mohammed", status: "active", total_sales: 10200 },
    { id: 3, name: "John Doe", status: "inactive", total_sales: 0 },
  ];

  const totalDailyRevenue = team.reduce((sum, emp) => sum + emp.total_sales, 0);
  const topCashierId = team.length > 0 && team[0].total_sales > 0 ? team[0].id : null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={styles.headerTitle}>Cashier Performance</Text>
      </View>
      <Text style={styles.headerSubtitle}>Real-time sales tracking for today's shift</Text>

      {/* Leaderboard */}
      <View style={styles.leaderboard}>
        {team.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cashiers found in the system.</Text>
          </View>
        ) : (
          team.map((emp, index) => {
            const percent = totalDailyRevenue > 0 ? (emp.total_sales / totalDailyRevenue) * 100 : 0;
            const isWinner = emp.id === topCashierId;
            const rank = index + 1;
            return (
              <View key={emp.id} style={[styles.row, isWinner && styles.winner]}>
                {/* Rank Zone */}
                <View style={styles.rankZone}>
                  {isWinner ? (
                    <Text style={styles.trophy}>🏆</Text>
                  ) : (
                    <Text style={styles.rankNumber}>#{rank}</Text>
                  )}
                </View>

                {/* Info Zone */}
                <View style={styles.infoZone}>
                  <View style={styles.nameStatus}>
                    <Text style={styles.name}>{emp.name}</Text>
                    <View
                      style={[
                        styles.statusDot,
                        emp.status === "active" ? styles.activeDot : styles.inactiveDot,
                      ]}
                    />
                  </View>
                </View>

                {/* Performance Zone */}
                <View style={styles.performanceZone}>
                  <Text style={styles.salesLabel}>
                    Revenue: <Text style={{ fontWeight: "700" }}>ETB {emp.total_sales.toLocaleString()}</Text>
                  </Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${percent}%` }]} />
                  </View>
                  <Text style={styles.percentText}>{percent.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f4f7f6" },
  container: { padding: 20, paddingTop: 55 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0056b3", marginLeft: 10 },
  headerSubtitle: { fontSize: 13, color: "#777", marginBottom: 20 },
  leaderboard: { gap: 15 },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e6eb",
  },
  winner: { borderLeftColor: "#0056b3", backgroundColor: "#fffdf5" },
  rankZone: { width: 50, alignItems: "center" },
  trophy: { fontSize: 20, color: "#0056b3" },
  rankNumber: { fontSize: 14, fontWeight: "700", color: "#555758" },
  infoZone: { flex: 1 },
  nameStatus: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 14, fontWeight: "700", color: "#0056b3" },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  activeDot: { backgroundColor: "#2ecc71" },
  inactiveDot: { backgroundColor: "#e74c3c", marginLeft: 18 },
  performanceZone: { flex: 2, paddingHorizontal: 20 },
  salesLabel: { fontSize: 12, color: "#555", marginBottom: 6 },
  progressBg: {
    height: 12,
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  percentText: { fontSize: 11, color: "#4b4949", textAlign: "right", marginTop: 4 },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyText: { fontSize: 13, color: "#777", fontStyle: "italic" },
});
