import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Card } from "react-native-paper";
import { ItemsContext } from "../components/ItemsContext";
import { SafeAreaView } from "react-native-safe-area-context";

function Cart({ navigation }) {
  const { cartItems, removeFromCart } = useContext(ItemsContext);

  return (
    <SafeAreaView style={styles.container}>
      {/* Nếu giỏ hàng rỗng */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No Product</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 10 }}
            renderItem={({ item, index }) => (
              <Card style={styles.card}>
                <Card.Cover
                  source={{
                    uri:
                      item.uri ||
                      (item.photos && JSON.parse(item.photos)[0]) ||
                      "https://via.placeholder.com/300",
                  }}
                  style={{ height: 180 }}
                  resizeMode="contain"

                />

                <Card.Content>
                  <Text style={styles.itemName}>
                    {item.name || item.title}
                  </Text>
                  <Text style={styles.itemText}>💲 {item.price}</Text>
                  <Text style={styles.itemText}>🏷️ {item.category}</Text>
                </Card.Content>

                {/* Nút Delete bo tròn đẹp */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeFromCart(index)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </Card>
            )}
          />

          {/* Checkout button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              if (cartItems.length === 0) {
                alert("Your cart is empty!");
                return;
              }
              navigation.navigate("Checkout");
            }}
          >
            <Text style={styles.checkoutText}>CHECK OUT NOW</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },

  card: {
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },

  itemText: {
    fontSize: 16,
  },

  // Nút delete bo tròn
  deleteButton: {
    backgroundColor: "#F58632",
    paddingVertical: 9,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty cart UI
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 30,
    color: "#000",
    opacity: 0.6,
  },

  // Checkout button
  checkoutButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,

        borderRadius: 10,
        alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 4,
    left: 0,
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Cart;
