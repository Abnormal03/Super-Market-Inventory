import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import SupplierDirectory from "./src/screens/manager/SupplierDirectory";
export default function App() {
  return (
    <View style={styles.container}>
      <SupplierDirectory />
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
