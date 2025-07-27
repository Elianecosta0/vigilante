import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { cartItems = [], totalAmount = 0, cardDetails = {} } = route.params || {};

  const maskCardNumber = (number = '') => {
    const last4 = number.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const handleConfirmPayment = () => {
    navigation.navigate('ThankyouScreen', {});
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
        <Text style={styles.price}>R{(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Order</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <Text style={styles.sectionTitle}>Your Items</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>R{totalAmount.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.cardDetails}>
          <Ionicons name="card-outline" size={28} color="#2f4156" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.cardName}>{cardDetails.cardName || 'N/A'}</Text>
            <Text style={styles.cardNumber}>
              {maskCardNumber(cardDetails.cardNumber || '')}
            </Text>
            <Text style={styles.expiry}>Expiry: {cardDetails.expiry || '--/--'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f4156',
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    marginTop: 16,
  },
  cardName: {
    fontWeight: '600',
    fontSize: 16,
  },
  cardNumber: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  expiry: {
    marginTop: 2,
    fontSize: 14,
    color: '#555',
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#2f4156',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
