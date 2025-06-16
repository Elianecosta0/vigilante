import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MoreInformation1({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color="#1E2C3A" />
      </TouchableOpacity>

      <Text style={styles.title}>More Information</Text>
      <Text style={styles.description}>
        This information is needed to make it easier to identify you in times of need.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#8391A1" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TextInput style={styles.input} placeholder="DD/MM/YYYY" placeholderTextColor="#8391A1" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender:</Text>
        <TextInput style={styles.input} placeholder="e.g. Female / Male / Other" placeholderTextColor="#8391A1" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height:</Text>
        <TextInput style={styles.input} placeholder="e.g. 5'7 or 170cm" placeholderTextColor="#8391A1" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight:</Text>
        <TextInput style={styles.input} placeholder="e.g. 70kg" placeholderTextColor="#8391A1" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Identifying Feature:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. birthmark on neck"
          placeholderTextColor="#8391A1"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MoreInformation2')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingTop: 35,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 80,
    left: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    marginRight: -20,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 15,
    paddingVertical: -3, 
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#DADADA',
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },
  button: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
