import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import RegisterSupplier from "./src/screens/manager/RegisterSupplier";
export default function App() {
  return (
    <View style={styles.container}>
      <RegisterSupplier />
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
