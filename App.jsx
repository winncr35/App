import * as React from 'react';
import { View, Text ,TouchableOpacity,Alert,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/home.js'
import Order from './screens/order.js'
import Cart from './screens/cart.js'
import Profile from './screens/profile.js'




const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home}
            options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require('./assets/home.png')}
                    style={{
                      width: 28,
                      height: 28,

                    }}
                  />),

              headerTitle: () => (
                <Image
                 source={require('./assets/logo.png')} // ảnh của bạn
                 style={{ width: 150, height: 80,resizeMode: 'contain' }}
                 />
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => {Alert.alert('Menu pressed')}}>
                  <Image
                    source={require('./assets/plus.png')}
                    style={{ width: 28, height: 28,backgroundColor:'#fff', marginRight: 10 }}
                  />
                </TouchableOpacity>
              ),

            headerTitleAlign: 'center',


          }}
        />
         <Tab.Screen name="Cart" component={Cart}
            options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require('./assets/cart.png')}
                    style={{
                      width: 42,
                      height: 42,

                    }}
                  />)
                }}
         />

        <Tab.Screen name="Profile" component={Profile}
            options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require('./assets/profile.png')}
                    style={{
                      width: 28,
                      height: 28,

                    }}
                  />)
                }}
        />


      </Tab.Navigator>
    </NavigationContainer>
  );
}