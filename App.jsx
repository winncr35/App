import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/home.js';
import Cart from './screens/cart.js';
import Profile from './screens/profile.js';
import AddScreen from './screens/add.js'



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNav({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/home.png')}
              style={{ width: 28, height: 28 }}
            />
          ),
          headerTitle: () => (
            <Image
              source={require('./assets/logo.png')}
              style={{ width: 150, height: 80, resizeMode: 'contain' }}
            />
          ),
          // ✅ nút plus nhảy sang màn hình Add
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Add")}>
              <Image
                source={require('./assets/plus.png')}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/cart.png')}
              style={{ width: 42, height: 42 }}
            />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/profile.png')}
              style={{ width: 28, height: 28 }}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tab chính */}
        <Stack.Screen
          name="Tabs"
          component={TabNav}
          options={{ headerShown: false }}
        />
        {/* Màn hình Add (không có tab bar) */}
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "Your Item" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
