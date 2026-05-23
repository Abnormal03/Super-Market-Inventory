import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ 
  text, 
  onPress, 
  variant = "primary", // Accepts: "primary" | "secondary" | "tertiary" | "text"
  style = {}           
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.buttonBase, 
        styles[variant], 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.textBase, styles[`text_${variant}`]]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Shared structural core
  buttonBase: {
    height: 52, 
    borderRadius: 14, 
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
  },
  
  // Shared typographic core
  textBase: {
    fontSize: 15,
    fontWeight: "700", 
    letterSpacing: -0.1,
  },

  /* --- VARIANT 1: PRIMARY --- */
  primary: {
    backgroundColor: "#0056b3", // Core brand blue
    shadowColor: "#0056b3",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3, 
  },
  text_primary: {
    color: "#ffffff",
  },

  /* --- VARIANT 2: SECONDARY --- */
  secondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0", 
  },
  text_secondary: {
    color: "#0f172a", 
  },

  /* --- VARIANT 3: TERTIARY (New Premium Outline) --- */
  // Perfectly balances high-end branding with subtle UI weight
  tertiary: {
    backgroundColor: "rgba(0, 86, 179, 0.03)", // Ultra-subtle brand tint for rich surface feeling
    borderWidth: 1.5,
    borderColor: "#0056b3", // Clean brand blue border
    shadowColor: "#0056b3",
    shadowOpacity: 0.04, // Very soft halo effect
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text_tertiary: {
    color: "#0056b3", // Vibrant brand text color
  },

  /* --- VARIANT 4: TEXT ONLY --- */
  text: {
    backgroundColor: "transparent",
    height: "auto",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text_text: {
    color: "#0056b3",
  },
});