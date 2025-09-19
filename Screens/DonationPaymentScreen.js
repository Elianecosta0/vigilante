import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';

const DonationPaymentScreen = ({ route, navigation }) => {
  const { donation, onDonate } = route.params;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return Alert.alert('Invalid amount', 'Please enter a valid donation amount in Rands.');
    }
    if (!cardNumber || !expiry || !cvc) {
      return Alert.alert('Incomplete details', 'Please fill in all card details.');
    }

    const donatedAmount = Number(amount);

    if (onDonate) onDonate(donatedAmount);

    Alert.alert(
      'Thank You!',
      `Your donation of R${donatedAmount.toLocaleString()} has been received for "${donation.title}".`
    );

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Donate to {donation.title}</Text>

        <TextInput
          style={styles.input}
          placeholder="Donation Amount (R)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry MM/YY"
          value={expiry}
          onChangeText={setExpiry}
        />
        <TextInput
          style={styles.input}
          placeholder="CVC"
          keyboardType="numeric"
          value={cvc}
          onChangeText={setCvc}
        />

        <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
          <Text style={styles.donateButtonText}>Confirm Donation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 16 },
  donateButton: { backgroundColor: '#FF6B6B', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  donateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DonationPaymentScreen;
