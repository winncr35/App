import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Searchbar, Card, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { ItemsContext } from "../components/ItemsContext";
import { AuthContext } from "../components/AuthContext";
import { useIsFocused } from "@react-navigation/native";

function Home({ navigation }) {
  const { addToCart } = useContext(ItemsContext);
  const { user } = useContext(AuthContext);

  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();



  const loadListings = async () => {
    try {
      // 🔹 Nếu là seller thì chỉ lấy sản phẩm của họ thôi
      const url =
        user?.role === "seller"
          ? `http://10.0.2.2:4000/listings?sellerId=${user.id}`
          : "http://10.0.2.2:4000/listings";

      const res = await axios.get(url);
      setItems(res.data);

      console.log("🧾 Listings:", res.data);
      console.log("👤 Current user:", user);
    } catch (err) {
      console.log("❌ Load listings failed:", err.message);
    }
  };
  const deleteListing = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:4000/listings/${id}`, {
        data: { userId: user.id, role: user.role },
      });
      alert("✅ Deleted successfully!");
      loadListings(); // refresh lại danh sách
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      alert(err.response?.data?.error || "❌ Failed to delete");
    }
  };
useEffect(() => {
    loadListings();
  }, [isFocused]);

  const filteredItems = items.filter((item) => {
    const name = item.title || item.name || "";
    const matchName = name.toLowerCase().includes(query.toLowerCase());
    const matchCategory =
      selectedCategory === "All" ||
      (item.category &&
        item.category.toLowerCase() === selectedCategory.toLowerCase());
    const price = parseFloat(item.price) || 0;
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const matchPrice = price >= min && price <= max;
    return matchName && matchCategory && matchPrice;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      {/* 🔍 Searchbar + Filter toggle */}
      <View style={styles.inputContainer}>
        <Searchbar
          placeholder="Search by product name..."
          onChangeText={setQuery}
          value={query}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Text style={styles.filterText}>
            {showFilter ? "Hide Filter ▲" : "Show Filter ▼"}
          </Text>
        </TouchableOpacity>

        {showFilter && (
          <View style={styles.filterBox}>
            <Text style={styles.label}>Category:</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
              style={styles.picker}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Accessories" value="Accessories" />
            </Picker>

            <Text style={styles.label}>Price Range:</Text>
            <View style={styles.priceRow}>
              <TextInput
                placeholder="Min"
                value={minPrice}
                onChangeText={setMinPrice}
                style={styles.priceBox}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Max"
                value={maxPrice}
                onChangeText={setMaxPrice}
                style={styles.priceBox}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
      </View>

      {/* 🛍 Product list */}
      {filteredItems.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
          No products found
        </Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ItemDetail", { item })}
            >
              <View style={styles.itemBox}>
                <Card style={styles.card}>
                  <Card.Cover
                    source={{
                      uri: item.photos
                        ? JSON.parse(item.photos)[0]
                        : item.uri || "https://via.placeholder.com/300",
                    }}
                    style={styles.image}
                  />
                  <Card.Content style={styles.cardContent}>
                    <Text style={styles.itemName}>{item.title || item.name}</Text>
                    <Text style={styles.itemPrice}>💲 {item.price}</Text>
                    <Text style={styles.itemCategory}>🏷️ {item.category}</Text>

                    {user?.role === "buyer" && (
                      <Button
                        mode="contained"
                        icon="cart"
                        buttonColor="#4CAF50"
                        textColor="white"
                        style={styles.cartButton}
                        onPress={() => addToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    )}

                    {user?.role === "seller" && Number(item.sellerId) === Number(user.id) && (
                      <>
                        <Button
                          mode="contained"
                          icon="pencil"
                          buttonColor="#007bff"
                          textColor="white"
                          style={styles.deleteButton}
                          onPress={() => navigation.navigate("Add", { editItem: item })}
                        >
                          Edit
                        </Button>

                        <Button
                          mode="contained"
                          icon="delete"
                          buttonColor="#F58632"
                          textColor="white"
                          style={styles.deleteButton}
                          onPress={() => deleteListing(item.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}


                    {user?.role === "admin" && (
                      <>
                        <Button
                          mode="contained"
                          icon="pencil"
                          buttonColor="#007bff"
                          textColor="white"
                          style={styles.deleteButton}
                          onPress={() => navigation.navigate("Add", { editItem: item })}
                        >
                          Edit (Admin)
                        </Button>

                        <Button
                          mode="contained"
                          icon="delete"
                          buttonColor="#F58632"
                          textColor="white"
                          style={styles.deleteButton}
                          onPress={() => deleteListing(item.id)}
                        >
                          Delete (Admin)
                        </Button>
                      </>
                    )}

                  </Card.Content>
                </Card>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  inputContainer: { margin: 10 },
  filterButton: {
    marginTop: 8,
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  filterText: { color: "#fff", fontWeight: "600" },
  filterBox: {
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
  },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 4 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  priceBox: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  // 🛍 Card Styles
  itemBox: { alignItems: "center" },
  card: {
    marginVertical: 10,
    width: "94%",
    borderRadius: 15,
    elevation: 4,
    backgroundColor: "#fff",
  },
  image: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  cardContent: { paddingVertical: 12 },
  itemName: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 6 },
  itemPrice: { fontSize: 20, fontWeight: "600", color: "#2E7D32", marginBottom: 4 },
  itemCategory: { fontSize: 17, color: "#555", fontStyle: "italic", marginBottom: 10 },
  cartButton: { borderRadius: 10, marginVertical: 4 },
  deleteButton: { borderRadius: 10, marginVertical: 4 },
});
