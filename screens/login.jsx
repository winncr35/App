import React, { useState, useContext } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {Switch, Text, Card, TextInput, Button } from "react-native-paper";
import { AuthContext } from "../components/AuthContext";
export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email.trim() === "") return alert("Please enter email");
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Logo */}

      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* ✅ Card Login */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Welcome Back 👋
          </Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ marginTop: 12 }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ marginTop: 12 }}
          />

          <Button mode="contained" style={styles.primaryBtn} onPress={handleLogin}>
            SIGN IN
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Don't have an account? Create one</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f4f6f8" },
  logo: { width: "70%", height: 80, alignSelf: "center", marginBottom: 20 },
  card: { paddingVertical: 10, borderRadius: 16 },
  title: { fontWeight: "700", textAlign: "center" },
  subtitle: { opacity: 0.6, textAlign: "center", marginBottom: 10 },
  primaryBtn: { marginTop: 16, paddingVertical: 6, borderRadius: 10 },
  link: { textAlign: "center", marginTop: 14, color: "#007bff", fontWeight: "600" },
});
