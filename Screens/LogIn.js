import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LogIn({ navigation }) {
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
        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
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
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>


      <View style={{ height: 50 }} />

      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainApp')}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
    marginBottom: 0,
  },
  inputGroup: {
  marginBottom: 15, 
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
    marginBottom: 0,

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
  forgotPassword: {
    color: '#1E2C3A',
    textAlign: 'right',
    marginBottom: 15,
  },
  linkText: {
    color: '#1E2C3A',
    textAlign: 'center',
  },
});
