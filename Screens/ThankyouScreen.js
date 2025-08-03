import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../components/CartContext'; 

const ThankyouScreen = () => {
  const navigation = useNavigation();
  const { clearCart } = useContext(CartContext);

  const handleContinueShopping = () => {
    clearCart();  
    navigation.navigate('MainApp', { screen: 'Merchandise' }); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={100} color="#2f4156" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.message}>
        A certain Percent From All Your Purchased Items{'\n'}
        Will Be Donated To Help A good Casue
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinueShopping}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ThankyouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#2f4156',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
