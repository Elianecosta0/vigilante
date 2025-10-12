import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

// Separate PIN Modal Component to prevent re-renders
const PinInputModal = React.memo(({ 
  visible, 
  enteredPin, 
  pinError, 
  onPinInput, 
  onBackspace, 
  onClear, 
  onVerify, 
  onCancel 
}) => {
  const handlePinInput = useCallback((digit) => {
    onPinInput(digit);
  }, [onPinInput]);

  const handleBackspace = useCallback(() => {
    onBackspace();
  }, [onBackspace]);

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  const handleVerify = useCallback(() => {
    onVerify();
  }, [onVerify]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pinModal}>
          <Text style={styles.pinTitle}>Enter Your PIN</Text>
          <Text style={styles.pinSubtitle}>Please enter your 6-digit PIN to continue</Text>
          
          {/* PIN Display */}
          <View style={styles.pinDisplay}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinCircle,
                  index < enteredPin.length && styles.pinCircleFilled
                ]}
              />
            ))}
          </View>

          {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}

          {/* Number Pad */}
          <View style={styles.numberPad}>
            <View style={styles.numberRow}>
              {[1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numberButton}
                  onPress={() => handlePinInput(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numberRow}>
              {[4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numberButton}
                  onPress={() => handlePinInput(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numberRow}>
              {[7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numberButton}
                  onPress={() => handlePinInput(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numberRow}>
              <TouchableOpacity style={styles.numberButton} onPress={handleClear}>
                <Text style={styles.numberText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handlePinInput('0')}
              >
                <Text style={styles.numberText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberButton} onPress={handleBackspace}>
                <Text style={styles.numberText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              enteredPin.length !== 6 && styles.verifyButtonDisabled
            ]} 
            onPress={handleVerify}
            disabled={enteredPin.length !== 6}
          >
            <Text style={styles.verifyButtonText}>
              {enteredPin.length === 6 ? 'Verify PIN' : `Enter ${6 - enteredPin.length} more digit${6 - enteredPin.length === 1 ? '' : 's'}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const LogIn = () => {
  const navigation = useNavigation();

  const [role, setRole] = useState(''); // user or authority
  const [identifier, setIdentifier] = useState(''); // username or securityNumber
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // PIN Verification State
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  // Function to hash PIN (same as in SignUp)
  const hashPin = async (pin) => {
    return pin.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString();
  };

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
      if (!cleanUsername) {
        setIdentifierError('Invalid username');
        return;
      }
      emailToUse = cleanUsername.includes('@')
        ? cleanUsername
        : `${cleanUsername}@vigilante.com`;
    } else {
      const sec = identifier.trim();
      emailToUse = sec.includes('@') ? sec : `${sec}@vigilante.com`;
    }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(emailToUse, password);
      const userId = userCredential.user.uid;

      // Check users collection
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Store user data and show PIN modal
        setCurrentUser(userCredential.user);
        setUserData(userData);
        setShowPinModal(true);
        return;
      }

      // If no user doc, check Authorities collection
      const authorityDoc = await firebase.firestore().collection('Authorities').doc(identifier.trim()).get();
      if (authorityDoc.exists) {
        const authorityData = authorityDoc.data();
        
        // Store authority data and show PIN modal
        setCurrentUser(userCredential.user);
        setUserData({ ...authorityData, role: 'authority' });
        setShowPinModal(true);
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

  const verifyPin = async () => {
    if (!enteredPin || enteredPin.length !== 6) {
      setPinError('Please enter a 6-digit PIN');
      return;
    }

    try {
      // Hash the entered PIN to compare with stored hash
      const hashedEnteredPin = await hashPin(enteredPin);
      const storedPin = userData.pinCode;

      if (hashedEnteredPin === storedPin) {
        // PIN is correct - proceed with navigation
        setShowPinModal(false);
        setEnteredPin('');
        setPinError('');

        if (userData.role === 'authority') {
          navigation.navigate('AuthorityHomeTabs');
        } else {
          navigation.navigate('AppDrawer');
        }
      } else {
        setPinError('Incorrect PIN. Please try again.');
        setEnteredPin('');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setPinError('Error verifying PIN. Please try again.');
    }
  };

  const handlePinInput = useCallback((digit) => {
    if (enteredPin.length < 6) {
      setEnteredPin(prev => prev + digit);
      setPinError('');
    }
  }, [enteredPin.length]);

  const handlePinBackspace = useCallback(() => {
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError('');
  }, []);

  const handlePinClear = useCallback(() => {
    setEnteredPin('');
    setPinError('');
  }, []);

  const cancelPinVerification = useCallback(() => {
    setShowPinModal(false);
    setEnteredPin('');
    setPinError('');
    // Sign out the user since they didn't complete PIN verification
    firebase.auth().signOut();
  }, []);

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
        <Text style={styles.label}>{role === 'authority' ? 'Security Email:' : 'Username:'}</Text>
        <TextInput
          style={styles.input}
          placeholder={role === 'authority' ? 'Enter email' : 'Enter username'}
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
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={secureEntry ? 'eye-off' : 'eye'}
              size={22}
              color="#8391A1"
              style={{ marginLeft: -35 }}
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

      {/* PIN Verification Modal */}
      <PinInputModal
        visible={showPinModal}
        enteredPin={enteredPin}
        pinError={pinError}
        onPinInput={handlePinInput}
        onBackspace={handlePinBackspace}
        onClear={handlePinClear}
        onVerify={verifyPin}
        onCancel={cancelPinVerification}
      />
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
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#DADADA',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#1E2C3A',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#1E2C3A',
  },
  // PIN Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pinModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2C3A',
  },
  pinSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  pinDisplay: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'center',
  },
  pinCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1E2C3A',
    marginHorizontal: 8,
  },
  pinCircleFilled: {
    backgroundColor: '#1E2C3A',
  },
  pinError: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  numberPad: {
    width: '100%',
    marginBottom: 20,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F7F8F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2C3A',
  },
  verifyButton: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  verifyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
});

