import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function MoreInformation1({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>More Information</Text>
    <Text style={styles.description}>
       This information is needed to make it easier to identify you in times of need.
      </Text>

    <Text>Name:</Text>
      <TextInput style={styles.input} placeholder="Full Name" />
      <Text >DOB: </Text>
      <TextInput style={styles.input} placeholder="Date of Birth" />
      <Text >Gender </Text>
      <TextInput style={styles.input} placeholder="Gender" />
      <Text >Height:  </Text>
      <TextInput style={styles.input} placeholder="Height" />
      <Text >Weight: </Text>
      <TextInput style={styles.input} placeholder="Weight" />
      <Text >Identifying Feature:  </Text>
      <TextInput style={styles.input} placeholder="Specific Identifying Features" />
      



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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
