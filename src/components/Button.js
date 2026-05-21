import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff", // consistent color
    paddingVertical: 12,
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
