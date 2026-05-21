import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/Button";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(null); // Tracks active input for custom focus rings

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Background Elements for a Premium UI Look */}
        <View style={styles.topAmbientOrb} />
        
        {/* Header / Brand Identity Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoStock}>Stock</Text>
            <View style={styles.pilotBadge}>
              <Text style={styles.logoPilot}>Pilot</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Smart logistics & retail management command</Text>
        </View>

        {/* Modern Frameless Card Structure */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your dashboard console</Text>

          {/* Username Input Field */}
          <Text style={styles.label}>Username or Email</Text>
          <View 
            style={[
              styles.inputWrapper, 
              focusedInput === "username" && styles.inputWrapperFocused
            ]}
          >
            <Text style={styles.fieldIcon}>👤</Text>
            <TextInput
              placeholder="Enter operational ID"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Password Input Field */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>
          <View 
            style={[
              styles.inputWrapper, 
              focusedInput === "password" && styles.inputWrapperFocused
            ]}
          >
            <Text style={styles.fieldIcon}>🔒</Text>
            <TextInput
              placeholder="Enter key phrase"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Premium Button Placement */}
          <View style={styles.buttonWrapper}>
            <Button 
              // text="Authenticate Security Key" 
              text="Manager Demo"
              variant="primary"
              onPress={() => navigation.replace("MainTabs")} 
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button 
              text="Cashier Demo"
              variant="tertiary"
              onPress={() => navigation.replace("CashierDeskScreen")} 
            />
          </View>

          {/* Clean Infrastructure Footnote */}
          <Text style={styles.terminalFootnote}>Secure Enterprise Protocol v4.2.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Clean, elegant light slate background matching dashboard
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  topAmbientOrb: {
    position: "absolute",
    top: -120,
    left: width * 0.1,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#e0f2fe", // Super-soft ambient background glow
    opacity: 0.6,
    zIndex: -1,
  },
  header: {
    marginBottom: 44,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoStock: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0f172a", // Deep slate tone replacing legacy basic blue
    letterSpacing: -1,
  },
  pilotBadge: {
    backgroundColor: "#0056b3", // Synchronized dashboard brand blue
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 6,
    transform: [{ rotate: "-2deg" }], // Tiny geometric play for visual identity
  },
  logoPilot: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 20,
  },
  formCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 28,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0056b3",
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: "#0056b3", // Interactive highlight focus ring
    backgroundColor: "#ffffff",
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#0f172a",
    height: "100%",
  },
  buttonWrapper: {
    marginTop: 32,
    marginBottom: 16,
  },
  terminalFootnote: {
    fontSize: 11,
    fontWeight: "600",
    color: "#cbd5e1",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});