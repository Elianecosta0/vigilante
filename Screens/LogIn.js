import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import axios from 'axios';
import { firebase } from '../config';

const BACKEND_URL = 'https://2184388f4d68.ngrok-free.app';



const LogIn = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  // Login states
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2FA states
  const [phone, setPhone] = useState('');
  const [is2FA, setIs2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const timerRef = useRef(null);

  const togglePasswordVisibility = () => setSecureEntry(!secureEntry);

  const handleSignup = () => navigation.navigate('SignUp');

  const startTimer = () => {
    setResendTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Step 1: Email/Password Login ---
  const loginUser = async () => {
    setEmailError('');
    setPasswordError('');

    if (!role) { alert('Please select a role'); return; }
    if (!email.trim()) { setEmailError('Email is required'); return; }
    if (!password) { setPasswordError('Password is required'); return; }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email.trim(), password);
      const userId = userCredential.user.uid;
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();

      if (!userDoc.exists) { alert('Profile not found'); return; }

      const userData = userDoc.data();
      if (userData.role !== role) {
        alert(`This email is not registered as ${role}`);
        return;
      }

      if (!userData.phone) {
        alert('No phone number registered for 2FA.');
        return;
      }

      setPhone(userData.phone);
      setIs2FA(true);
      sendOtp(userData.phone);

    } catch (error) {
      console.log('Login error:', error.code);
      switch (error.code) {
        case 'auth/invalid-email': setEmailError('Invalid email'); break;
        case 'auth/user-not-found': setEmailError('User not found'); break;
        case 'auth/wrong-password': setPasswordError('Incorrect password'); break;
        default: alert(error.message); break;
      }
    }
  };

  // --- Step 2: Send OTP ---
  const sendOtp = async (phoneNumber) => {
    try {
      await axios.post(`${BACKEND_URL}/send-otp`, { phone: phoneNumber });
      startTimer();
      Alert.alert('OTP sent', `A code has been sent to ${phoneNumber}`);
    } catch (err) {
      console.log('Send OTP error:', err);
      Alert.alert('Error sending OTP', err.response?.data?.error || err.message);
    }
  };

  // --- Step 3: Verify OTP ---
  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/verify-otp`, { phone, otp });
      const { token } = res.data;

      // Sign in with Firebase custom token
      await signInWithCustomToken(auth, token);

      if (role === 'user') navigation.replace('AppDrawer');
      else if (role === 'authority') navigation.replace('ActiveAlertsScreen');

    } catch (err) {
      console.log('Verify OTP error:', err.response?.data || err.message);
      Alert.alert('Invalid OTP', err.response?.data?.error || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/vigilante-logo.png')} style={styles.image} resizeMode="contain" />
          <Image source={require('../assets/Vigilantetxt.png')} style={styles.txt} resizeMode="contain" />
        </View>

        {!is2FA ? (
          <>
            <Text style={styles.label}>Select Role:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity style={[styles.roleButton, role==='user'&&styles.selectedRole]} onPress={()=>setRole('user')}>
                <Text style={[styles.roleText, role==='user'&&{color:'#fff'}]}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton, role==='authority'&&styles.selectedRole]} onPress={()=>setRole('authority')}>
                <Text style={[styles.roleText, role==='authority'&&{color:'#fff'}]}>Authority</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Enter email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.label}>Password:</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput style={[styles.input,{flex:1}]} placeholder="Password" secureTextEntry={secureEntry} value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons name={secureEntry?'eye-off':'eye'} size={22} color="#8391A1" style={{marginLeft:-35}}/>
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={loginUser}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{marginTop:20}}>
            <Text style={styles.label}>Enter OTP sent to {phone}:</Text>
            <TextInput style={styles.input} placeholder="123456" keyboardType="number-pad" value={otp} onChangeText={setOtp} />
            <TouchableOpacity style={styles.button} onPress={verifyOtp}>
              <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={resendTimer>0} onPress={()=>sendOtp(phone)}>
              <Text style={{color:resendTimer>0?'#8391A1':'#007AFF', textAlign:'center', marginTop:15}}>
                {resendTimer>0?`Resend Code in ${resendTimer}s`:'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default LogIn;


// Styles remain the same as your original code
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: 350, height: 350, marginBottom: -100 },
  txt: { width: 300, height: 50 },
  label: { fontSize: 14, color: '#555555', marginBottom: 5, fontWeight: '600' },
  input: { height: 50, borderColor: '#DADADA', backgroundColor: '#F7F8F9', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
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
