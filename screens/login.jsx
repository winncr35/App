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

      {/* ======= UTA LOGO ======= */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.utaLogo}
        resizeMode="contain"
      />

      {/* ======= LOGIN CARD — CENTER ======= */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
      <View style={{ alignItems: "center", marginBottom:0 }}>
        <Image
          source={require("../assets/6.png")}   // 👉 đặt file logo của bạn vào đây
          style={{
            width: 110,
            height: 110,
            resizeMode: "contain",
          }}
        />
      </View>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ marginTop: 12 }}
          />

          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ marginTop: 12 }}
          />

          {/* ===== GRADIENT SIGN IN BUTTON ===== */}
          <TouchableOpacity onPress={handleLogin} style={{ marginTop: 16 }}>
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
    height: 120,

  },

  card: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 10,
    marginTop: "auto",
    marginBottom: 250,

  },

  /* ⭐ Gradient button */
  gradientBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  gradientBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    marginTop: 14,
    color: "#007bff",
    fontWeight: "600",
  },
});
