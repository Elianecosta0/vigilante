import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuScreen = ({ navigation }) => {
  const handlePress = (route) => {
    // Example: you could navigate to other screens
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <View style={styles.profileContainer}>
      
        <Text style={styles.username}>CtrlCommanders</Text>
      </View>

      {/* Menu Items */}
      <MenuItem label="Home" icon="home-outline" onPress={() => handlePress('Home')} />
      <MenuItem label="Self defense course" icon="shield-checkmark-outline" onPress={() => handlePress('SelfDefence')} />
      <MenuItem label="Donations" icon="card-outline" onPress={() => {}} />
      <MenuItem label="Merchandise" icon="shirt-outline" onPress={() => {}} />
      <MenuItem label="Settings" icon="settings-outline" onPress={() => handlePress('Settings')} />
      <MenuItem label="Log out" icon="log-out-outline" onPress={() => console.log('Logging out...')} />
    </View>
  );
};

const MenuItem = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" style={{ marginRight: 20 }} />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,  
    color: '#333',
  },
});
