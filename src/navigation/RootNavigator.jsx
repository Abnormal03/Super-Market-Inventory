import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ fixed spelling
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
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CashierDeskScreen" component={CashierDeskScreen} />
        <Stack.Screen name="DailySales" component={DailySalesScreen}/>
        <Stack.Screen name="InventoryDashboardDetail" component={InventoryDashboardDetail}/>
        <Stack.Screen name="RestockScreen" component={RestockScreen}/>
        <Stack.Screen name="SpecificCategory" component={SpecificCategory}/>
        <Stack.Screen name="RegisterSupplier" component={RegisterSupplier}/>
        <Stack.Screen name="CashierLeaderboard" component={CashierLeaderboard}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
