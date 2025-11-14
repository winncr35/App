import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  TextInput,
} from "react-native-paper";
import { AuthContext } from "../components/AuthContext";
import { ItemsContext } from "../components/ItemsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const { cartItems } = useContext(ItemsContext);

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [editing, setEditing] = useState(false);

  // 📸 Chọn ảnh avatar
  const pickAvatar = () => {
    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      if (res.assets?.length) {
        const newUri = res.assets[0].uri;
        setAvatar(newUri);

        try {
          const updatedUser = { ...user, avatar: newUri };
          setUser(updatedUser);
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

          await axios.post("http://10.0.2.2:4000/update-profile", {
            email: updatedUser.email,
            name: updatedUser.name,
            avatar: updatedUser.avatar,
          });
        } catch (err) {
          console.error("❌ Avatar upload failed:", err.message);
        }
      }
    });
  };

  // 💾 Lưu profile
  const saveProfile = async () => {
    try {
      if (!user?.email) {
        alert("⚠️ Missing email, please login again.");
        return;
      }

      const updatedUser = { ...user, name, avatar };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      const res = await axios.post("http://10.0.2.2:4000/update-profile", {
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      });

      if (res.data.success) {
        alert("✅ Profile updated");
        setEditing(false);
      } else {
        alert("⚠️ Update failed");
      }
    } catch (error) {
      alert("❌ Profile update error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>

          {/* Avatar */}
          <TouchableOpacity onPress={pickAvatar}>
            <Image
              source={{
                uri: avatar || "https://via.placeholder.com/120?text=Avatar",
              }}
              style={styles.avatar}
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          {/* Name */}
          <View style={styles.nameRow}>
            {editing ? (
              <>
                <TextInput
                  mode="outlined"
                  value={name}
                  onChangeText={setName}
                  style={styles.nameInput}
                />
                <IconButton
                  icon="check"
                  iconColor="#4CAF50"
                  onPress={saveProfile}
                />
              </>
            ) : (
              <>
                <Text variant="titleLarge" style={styles.nameText}>
                  {name}
                </Text>
                <IconButton
                  icon="pencil"
                  iconColor="#007bff"
                  onPress={() => setEditing(true)}
                />
              </>
            )}
          </View>

          {/* Email */}
          <Text style={styles.emailText}>{user?.email}</Text>

          {/* Cart Stats */}
          <Card style={styles.stats}>
            <Card.Content>
              <Text>🛒 Items in Cart: {cartItems.length}</Text>
            </Card.Content>
          </Card>

          {/* Logout button */}
          <Button
            mode="outlined"
            style={styles.logoutBtn}
            textColor="#d33"
            onPress={logout}
          >
            Logout
          </Button>

        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  card: {
    borderRadius: 16,
    margin: 12,
    paddingVertical: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 8,
  },
  changePhotoText: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: 12,
    fontWeight: "500",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  nameInput: {
    width: 180,
    height: 40,
  },
  emailText: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 10,
  },
  stats: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  logoutBtn: {
    marginTop: 20,
    borderColor: "#d33",
    borderWidth: 1.5,
    alignSelf: "center",
    width: 150,
  },
});
