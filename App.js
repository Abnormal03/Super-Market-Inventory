import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ManageEmployees from "./src/screens/manager/ManageEmployees";
export default function App() {
  return (
    <View style={styles.container}>
      <ManageEmployees />
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
