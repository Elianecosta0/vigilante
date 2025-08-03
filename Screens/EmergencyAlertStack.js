import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlertScreen from './AlertScreen';
import LiveLocationScreen from './LiveLocationScreen';
import RequestDetailsScreen from './RequestDetailsScreen';
import ActiveAlertsScreen from './ActiveAlertsScreen';

const Stack = createNativeStackNavigator();

const EmergencyAlertStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Alert" component={AlertScreen} />
      <Stack.Screen name="Live Location" component={LiveLocationScreen} />
      <Stack.Screen name="Request Details" component={RequestDetailsScreen} />
      <Stack.Screen name="Active Alerts" component={ActiveAlertsScreen} />
    </Stack.Navigator>
  );
};

export default EmergencyAlertStack;
