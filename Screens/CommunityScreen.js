import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CommunityScreen() {
  const navigation = useNavigation();

  const handleAddPress = () => {
    alert('Plus button pressed!');
    // navigation.navigate('CreatePost');
  };

  return (
    <View style={styles.container}>
      {/* Header with drawer and add icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity onPress={handleAddPress}>
          <Ionicons name="add" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Community!</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Text style={styles.chatButtonText}>Talk to SafeSpace Bot 💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    backgroundColor: '#800080',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

