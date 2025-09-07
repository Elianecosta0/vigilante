import React, { useRef, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Vigilante',
    description: 'Your safe companion for reporting Gender-Based Violence and accessing support.',
    image: require('../assets/Onboarding.png'), // replace with real GBV awareness image
  },
  {
    id: '2',
    title: 'Report Incidents Quickly',
    description: 'Submit reports anonymously and get immediate guidance from professionals.',
    image: require('../assets/Onboarding.png'), // replace with real GBV awareness image
  },
  {
    id: '3',
    title: 'Connect to Support',
    description: 'Access emergency contacts, professionals, and resources tailored for your safety.',
    image: require('../assets/Onboarding.png'), // replace with real GBV awareness image
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('LogIn');
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
      extrapolate: 'clamp'
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.slide}>
        <Animated.Image
          source={item.image}
          style={[styles.image, { opacity, transform: [{ translateY }] }]}
          resizeMode="cover"
        />
        <Animated.Text style={[styles.title, { opacity, transform: [{ translateY }] }]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.description, { opacity, transform: [{ translateY }] }]}>
          {item.description}
        </Animated.Text>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, i) => {
        const dotWidth = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={`dot-${i}`}
            style={[styles.dot, { width: dotWidth, opacity }]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.replace('LogIn')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons
          name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
          size={20}
          color="#fff"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2C3A',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#1E2C3A',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E2C3A',
    marginHorizontal: 6,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#1E2C3A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

