import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../components/CartContext';

const CardDetails = () => {
  const navigation = useNavigation();
  const { cartItems, getTotalPrice } = useContext(CartContext);
  const totalAmount = getTotalPrice ? getTotalPrice() : 0;

  const [selectedMethod, setSelectedMethod] = useState('Visa');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods = [
    { name: 'Visa', icon: 'card-outline' },
    { name: 'PayPal', icon: 'logo-paypal' },
    { name: 'Apple Pay', icon: 'logo-apple' },
  ];

  const handleContinue = () => {
    if (selectedMethod === 'Visa') {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        Alert.alert('Error', 'Please fill all card details.');
        return;
      }
    }

    navigation.navigate('ConfirmationScreen', {
      cardDetails: { cardName, cardNumber, expiry, cvv, method: selectedMethod },
      cartItems,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Add Payment Method</Text>

        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.name}
              style={[
                styles.paymentOption,
                selectedMethod === method.name && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedMethod(method.name)}
            >
              <Ionicons
                name={method.icon}
                size={24}
                color={selectedMethod === method.name ? '#fff' : '#333'}
              />
              <Text
                style={[
                  styles.paymentText,
                  selectedMethod === method.name && { color: '#fff' },
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMethod === 'Visa' && (
          <>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="CtrlCommanders"
              placeholderTextColor="#8391A1"
              value={cardName}
              onChangeText={setCardName}
            />

            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              placeholderTextColor="#8391A1"
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expiry Date</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="calendar-outline" size={20} color="#8391A1" style={styles.icon} />
                  <TextInput
                    style={styles.innerInput}
                    placeholder="MM/YY"
                    placeholderTextColor="#8391A1"
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>CVV</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8391A1" style={styles.icon} />
                  <TextInput
                    style={styles.innerInput}
                    placeholder="123"
                    keyboardType="number-pad"
                    placeholderTextColor="#8391A1"
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleContinue}>
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  paymentOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
  },
  paymentOptionSelected: {
    backgroundColor: '#2f4156',
    borderColor: '#2f4156',
  },
  paymentText: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F7F8F9',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 6,
  },
  innerInput: {
    flex: 1,
    height: 45,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2f4156',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
