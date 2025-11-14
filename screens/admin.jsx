import React, { useEffect, useState,useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { Card } from "react-native-paper";
import { useNavigation,CommonActions } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";

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

  return (
    <View style={{ flex: 1, padding: 14, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 14 }}>
        👑 Admin Dashboard
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Content>
              <Text style={{ fontWeight: "600" }}>
                {item.name || "No name"}
              </Text>
              <Text>{item.email}</Text>
              <Text>Role: {item.role}</Text>
              <Text>Status: {item.disabled ? "❌ Disabled" : "✅ Active"}</Text>
              <TouchableOpacity
                disabled={item.role === "admin"} // 🚫 disable admin
                onPress={() => toggleUser(item)}
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor:
                    item.role === "admin"
                      ? "#999" // xám cho admin
                      : item.disabled
                      ? "#4caf50" // xanh khi đang disabled
                      : "#d32f2f", // đỏ khi đang active
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
    {/* 🔹 Logout */}
    <TouchableOpacity
      style={{
        backgroundColor: "#d32f2f",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
      }}
      onPress={logout} // ✅ chỉ gọi logout, không reset
    >
      <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
        Logout
      </Text>
    </TouchableOpacity>

    {/* 🔹 Go to Home */}
    <TouchableOpacity
      style={{
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
      }}
      onPress={() => {
        navigation.navigate("BuyerTabs", { screen: "Home" }); // ✅ sửa lại từ SellerTabs → BuyerTabs
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        🏠 Go to Marketplace
      </Text>
    </TouchableOpacity>


    </View>
  );
}
//admin@shop.com
//123456