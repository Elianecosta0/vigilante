// components/CustomDrawerContent.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = ({ navigation }) => {
  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/vigilante-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Menu Items */}
      <MenuItem
        icon="home-outline"
        label="Home"
        onPress={() =>
          navigation.navigate('AppDrawer', {
            screen: 'Tabs',
            params: { screen: 'Home' },
          })
        }
      />
      <MenuItem icon="shield-checkmark-outline" label="Self Defense Course" onPress={() => navigation.navigate('SelfDefense')} />
      <MenuItem icon="card-outline" label="Donations" onPress={() => navigation.navigate('Donations')} />
      <MenuItem icon="shirt-outline" label="Merchandise" onPress={() => navigation.navigate('Merchandise')} />
      <MenuItem icon="call" label="Emergency Contacts" onPress={() => navigation.navigate('ViewContact')} />
      <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
    </DrawerContentScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#fff" style={{ marginRight: 15 }} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#1B263B',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 80,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
});
