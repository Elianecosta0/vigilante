import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/vigilante-logo.png')} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Stay Safe!</Text>
      <Text style={styles.subtitle}>
        Your safety companion at all times.
        Your safety matters to us at Vigilante. By using this app, you agree to share your location, receive alerts, and allow emergency contact access.
      </Text>
       {/* Added buttons */}
      <TouchableOpacity
        style={[styles.button, styles.createAccountButton]}
        onPress={() => navigation.navigate('SignUp')} // navigates to SignUp screen
      >
        <Text style={[styles.buttonText, styles.createAccountText]}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LogIn')} // navigates to LogIn screen
      >
        <Text style={styles.buttonText}>LogIn Now</Text>
      </TouchableOpacity>

     

      
        
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // change to your Figma background color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#000', // black or your Figma primary color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: '#444', // different color to distinguish or same as needed
  },
  createAccountText: {
    color: '#fff',
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
