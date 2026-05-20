import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import InventoryOverview from "./src/screens/manager/InventoryOverview";
export default function App() {
  return (
    <View style={styles.container}>
      <InventoryOverview />
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
