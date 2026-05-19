import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import LoginScreen from "./src/screens/auth/LoginScreen";
import NewOrder from "./src/screens/manager/RestocksScreen"
export default function App() {
  return (
    <View style={styles.container}>
      <NewOrder />
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
