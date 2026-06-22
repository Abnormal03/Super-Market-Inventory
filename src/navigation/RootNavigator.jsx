import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

import MainTabs from "./MainTabs";
import CashierDeskScreen from "../screens/cashier/CashierDeskScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import DailySalesScreen from "../screens/manager/DailySalesScreen";
import InventoryDashboardDetail from "../screens/manager/InventoryDashboardDetail";
import RestockScreen from "../screens/manager/RestockScreen";
import SpecificCategory from "../screens/manager/SpecificCategory";
import RegisterSupplier from "../screens/manager/RegisterSupplier";
import CashierLeaderboard from "../screens/manager/CashierLeaderboard";
import ProfileScreen from "../screens/manager/ProfileScreen";
import TransactionDetailScreen from "../screens/manager/TransactionDetailScreen";
import NotificationsScreen from "../screens/manager/NotificationsScreen";

const Stack = createNativeStackNavigator();

// Separated so it can consume AuthContext
function AppNavigator() {
  const { employee, loading } = useAuth();

  // Show spinner while checking auth state (useful later if you add persistence)
  if (loading && employee) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!employee ? (
        // Auth Stack — only Login is accessible when logged out
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : employee.role_name === "Cashier" ? (
        // Cashier Stack
        <Stack.Screen name="CashierDeskScreen" component={CashierDeskScreen} />
      ) : (
        // Manager Stack
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="DailySales" component={DailySalesScreen} />
          <Stack.Screen name="InventoryDashboardDetail" component={InventoryDashboardDetail} />
          <Stack.Screen name="RestockScreen" component={RestockScreen} />
          <Stack.Screen name="SpecificCategory" component={SpecificCategory} />
          <Stack.Screen name="RegisterSupplier" component={RegisterSupplier} />
          <Stack.Screen name="CashierLeaderboard" component={CashierLeaderboard} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const RootNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default RootNavigator;