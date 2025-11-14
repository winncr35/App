import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = chưa login

  // Load trạng thái đăng nhập khi mở app
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    loadUser();
  }, []);

  const API_URL = "http://10.0.2.2:4000"; // nếu dùng Android emulator
    // hoặc thay bằng IP Wi-Fi của máy bạn nếu test trên điện thoại thật
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
