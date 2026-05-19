import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import RegisterEmployee from "./src/screens/manager/RegisterEmployee";
export default function App() {
  return (
    <View style={styles.container}>
      <RegisterEmployee />
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
