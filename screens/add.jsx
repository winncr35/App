import React, { useState,useContext } from 'react';
import { View, Button, Image, PermissionsAndroid, Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ItemsContext } from "../components/ItemsContext.js";

export default function AddScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const { addItem } = useContext(ItemsContext);


  const requestMediaPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        let permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        // Android 13+ dùng READ_MEDIA_IMAGES
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        }

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Quyền truy cập ảnh',
          message: 'Ứng dụng cần quyền để chọn ảnh từ thư viện',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Hủy',
          buttonPositive: 'Đồng ý',
        });

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickImage = async () => {
  setPhoto(
        Image.resolveAssetSource(require("../assets/mouse.png")).uri
      );
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      Alert.alert('Bạn chưa cấp quyền');
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const takePhoto = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      Alert.alert('Bạn chưa cấp quyền camera');
      return;
    }

    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setPhoto(response.assets[0].uri);
      }
    });
  };
const savePhoto = () => {
  if (photo) {
    addItem(photo); // ✅ lưu vào context
    navigation.goBack(); // quay về Home
  } else {
    Alert.alert("Bạn chưa chọn ảnh");
  }
};


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      <Button title="Chụp ảnh" onPress={takePhoto} />

      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: 300, marginTop: 20 }}
        />
      )}
      <Button title="Lưu" onPress={savePhoto} />
    </View>
  );
}
