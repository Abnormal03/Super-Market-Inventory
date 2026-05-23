import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons"; // for icons

import DashboardScreen from "../screens/manager/MainDashboardScreen";
import InventoryAnalysisScreen from "../screens/manager/InventoryOverview";
import InventoryScreen from "../screens/manager/CategoryExplorer";
import SupplierScreen from "../screens/manager/SupplierDirectory";

const Tab = createMaterialTopTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom" // ✅ tabs at bottom
      screenOptions={({ route }) => ({
        swipeEnabled: true, // ✅ swipe between tabs
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: { backgroundColor: "#f9f9f9", height: 60 },
        tabBarIndicatorStyle: { backgroundColor: "#3498db" },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "InventoryAnalysis") iconName = "bar-chart";
          else if (route.name === "Inventory") iconName = "cube";
          else if (route.name === "Supplier") iconName = "people";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="InventoryAnalysis" component={InventoryAnalysisScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Supplier" component={SupplierScreen} />
    </Tab.Navigator>
  );
}
