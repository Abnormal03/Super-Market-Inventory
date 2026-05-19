import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/button";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoStock}>Stock</Text>
            <Text style={styles.logoPilot}>Pilot</Text>
          </View>
          <Text style={styles.subtitle}>Manage your inventory with ease</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          {/* Username Input */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {/* Login Button */}
          <View style={styles.buttonWrapper}>
            <Button text="Login" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  logoStock: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E90FF",
    marginRight: 4,
  },
  logoPilot: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#1E90FF",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#F9F9F9",
  },
  buttonWrapper: {
    marginTop: 28,
  },
});
