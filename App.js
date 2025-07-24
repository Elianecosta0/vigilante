import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import WelcomeScreen from './Screens/WelcomeScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import LogIn from './Screens/LogIn';
import SignUp from './Screens/SignUp';
import ForgotPassword from './Screens/ForgotPassword';
import MoreInformation1 from './Screens/MoreInformation1';

import HomeScreen from './Screens/HomeScreen';
import CommunityScreen from './Screens/CommunityScreen';
import EmergencyScreen from './Screens/EmergencyScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MyDetails from './Screens/MyDetails';
import DonationScreen from './Screens/DonationScreen';
import MerchandiseScreen from './Screens/MerchandiseScreen';
import SettingsScreen from './Screens/SettingsScreen';
import SelfDefenseScreen from './Screens/SelfDefenceScreen';

import CustomDrawerContent from './components/CustomDrawerContent';
import CustomTabBar from './components/CustomerTabBar';


import ChatbotScreen from './Screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Main" component={BottomTabs} />
      <Drawer.Screen name="Self Defense Course" component={SelfDefenseScreen} />
      <Drawer.Screen name="Donations" component={DonationScreen} />
      <Drawer.Screen name="Merchandise" component={MerchandiseScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="MoreInformation1" component={MoreInformation1} options={{ headerShown: false }} />
      
        <Stack.Screen name="MyDetails" component={MyDetails} options={{ headerShown: false }} />

        
       
        <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
      
    </NavigationContainer>

    
  );
}


