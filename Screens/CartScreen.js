// Screens/CartScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CartContext } from '../components/CartContext'; 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const navigation = useNavigation();

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R{item.price}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Ionicons name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>R{getTotalPrice()}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('CardDetails')}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  list: { padding: 16, paddingBottom: 180 },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  itemDetails: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: 'gray', marginTop: 4 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  quantityText: { marginHorizontal: 8, fontSize: 16 },
  remove: { color: 'red', marginTop: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: 'gray' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  checkoutButton: {
    backgroundColor: '#2f4156',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});


