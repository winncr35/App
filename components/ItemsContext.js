// ItemsContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load dữ liệu khi mở app
  useEffect(() => {
    const loadItems = async () => {
      const saved = await AsyncStorage.getItem("items");
      if (saved) setItems(JSON.parse(saved));
    };
    loadItems();
  }, []);

  // Lưu dữ liệu mỗi khi items thay đổi
  useEffect(() => {
    AsyncStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems((listItem) => [...listItem, newItem]);
  };
    const removeItem = (index) => {
      setItems((listItem) => listItem.filter((_, i) => i !== index)); // xoá item theo index
    };


  return (
    <ItemsContext.Provider value={{ items, addItem ,removeItem}}>
      {children}
    </ItemsContext.Provider>
  );
};

