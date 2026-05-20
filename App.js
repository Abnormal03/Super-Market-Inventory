import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MainDashBoardScreen from "./src/screens/manager/MainDashboardScreen";
export default function App() {
  return (
    <View style={styles.container}>
      <MainDashBoardScreen />
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
