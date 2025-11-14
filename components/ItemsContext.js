// ItemsContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Load data when the app was opened
  useEffect(() => {
    const loadItems = async () => {
      const saved = await AsyncStorage.getItem("items");
      if (saved) setItems(JSON.parse(saved));
    };
    loadItems();
  }, []);

  // Save new data for items
  useEffect(() => {
    AsyncStorage.setItem("items", JSON.stringify(items));
  }, [items]);
  // Add new item { name, uri })
  const addItem = (newItem) => {

    setItems((listItem) => [...listItem, newItem]);
  };
  //  Delete item by index
    const removeItem = (index) => {
      setItems((listItem) => listItem.filter((_, i) => i !== index)); // xoá item theo index
    };
    const addToCart = (item) => {
      setCartItems(prev => [...prev, item]);
    };

    const removeFromCart = (index) => {
      setCartItems(prev => prev.filter((_, i) => i !== index));
    };


  return (
    <ItemsContext.Provider value={{setCartItems,cartItems,addToCart,removeFromCart, items, addItem ,removeItem}}>
      {children}
    </ItemsContext.Provider>
  );
};

