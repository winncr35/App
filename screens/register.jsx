import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../components/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("buyer");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [reqErr, setReqErr] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validate = () => {
    setEmailErr(""); setPassErr(""); setReqErr("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setReqErr("All required fields must be completed (name, email, password).");
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setEmailErr("Invalid email format.");
      return false;
    }
    if (!passRegex.test(password)) {
      setPassErr("Min 8 chars, include uppercase, lowercase, number & special char.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      // register() nên trả { success: true } khi OK, hoặc throw khi lỗi
      const res = await register({ name: name.trim(), email: email.trim(), password, phone, role });
      if (res?.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Registration failed", res?.error || "Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Registration failed.";
      Alert.alert("Registration failed", msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Create Account</Text>

      {!!reqErr && <Text style={styles.err}>{reqErr}</Text>}

      <TextInput
        label="Email"
        value={email}
        onChangeText={(t)=>{ setEmail(t); setEmailErr(""); }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!emailErr}
      />
      {!!emailErr && <Text style={styles.err}>{emailErr}</Text>}

      <TextInput
        label="Password"
        value={password}
        onChangeText={(t)=>{ setPassword(t); setPassErr(""); }}
        style={styles.input}
        secureTextEntry
        error={!!passErr}
      />
      {!!passErr && <Text style={styles.err}>{passErr}</Text>}

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={{ marginBottom: 4, marginTop: 6 }}>Role</Text>
      <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
        <Picker.Item label="Buyer" value="buyer" />
        <Picker.Item label="Seller" value="seller" />
      </Picker>

      <Button mode="contained" onPress={onSubmit} style={{ marginTop: 14 }}>
        Register
      </Button>

      <Button onPress={() => navigation.navigate("Login")} style={{ marginTop: 8 }}>
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { marginBottom: 10 },
  picker: { backgroundColor: "#fff", borderRadius: 8 },
  err: { color: "#b00020", marginBottom: 6 },
});
