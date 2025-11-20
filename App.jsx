import * as React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import { ItemsProvider, ItemsContext } from "./components/ItemsContext.js";
import { AuthProvider, AuthContext } from "./components/AuthContext.js";

import Checkout from "./screens/checkout.jsx";
import Home from "./screens/home.jsx";
import Cart from "./screens/cart.jsx";
import Profile from "./screens/profile.jsx";
import AddScreen from "./screens/add.jsx";
import LoginScreen from "./screens/login.jsx";
import RegisterScreen from "./screens/register.jsx";
import AdminDashboard from "./screens/admin.jsx";
import ItemDetail from "./screens/itemdetail.jsx";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ----------------- BUYER ----------------- */
function BuyerTabs({ navigation }) {
  const { cartItems } = React.useContext(ItemsContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <Image source={require("./assets/home.png")} style={{ width: 28, height: 28 }} />
          ),
          headerTitle: () => (
            <Image
              source={require("./assets/logo.png")}
              style={{ width: 150, height: 80, resizeMode: "contain" }}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Add")}>
              <Image
                source={require("./assets/plus.png")}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <View>
              <Image source={require("./assets/cart.png")} style={{ width: 36, height: 45 }} />
              {cartItems.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -4,
                    top: -2,
                    backgroundColor: "#FF3B30",
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => (
            <Image source={require("./assets/profile.png")} style={{ width: 28, height: 28 }} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

/* ----------------- SELLER ----------------- */
function SellerTabs({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MyProducts"
        component={Home}
        options={{
          title: "My Listings",
          tabBarIcon: () => (
            <Image source={require("./assets/home.png")} style={{ width: 28, height: 28 }} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Add")}>
              <Image
                source={require("./assets/plus.png")}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileSeller"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Image source={require("./assets/profile.png")} style={{ width: 28, height: 28 }} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

/* ----------------- AUTH ----------------- */
function AuthStack() {
  const AuthStackNav = createStackNavigator();
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

/* ----------------- ROOT ----------------- */
function RootNavigator() {
  const { user } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      ) : user.role === "admin" ? (
        <>
          <Stack.Screen name="Admin" component={AdminDashboard} options={{ title: "Admin Dashboard" }} />
          <Stack.Screen name="BuyerTabs" component={BuyerTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ title: "Checkout" }} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ title: "Item Detail" }} />
        </>
      ) : user.role === "seller" ? (
        <>
          <Stack.Screen name="SellerTabs" component={SellerTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ title: "Item Detail" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="BuyerTabs" component={BuyerTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ title: "Item Detail" }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ title: "Checkout" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

/* ----------------- APP ----------------- */
export default function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <AuthProvider>
        <ItemsProvider>
          <NavigationContainer theme={NavDefaultTheme}>
            <RootNavigator />
          </NavigationContainer>
        </ItemsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
