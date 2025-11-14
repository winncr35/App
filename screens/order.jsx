import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function OrderConfirmation({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.text}>Thank you for your purchase.</Text>
      <Button title="Continue Shopping" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  text: { marginTop: 10, color: "#555" },
});
