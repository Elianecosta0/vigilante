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

  const [role, setRole] = useState(''); // 'user' or 'authority'
  const [identifier, setIdentifier] = useState(''); // username or security number
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => setSecureEntry(!secureEntry);

  const handleSignup = () => navigation.navigate('SignUp');

  const loginUser = async () => {
    setIdentifierError('');
    setPasswordError('');

    if (!role) {
      alert('Please select a role.');
      return;
    }

    if (!identifier.trim()) {
      setIdentifierError(role === 'user' ? 'Username is required' : 'Security number is required');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    // Build email based on role
    let emailToUse = '';
    if (role === 'user') {
      const cleanUsername = identifier.trim().toLowerCase();
      emailToUse = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@vigilante.com`;
    } else {
      const cleanSec = identifier.trim();
      emailToUse = cleanSec.includes('@') ? cleanSec : `${cleanSec}@vigilante.com`;
    }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(emailToUse, password);
      const userId = userCredential.user.uid;

      // Check 'users' collection first
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const userRole = userData.role || 'user';

        if (userRole === 'authority') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthorityHomeTabs' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AppDrawer' }],
          });
        }
        return;
      }

      // Check 'Authorities' collection if not found in 'users'
      const authorityDoc = await firebase.firestore().collection('Authorities').doc(identifier.trim()).get();
      if (authorityDoc.exists) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthorityHomeTabs' }],
        });
        return;
      }

      alert('User profile not found in database.');

    } catch (error) {
      console.log('Login error:', error.code, error.message);

      switch (error.code) {
        case 'auth/invalid-email':
          setIdentifierError('Please enter a valid email/identifier.');
          break;
        case 'auth/user-not-found':
          setIdentifierError('No account found with this email/identifier.');
          break;
        case 'auth/wrong-password':
          setPasswordError('Incorrect password.');
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

      <View style={{ height: 30 }} />

      {/* Role Selector */}
      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'user' && styles.selectedRole]}
          onPress={() => {
            setRole('user');
            setIdentifier('');
            setPassword('');
            setIdentifierError('');
            setPasswordError('');
          }}
        >
          <Text style={[styles.roleText, role === 'user' && { color: '#fff' }]}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'authority' && styles.selectedRole]}
          onPress={() => {
            setRole('authority');
            setIdentifier('');
            setPassword('');
            setIdentifierError('');
            setPasswordError('');
          }}
        >
          <Text style={[styles.roleText, role === 'authority' && { color: '#fff' }]}>Authority</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{role === 'authority' ? 'Security Number:' : 'Username:'}</Text>
        <TextInput
          style={styles.input}
          placeholder={role === 'authority' ? 'Enter security number' : 'Enter username'}
          placeholderTextColor="#8391A1"
          autoCapitalize="none"
          onChangeText={(text) => setIdentifier(text)}
          value={identifier}
        />
        {identifierError ? <Text style={styles.errorText}>{identifierError}</Text> : null}
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
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: -35 }}>
            <Ionicons
              name={secureEntry ? 'eye-off' : 'eye'}
              size={22}
              color="#8391A1"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
  container: { flex: 1, paddingHorizontal: 30, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: 350, height: 350, marginBottom: -100 },
  txt: { width: 300, height: 50 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#555555', marginBottom: 5, fontWeight: '600' },
  input: { height: 50, borderColor: '#DADADA', backgroundColor: '#F7F8F9', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15 },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 12, marginTop: 3 },
  button: { backgroundColor: '#1E2C3A', paddingVertical: 15, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  forgotPassword: { color: '#1E2C3A', textAlign: 'right', marginBottom: 15 },
  linkText: { color: '#1E2C3A', textAlign: 'center' },
  roleContainer: { flexDirection: 'row', marginBottom: 20 },
  roleButton: { flex: 1, backgroundColor: '#DADADA', paddingVertical: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  selectedRole: { backgroundColor: '#1E2C3A' },
  roleText: { fontWeight: 'bold', color: '#1E2C3A' },
});
