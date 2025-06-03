import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const glitch1 = useRef(new Animated.Value(0)).current;
  const glitch2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glitchAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glitch1, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitch1, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitch2, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(glitch2, {
          toValue: 0,
          duration: 70,
          useNativeDriver: true,
        }),
      ])
    );

    glitchAnimation.start();

    const timer = setTimeout(() => {
      glitchAnimation.stop();
      navigation.replace('MainApp');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const offset1 = glitch1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const offset2 = glitch2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  return (
    <View style={styles.container}>
      {/* Base image (original color) */}
      <Image
        source={require('../assets/vigilante-logo.png')}
        style={[styles.image, { position: 'absolute' }]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require('../assets/vigilante-logo.png')}
        style={[
          styles.image,
          {
            position: 'absolute',
            opacity: 0.4,
            transform: [{ translateX: offset1 }],
          },
        ]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require('../assets/vigilante-logo.png')}
        style={[
          styles.image,
          {
            position: 'absolute',
            opacity: 0.4,
            transform: [{ translateX: offset2 }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F4156',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 270,
    height: 270,
  },
});
