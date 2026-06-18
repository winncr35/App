import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  // Load login state when app opens
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch {
        await AsyncStorage.removeItem("user");
      }
    };
    loadUser();
  }, []);

  const API_URL = "http://10.0.2.2:4000"; // for Android emulator; replace with Wi-Fi IP for real device
const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const userData = res.data;
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  } catch (err) {
    const msg = err.response?.data?.error || "❌ Login failed";
    alert(msg);
  }
};

  const register = async ({ name, email, password, phone, role }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: name?.trim() || "",
        email: email?.trim() || "",
        password: password?.trim() || "",
        phone: phone?.trim() || "",
        role: role || "buyer",
      });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Registration failed";
      throw new Error(msg);
    }
  };


  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
