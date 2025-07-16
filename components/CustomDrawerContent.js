// components/CustomDrawerContent.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = ({ navigation }) => {
  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        
        <Text style={styles.username}>CtrlCommanders</Text>
      </View>

      {/* Menu items */}
      <MenuItem icon="home-outline" label="Home" onPress={() => navigation.navigate('Home')} />
      <MenuItem icon="shield-checkmark-outline" label="Self Defense Course" onPress={() => navigation.navigate('Self Defense Course')} />
      <MenuItem icon="card-outline" label="Donations" onPress={() => navigation.navigate('Donations')}/>
      <MenuItem icon="shirt-outline" label="Merchandise" onPress={() => navigation.navigate('Merchandise')} />
      <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
      <MenuItem icon="log-out-outline" label="Log Out" onPress={() => console.log('Logging out...')} />
    </DrawerContentScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#333" style={{ marginRight: 15 }} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
