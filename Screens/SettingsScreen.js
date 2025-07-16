import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {/* handle deletion */} },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar with hamburger menu */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Screen title */}
      <Text style={styles.title}>Settings</Text>

      {/* My Details */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => navigation.navigate('MyDetails')}
      >
        <Text style={styles.sectionText}>My Details</Text>
        <Icon name="chevron-forward-outline" size={20} />
      </TouchableOpacity>

      {/* Options */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
        >
          <Icon name="person-outline" size={20} />
          <Text style={styles.optionText}>Edit profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Icon name="shield-checkmark-outline" size={20} />
          <Text style={styles.optionText}>Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Icon name="help-circle-outline" size={20} />
          <Text style={styles.optionText}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Icon name="log-out-outline" size={20} />
          <Text style={styles.optionText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Delete account */}
      <View style={styles.deleteCard}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={20} color="red" />
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  optionText: {
    fontSize: 16,
  },
  deleteCard: {
    backgroundColor: '#fce8e8',
    borderRadius: 10,
    padding: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
  },
});

