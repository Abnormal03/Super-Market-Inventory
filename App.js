import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import SalesAnalyticsScreen from "./src/screens/manager/SalesAnalysis";
export default function App() {
  return (
    <View style={styles.container}>
      <SalesAnalyticsScreen />
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
