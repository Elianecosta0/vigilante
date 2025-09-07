import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';

const VerificationScreen = ({ route, navigation }) => {
  const { verificationId, role } = route.params;
  const [verificationCode, setVerificationCode] = useState('');

  const verify2FACode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        await currentUser.linkWithCredential(credential).catch(async err => {
          if (err.code === 'auth/provider-already-linked') {
            // Already linked, continue
          } else {
            throw err;
          }
        });
      }

      // Navigate after successful 2FA
      if (role === 'user') navigation.replace('AppDrawer');
      else if (role === 'authority') navigation.replace('ActiveAlertsScreen');
    } catch (error) {
      console.log('2FA error:', error);
      Alert.alert(
        'Error',
        error.message.includes('verification code')
          ? 'Invalid verification code. Try again.'
          : error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="numeric"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <TouchableOpacity style={styles.button} onPress={verify2FACode}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

