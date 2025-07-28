import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

const LogIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const loginUser = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    try {
      await firebase.auth().signInWithEmailAndPassword(email.trim(), password);
      navigation.navigate('AppDrawer'); // ✅ make sure this route exists
    } catch (error) {
      console.log('Login error:', error.code);

      switch (error.code) {
        case 'auth/invalid-email':
          setEmailError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setEmailError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setPasswordError('Incorrect password.');
          break;
        case 'auth/invalid-credential':
          alert('The supplied auth credential is incorrect or malformed.');
          break;
        default:
          alert(error.message);
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#8391A1"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter your password"
            placeholderTextColor="#8391A1"
            secureTextEntry={secureEntry}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={secureEntry ? 'eye-off' : 'eye'}
              size={22}
              color="#8391A1"
              style={{ marginLeft: -35 }}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />

      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LogIn;

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
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
