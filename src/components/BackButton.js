import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

export default function BackButton({ onPress, style = {} }) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="chevron-back" // Swapped arrow-back for chevron-back for a sleeker, high-end tech aesthetic
        size={20} 
        color="#0056b3" // Deep slate color to match your new typography hierarchy
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50, // Sleeker footprint that fits flawlessly into modern navigation headers
    height: 50,
    borderRadius: 30, // Match the soft squircle radius used across the inputs and cards
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f3f3", // Pure white base
    borderWidth: 1.5,
    borderColor: "#e2e8f0", // Subtle, elegant slate border
    
    // Smooth, premium drop-shadow profile
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, 
  },
});