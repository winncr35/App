import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:4000/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log("Failed to load users", err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleUser = async (user) => {
    await axios.post("http://10.0.2.2:4000/admin/user/toggle", {
      id: user.id,
      disabled: user.disabled ? 0 : 1,
    });
    loadUsers();
  };

  const deleteUser = (user) => {
    if (user.role === "admin") {
      Alert.alert("Not Allowed", "You cannot delete an admin account.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${user.email}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await axios.post("http://10.0.2.2:4000/admin/user/delete", {
              id: user.id,
            });
            loadUsers();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 14, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 14 }}>
        👑 Admin Dashboard
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{
              marginBottom: 12,
              borderRadius: 12,
              position: "relative",
              paddingTop: 26,
            }}
          >
            {/* ❌ DELETE ICON GÓC PHẢI */}
            <TouchableOpacity
              disabled={item.role === "admin"}
              onPress={() => deleteUser(item)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 25,
                height: 20,
                backgroundColor: item.role === "admin" ? "#ccc" : "#ff4444",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>

            <Card.Content>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>
                {item.name || "Unnamed"}
              </Text>
              <Text>{item.email}</Text>
              <Text>Role: {item.role}</Text>
              <Text>Status: {item.disabled ? "❌ Disabled" : "✅ Active"}</Text>

              {/* Enable / Disable BUTTON */}
              <TouchableOpacity
                disabled={item.role === "admin"}
                onPress={() => toggleUser(item)}
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor:
                    item.role === "admin"
                      ? "#999"
                      : item.disabled
                      ? "#4caf50"
                      : "#d32f2f",
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {item.role === "admin"
                    ? "Admin Protected"
                    : item.disabled
                    ? "Enable"
                    : "Disable"}
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )}
      />

      {/* Logout */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F58632",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={logout}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Marketplace */}
      <TouchableOpacity
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("BuyerTabs", { screen: "Home" })}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
          🏠 Go to Marketplace
        </Text>
      </TouchableOpacity>
    </View>
  );
}
