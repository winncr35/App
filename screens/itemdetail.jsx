import React, { useContext } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { ItemsContext } from "../components/ItemsContext";
import { AuthContext } from "../components/AuthContext";

export default function ItemDetail({ route, navigation }) {
  const { item } = route.params;
  const { addToCart } = useContext(ItemsContext);
  const { user } = useContext(AuthContext);

  const canDelete =
    user?.role === "admin" || (user?.role === "seller" && user?.id === item.sellerId);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:4000/listings/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Item deleted!");
        navigation.goBack();
      } else {
        alert("❌ " + (data.error || "Failed to delete"));
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: item.photos
            ? JSON.parse(item.photos)[0]
            : "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.price}>💲 {item.price}</Text>
          <Text style={styles.category}>🏷️ {item.category}</Text>
          <Text style={styles.description}>
            {item.description || "No description available."}
          </Text>

          {user?.role === "buyer" && (
            <Button
              mode="contained"
              buttonColor="#4CAF50"
              style={{ marginTop: 12 }}
              onPress={() => {
                addToCart(item);
                alert("✅ Added to cart!");
              }}
            >
              Add to Cart
            </Button>
          )}

          {canDelete && (
            <Button
              mode="contained"
              buttonColor="#F58632"
              style={{ marginTop: 12 }}
              onPress={handleDelete}
            >
              Delete Item
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 280, resizeMode: "cover" },
  card: { margin: 15, borderRadius: 10 },
  title: { fontWeight: "700", marginBottom: 6 },
  price: { fontSize: 18, color: "#2E7D32", marginBottom: 4 },
  category: { color: "#555", fontStyle: "italic", marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 22 },
});
