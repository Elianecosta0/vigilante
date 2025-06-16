import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

const OnboardingScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/Onboarding.png')}
        style={[
          styles.image,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotate },
            ],
          },
        ]}
        resizeMode="contain"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Stay Safe!</Text>
        <Text style={styles.subtitle}>
          Your safety companion at all times. Your safety matters to us at Vigilante. By using this app, you agree to share your location, receive alerts, and allow emergency contact access.
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.createAccountButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={[styles.buttonText, styles.createAccountText]}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LogIn')}
        >
          <Text style={styles.buttonText}>LogIn Now</Text>
        </TouchableOpacity>        
      </View>

    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '120%',
    height: 400,
    marginBottom: -70,
  },
  contentContainer: {
    width: '100%',
    marginTop: 110,  
    alignItems: 'center',
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
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2F4156',
    marginBottom: 15,
    alignItems: 'center',
  },
  createAccountButton: {
    backgroundColor: '#2F4156',
  },
  buttonText: {
    color: '#2F4156',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountText: {
    color: '#fff',
  },
});
