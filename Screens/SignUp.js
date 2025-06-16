import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SignUp({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/vigilante-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/Vigilantetxt.png')}
          style={styles.txt}
          resizeMode="contain"
        />
      </View>

      <View style={{ height: 90 }} />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Name:</Text>
        <TextInput
          placeholder="User Name"
          style={styles.input}
          placeholderTextColor="#8391A1"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#8391A1"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password:</Text>
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#8391A1"
        />
      </View>

      <View style={{ height: 20 }} />

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MoreInformation1')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: -100,
  },
  txt: {
    width: 300,
    height: 50,
    marginBottom: -30,
  },
  inputGroup: {
    marginBottom: 5,
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
    marginBottom: 20,

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
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1E2C3A',
    textAlign: 'center',
  },
});
