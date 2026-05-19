import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";

export default function RegisterEmployee({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Cashier");
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
          <BackButton onPress={() => navigation?.goBack()} />
          <Text style={styles.headerTitle}>Register New Staff</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Assign a role and create system credentials for a new employee.
        </Text>

        {/* Personal Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Personal Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +251..."
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Assign Role</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cashier" value="Cashier" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Security Guard" value="Security Guard" />
              <Picker.Item label="Shop Clerk" value="Shop Clerk" />
            </Picker>
          </View>
        </View>

        {/* System Credentials Card */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🔑</Text>
          <Text style={styles.cardTitle}>System Credentials</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Initial Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button text="Register" onPress={() => {}} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f4f7f6",
  },
  container: {
    padding: 20,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0056b3",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    paddingLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eef2f5",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  cardIcon: {
    backgroundColor: "#e7f0fd",
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: "center",
    lineHeight: 50,
    fontSize: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#F9F9F9",
  },
  picker: {
    height: 45,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  btnSecondary: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnSecondaryText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});
