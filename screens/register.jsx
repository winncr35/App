import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../components/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { RadioButton } from "react-native-paper";

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
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validate = () => {
    setEmailErr("");
    setPassErr("");
    setReqErr("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setReqErr("All required fields must be completed (name, email, password).");
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setEmailErr("Invalid email format.");
      return false;
    }
    if (!passRegex.test(password)) {
      setPassErr(
        "Min 8 chars, include uppercase, lowercase, number & special char."
      );
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone,
        role,
      });

      if (res?.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Registration failed", res?.error || "Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Registration failed.";
      Alert.alert("Registration failed", msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>
        Create Account
      </Text>

      {!!reqErr && <Text style={styles.err}>{reqErr}</Text>}

      {/* --- BEAUTIFUL INPUTS --- */}
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setEmailErr("");
        }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!emailErr}
        theme={styles.theme}
      />
      {!!emailErr && <Text style={styles.err}>{emailErr}</Text>}

      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setPassErr("");
        }}
        style={styles.input}
        secureTextEntry
        error={!!passErr}
        theme={styles.theme}
      />
      {!!passErr && <Text style={styles.err}>{passErr}</Text>}

      <TextInput
        mode="outlined"
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={styles.theme}
      />

      <TextInput
        mode="outlined"
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        theme={styles.theme}
      />



     <View style={styles.radioGroup}>
       <View style={styles.radioRow}>
         <RadioButton
           value="buyer"
           status={role === "buyer" ? "checked" : "unchecked"}
           onPress={() => setRole("buyer")}
           color="#007bff"
         />
         <Text style={styles.radioText}>Buyer</Text>
       </View>

       <View style={styles.radioRow}>
         <RadioButton
           value="seller"
           status={role === "seller" ? "checked" : "unchecked"}
           onPress={() => setRole("seller")}
           color="#007bff"
         />
         <Text style={styles.radioText}>Seller</Text>
       </View>
     </View>


      {/* ===== GRADIENT REGISTER BUTTON ===== */}
      <TouchableOpacity onPress={onSubmit} style={{ marginTop: 16 }}>
        <LinearGradient
          colors={["#F58632", "#007bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.gradientBtnText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: {
    marginBottom: 20,
    fontWeight: "700",
    fontSize: 26,
    textAlign: "center",
  },

  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  theme: {
    roundness: 12,
    colors: {
      primary: "#007bff", // border khi focus
      text: "#000",
      background: "#fff",
      placeholder: "#888",
    },
  },

  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  roleLabel: { marginBottom: 6, fontWeight: "600" },

  err: { color: "#b00020", marginBottom: 6 },

  gradientBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  gradientBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  loginLink: {
    textAlign: "center",
    marginTop: 12,
    color: "#007bff",
    fontWeight: "600",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,   //
  },
  radioText: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: "500",
  },


});
