import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CashierDeskScreen from "./src/screens/cashier/CashierDeskScreen";
export default function App() {
  return (
    <View style={styles.container}>
      <CashierDeskScreen />
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
