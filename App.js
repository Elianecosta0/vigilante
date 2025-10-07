
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CartProvider } from './components/CartContext';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-toast-message';


import WelcomeScreen from './Screens/WelcomeScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import AddPosterScreen from './Screens/AddPosterScreen';
import LogIn from './Screens/LogIn';
import SignUp from './Screens/SignUp';
import ForgotPassword from './Screens/ForgotPassword';

import MoreInformation1 from './Screens/MoreInformation1';
import AddEmergencyContactScreen from './Screens/AddEmergContact';
import ViewContactScreen from './Screens/ViewContactScreen';
import MissingPersonDetails from './Screens/MissingPersonDetails';
import PrivateChatScreen from './Screens/PrivateChatScreen';


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
import PlaylistScreen from "./Screens/PlaylistScreen";

import CommentsScreen from './Screens/CommentsScreen';
import SendReportScreen from './Screens/SendMessageScreen';
import ReportScreen from './Screens/ReportScreen';
import MyReportsScreen from './Screens/MyReportsScreen';


import TotalScreen from './Screens/TotalScreen';
import CardDetails from './Screens/CardDetails';
import ConfirmationScreen from './Screens/ConfirmationScreen';
import ThankyouScreen from './Screens/ThankyouScreen';
import CartScreen from './Screens/CartScreen';
import ContactProfessionalsScreen from './Screens/contact_professionals_screen';


import ChatScreen from './Screens/ChatScreen';

import CustomDrawerContent from './components/CustomDrawerContent';
import CustomTabBar from './components/CustomerTabBar';

import ChatbotScreen from './Screens/ChatbotScreen';
import GroupChatScreen from './Screens/GroupChatScreen';
import GroupDetailScreen from './Screens/GroupDetailScreen';
import SeeAll from './Screens/SeeAll';

import AlertScreen from './Screens/AlertScreen';
import ActiveAlertsScreen from './Screens/ActiveAlertsScreen';
import LiveLocationScreen from './Screens/LiveLocationScreen';
import RequestDetailsScreen from './Screens/RequestDetailsScreen';
import UserProfileScreen from './Screens/UserProfileScreen';

import { firebase } from './config';
import { useEffect, useState } from 'react';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tabs Navigator
function BottomTabs() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;

    if (!userId) return;

    const unsubscribe = firebase
      .firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .onSnapshot(snapshot => {
        let hasUnread = false;
        snapshot.forEach(doc => {
          const data = doc.data();
          if (!data.isRead) {
            hasUnread = true;
          }
        });
        setHasUnreadNotifications(hasUnread);
      });

    return () => unsubscribe();
  }, []);
  return (
    <Tab.Navigator
  tabBar={(props) => <CustomTabBar {...props} hasUnreadNotifications={hasUnreadNotifications} />}
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

// Drawer Navigator wrapping BottomTabs and other drawer screens
function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerType: 'front' }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Tabs" component={BottomTabs} />
      <Drawer.Screen name="SelfDefense" component={SelfDefenseScreen} />
      <Drawer.Screen name="Donations" component={DonationScreen} />
      <Drawer.Screen name="Merchandise" component={MerchandiseScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      

    </Drawer.Navigator>
  );
}

// Stack Navigator handling auth flow and main app flow
export default function App() {
  return (
    <RootSiblingParent>
    <CartProvider>
    <NavigationContainer>


      <Stack.Navigator initialRouteName="Welcome"  screenOptions={{ headerShown: false }} >

        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        

        {/* Main app drawer */}
        <Stack.Screen name="AppDrawer" component={AppDrawer} />

        {/* Screens inside app flow but not part of tabs/drawer */}
         <Stack.Screen name="MoreInformation1" component={MoreInformation1} />
                <Stack.Screen name="AddPoster" component={AddPosterScreen} />
                <Stack.Screen name="AddContact" component={AddEmergencyContactScreen} />
                <Stack.Screen name="ViewContact" component={ViewContactScreen} />
                <Stack.Screen name="MyDetails" component={MyDetails} />
                <Stack.Screen name="SeeAll" component={SeeAll} />
                <Stack.Screen name="Chatbot" component={ChatbotScreen} />
                <Stack.Screen name="DonationDetails" component={DonationDetails} />
                <Stack.Screen name="MissingPersonDetails" component={MissingPersonDetails} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
                <Stack.Screen name="CardDetails" component={CardDetails} />
                <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} />
                <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                <Stack.Screen name="GroupChat" component={GroupChatScreen} />
                <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
                <Stack.Screen name="AlertScreen" component={AlertScreen} />
                <Stack.Screen name="ActiveAlertsScreen" component={ActiveAlertsScreen} />
                <Stack.Screen name="LiveLocationScreen" component={LiveLocationScreen} />
                <Stack.Screen name="RequestDetailsScreen" component={RequestDetailsScreen} />
                <Stack.Screen name="Comments" component={CommentsScreen} />
                <Stack.Screen name="SendMessage" component={SendReportScreen} />
                <Stack.Screen name="ReportScreen" component={ReportScreen} />
                 <Stack.Screen name="MyReportsScreen" component={MyReportsScreen} />
                 <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
                 <Stack.Screen name="UserProfile" component={UserProfileScreen} />

                  <Stack.Screen 
    name="ContactProfessionals" 
    component={ContactProfessionalsScreen} 
    options={{ headerShown: false }} />


      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
    </RootSiblingParent>
  );
}