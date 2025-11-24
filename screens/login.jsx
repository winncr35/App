import React, { useState, useContext } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card, TextInput } from "react-native-paper";
import { AuthContext } from "../components/AuthContext";
import LinearGradient from "react-native-linear-gradient";

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

      {/* ======= LOGO ======= */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.utaLogo}
        resizeMode="contain"
      />

      {/* ===== CARD ===== */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>

          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Image
              source={require("../assets/6.png")}
              style={{ width: 110, height: 110, resizeMode: "contain" }}
            />
          </View>

          {/* ===== BEAUTIFUL INPUTS ===== */}
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            theme={styles.inputTheme}
            autoCapitalize="none"
          />

          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            theme={styles.inputTheme}
          />

          {/* ===== SIGN IN BUTTON ===== */}
          <TouchableOpacity onPress={handleLogin} style={{ marginTop: 18 }}>
            <LinearGradient
              colors={["#F58632", "#007bff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.gradientBtnText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Don't have an account? Create one</Text>
          </TouchableOpacity>

        </Card.Content>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },

  utaLogo: {
    width: "55%",
    height: 110,
    marginBottom: 10,
  },

  card: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 20,
    marginTop: 20,
  },

  input: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  inputTheme: {
    roundness: 12,
    colors: {
      primary: "#007bff",
      background: "#fff",
      placeholder: "#888",
      text: "#000",
    },
  },

  gradientBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  gradientBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  link: {
    textAlign: "center",
    marginTop: 16,
    color: "#007bff",
    fontWeight: "600",
  },
});
