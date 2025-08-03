import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlertScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />

      {/* Page Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>ALERT</Text>
      </View>

      <Ionicons name="warning" size={80} color="red" style={styles.icon} />

      <Text style={styles.gbvText}>GBV</Text>
      <Text style={styles.urgentText}>URGENT</Text>

      <Image
        source={{
          uri: 'https://thumbs.dreamstime.com/b/portrait-happy-female-generation-z-person-profile-picture-head-shot-beautiful-positive-young-woman-having-attractive-appearance-328069168.jpg',
        }}
        style={styles.profileImage}
      />

      <Text style={styles.name}>Nomvula Dlamini</Text>

      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.buttonText}>ACCEPT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlertScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 40,
  },
  headerBar: {
    width: '100%',
    backgroundColor: '#001f3f', // Navy blue
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 10,
  },
  gbvText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  urgentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginVertical: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 40,
  },
  acceptButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
