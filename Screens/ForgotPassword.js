import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForgotPassword = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color="#1E2C3A" />
      </TouchableOpacity>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Don't worry! It happens. Enter the email address linked with your account.
        </Text>
      </View>

      {/* Middle Section */}
      <View style={styles.middleSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#8391A1"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Remember Password? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,

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
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 145,
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
  },
  button: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#1E2C3A',
    textAlign: 'center',
    fontSize: 15,
  },
});
