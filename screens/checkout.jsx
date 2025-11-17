import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { ItemsContext } from "../components/ItemsContext";

function Checkout({ navigation }) {
  const { cartItems, setCartItems } = useContext(ItemsContext);
  const [address, setAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");


  // ✅ Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert("Missing Information", "Please enter your delivery address.");
      return;
    }
      if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        Alert.alert("Missing Information", "Please fill out all payment details.");
        return;
      }

      if (cardNumber.length < 16) {
        Alert.alert("Invalid Card", "Card number must be at least 16 digits.");
        return;
      }

      if (cvv.length < 3) {
        Alert.alert("Invalid CVV", "CVV must be 3 digits.");
        return;
      }

    Alert.alert(
      "Order Placed!",
      `Your order of $${total.toFixed(2)} will be delivered soon.`,
      [
        {
          text: "OK",
          onPress: () => {
            setCartItems([]); // Xóa giỏ hàng
            navigation.navigate("BuyerTabs", { screen: "Home" });
 // 👈 Quay lại Home
          },
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.summaryBox}>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.label}>Delivery Address:</Text>
      <TextInput
        placeholder="Enter your address..."
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.label}>Card Holder Name:</Text>
      <TextInput
        placeholder="Name on card"
        style={styles.input}
        value={cardName}
        onChangeText={setCardName}
      />

      <Text style={styles.label}>Card Number:</Text>
      <TextInput
        placeholder="1234 5678 9012 3456"
        style={styles.input}
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Expiry (MM/YY):</Text>
          <TextInput
            placeholder="08/27"
            style={styles.input}
            value={expiry}
            onChangeText={setExpiry}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV:</Text>
          <TextInput
            placeholder="123"
            style={styles.input}
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      </View>


      <TouchableOpacity style={styles.checkoutBtn} onPress={handlePlaceOrder}>
        <Text style={styles.checkoutText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Checkout;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    opacity: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
  },
  itemPrice: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#388E3C",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  checkoutBtn: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
