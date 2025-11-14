import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Button,
  Image,
  PermissionsAndroid,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../components/AuthContext";
import { useRoute } from "@react-navigation/native";

export default function AddScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const editItem = route?.params?.editItem || null;
  const isEdit = !!editItem;

  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // 🆕 Load old data when editing
  useEffect(() => {
    if (isEdit) {
      setName(editItem.title);
      setDescription(editItem.description || "");
      setCategory(editItem.category);
      setPrice(String(editItem.price));

      const oldPhoto = editItem.photos ? JSON.parse(editItem.photos)[0] : null;
      setPhoto(oldPhoto);
    }
  }, [isEdit]);

  // === Permissions ===
  const requestMediaPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        let permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch {
      return false;
    }
  };

  // === Pick image ===
  const pickImage = async () => {
    const ok = await requestMediaPermission();
    if (!ok) return Alert.alert("Permission denied");
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets) setPhoto(res.assets[0].uri);
    });
  };

  // === Save / Update ===
  const saveItem = async () => {
    if (!name.trim() || !category.trim() || !price.trim() || !description.trim()) {
      return Alert.alert("Please fill all fields");
    }

    const bodyData = {
      sellerId: user.id,
      title: name,
      description,
      category,
      price: parseFloat(price),
      condition: "new",
      photos: [photo],
      role: user.role
    };

    const url = isEdit
      ? `http://10.0.2.2:4000/listings/${editItem.id}`
      : "http://10.0.2.2:4000/listings";

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", isEdit ? "Updated!" : "Created!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.error || "Server error");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Choose Image" onPress={pickImage} />

      {photo && (
        <Image
          source={{ uri: photo }}
          style={{
            width: "100%",
            height: 250,
            marginVertical: 10,
            borderRadius: 10,
          }}
        />
      )}

      <TextInput
        placeholder="Product name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <Picker
        selectedValue={category}
        onValueChange={(val) => setCategory(val)}
        style={styles.input}
      >
        <Picker.Item label="Select category..." value="" />
        <Picker.Item label="Electronics" value="Electronics" />
        <Picker.Item label="Accessories" value="Accessories" />
      </Picker>

      <Button
        title={isEdit ? "Update Item" : "Create Item"}
        onPress={saveItem}
      />
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
};
