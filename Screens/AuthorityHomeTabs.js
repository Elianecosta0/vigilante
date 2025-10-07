import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActiveAlertsScreen from './ActiveAlertsScreen';
import AuthorityProfileScreen from './AuthorityProfileScreen';

// Empty Home Screen for authorities
const AuthorityHomeScreen = () => {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Welcome, Authority!</Text>
      <Text style={{ marginTop: 10, color: '#555' }}>This is your home screen.</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const AuthorityHomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'alert' : 'alert-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E2C3A',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={AuthorityHomeScreen} />
      <Tab.Screen name="Alerts" component={ActiveAlertsScreen} />
      <Tab.Screen name="Profile" component={AuthorityProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default AuthorityHomeTabs;
