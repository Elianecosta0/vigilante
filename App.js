import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CartProvider } from './components/CartContext';
import { RootSiblingParent } from 'react-native-root-siblings';

import WelcomeScreen from './Screens/WelcomeScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import LogIn from './Screens/LogIn';
import SignUp from './Screens/SignUp';
import ForgotPassword from './Screens/ForgotPassword';
import MoreInformation1 from './Screens/MoreInformation1'
// import MoreInformation2 from './Screens/MoreInformation2';


import HomeScreen from './Screens/HomeScreen';
import CommunityScreen from './Screens/CommunityScreen';
import EmergencyScreen from './Screens/EmergencyScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MyDetails from './Screens/MyDetails';
import DonationScreen from './Screens/DonationScreen';
import DonationDetails from './Screens/DonationDetail';
import MerchandiseScreen from './Screens/MerchandiseScreen';
import ProductScreen from './Screens/ProductsScreen';
import SettingsScreen from './Screens/SettingsScreen';
import SelfDefenseScreen from './Screens/SelfDefenceScreen';

import TotalScreen from './Screens/TotalScreen';
import CardDetails from './Screens/CardDetails';
import ConfirmationScreen from './Screens/ConfirmationScreen';
import ThankyouScreen from './Screens/ThankyouScreen';
import CartScreen from './Screens/CartScreen';

import CustomDrawerContent from './components/CustomDrawerContent';
import CustomTabBar from './components/CustomerTabBar';
import SeeAll from './Screens/SeeAll';
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


// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerType: 'front' }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
     
      <Drawer.Screen name="SelfDefense" component={SelfDefenseScreen} />

      <Drawer.Screen name="Donations" component={DonationScreen} />
      <Drawer.Screen name="Merchandise" component={MerchandiseScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// App Entry
export default function App() {
  return (
    <RootSiblingParent>
    <CartProvider>
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="MoreInformation1" component={MoreInformation1} options={{ headerShown: false }} />
        {/* <Stack.Screen name="MoreInformation2" component={MoreInformation2} options={{ headerShown: false }} /> */}
        <Stack.Screen name="MyDetails" component={MyDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />

        <Stack.Screen name="CartScreen" component={CartScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="CardDetails" component={CardDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} options={{ headerShown: false }} />

        <Stack.Screen name="SeeAll" component={SeeAll} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="DonationDetails" component={DonationDetails} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
    </RootSiblingParent>
  );
}

