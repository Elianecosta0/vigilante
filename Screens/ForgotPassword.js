import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../config';
import Toast, { BaseToast } from 'react-native-toast-message';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address',
      });
      return;
    }

    setLoading(true);
    // Show initial loading toast
    Toast.show({
      type: 'loading',
      text1: 'Sending...',
      position: 'top',
      autoHide: false,
    });

    try {
      await firebase.auth().sendPasswordResetEmail(email);

      // Hide loading toast
      Toast.hide();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset email sent. Please check your inbox.',
      });
      setTimeout(() => {
  navigation.goBack();
}, 3000); 

      setEmail('');
     // navigation.goBack();
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Toast.hide();
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color="#1E2C3A" />
      </TouchableOpacity>

      <View style={styles.topSection}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Don't worry! It happens. Enter the email address linked with your account.
        </Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#8391A1"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSendCode}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Remember Password? Log In</Text>
        </TouchableOpacity>
      </View>

      <Toast
        config={{
          success: (props) => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: '#1E2C3A', backgroundColor: '#1E2C3A' }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
              text2Style={{ fontSize: 14, color: '#fff' }}
            />
          ),
          error: (props) => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: '#e74c3c', backgroundColor: '#e74c3c' }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
              text2Style={{ fontSize: 14, color: '#fff' }}
            />
          ),
          loading: () => (
            <View
              style={{
                height: 60,
                backgroundColor: '#1E2C3A',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sending...</Text>
            </View>
          ),
        }}
        position="top"
        topOffset={50}
      />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30 },
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
  topSection: { flex: 1, justifyContent: 'flex-end' },
  middleSection: { flex: 1, justifyContent: 'center' },
  bottomSection: { flex: 1, justifyContent: 'flex-end', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', textAlign: 'left', marginBottom: 10 },
  description: { fontSize: 15, color: '#555555', textAlign: 'left', marginTop: 10, marginBottom: 30 },
  inputGroup: { marginBottom: 145 },
  label: { fontSize: 14, color: '#555555', marginBottom: 5, fontWeight: '600' },
  input: { height: 50, borderColor: '#DADADA', backgroundColor: '#F7F8F9', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15 },
  button: { backgroundColor: '#1E2C3A', paddingVertical: 15, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#1E2C3A', textAlign: 'center', fontSize: 15 },
});


