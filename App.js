import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CashierLeaderboard from "./src/screens/manager/CashierLeaderboard";
export default function App() {
  return (
    <View style={styles.container}>
      <CashierLeaderboard />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
