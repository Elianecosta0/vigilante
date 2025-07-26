import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = ['All', 'Defence', 'Tech', 'Merch', 'Style'];

const products = [
  { id: '1', brand: 'Vigilante', name: 'Safety keychain', category: 'Defence', price: 129.99, rating: 4.3, image: require('../assets/SafetyKeychain.webp') },
  { id: '2', brand: 'Vigilante', name: 'Pepper spray', category: 'Defence', price: 139.99, rating: 4.6, image: require('../assets/PepperSpray.jpg') },
  { id: '3', brand: 'Vigilante', name: 'Personal alarm', category: 'Defence', price: 149.99, rating: 4.4, image: require('../assets/PersonalAlarm.jpg') },
  { id: '4', brand: 'Vigilante', name: 'AirTag keychain', category: 'Tech', price: 349.99, rating: 4.8, image: require('../assets/AirTag.jpg') },
  { id: '5', brand: 'Vigilante', name: 'Whistle', category: 'Defence', price: 79.99, rating: 4.5, image: require('../assets/Whistle.jpg') },
  { id: '6', brand: 'Vigilante', name: 'Self-defense ring', category: 'Style', price: 189.99, rating: 4.6, image: require('../assets/SelfDefenceRing.jpg') },
  { id: '7', brand: 'Vigilante', name: 'Door alarm', category: 'Tech', price: 299.99, rating: 4.3, image: require('../assets/DoorAlarm.png') },
  { id: '8', brand: 'Vigilante', name: 'Window lock', category: 'Tech', price: 199.99, rating: 4.7, image: require('../assets/WindowLock.webp') },
  { id: '9', brand: 'Vigilante', name: 'Flashlight taser', category: 'Defence', price: 379.99, rating: 4.4, image: require('../assets/FlashLightTaser.png') },
  { id: '10', brand: 'Vigilante', name: 'Emergency whistle', category: 'Defence', price: 99.99, rating: 4.7, image: require('../assets/EmergencyWhistle.webp') },
  { id: '11', brand: 'Vigilante', name: 'Stun gun', category: 'Defence', price: 449.99, rating: 4.7, image: require('../assets/StunGun.jpeg') },
  { id: '12', brand: 'Vigilante', name: 'Defense pen', category: 'Merch', price: 159.99, rating: 4.2, image: require('../assets/DefensePen.webp') },
  { id: '13', brand: 'Vigilante', name: 'Hidden blade comb', category: 'Style', price: 129.99, rating: 4.7, image: require('../assets/HiddenBladeComb.jpg') },
  { id: '14', brand: 'Vigilante', name: 'Portable siren', category: 'Defence', price: 219.99, rating: 4.7, image: require('../assets/SmartTracker.jpg') },
  { id: '15', brand: 'Vigilante', name: 'Smart tracker', category: 'Tech', price: 399.99, rating: 4.4, image: require('../assets/SmartTracker.jpg') },
  { id: '16', brand: 'Vigilante', name: 'UV marking pen', category: 'Merch', price: 89.99, rating: 4.4, image: require('../assets/UVMarkingPen.webp') },
  { id: '17', brand: 'Vigilante', name: 'Safety bracelet', category: 'Style', price: 169.99, rating: 4.4, image: require('../assets/SafetyBraclet.webp') },
  { id: '18', brand: 'Vigilante', name: 'Emergency bracelet', category: 'Style', price: 189.99, rating: 4.9, image: require('../assets/EmergencyBraclet.webp') },
  { id: '19', brand: 'Vigilante', name: 'GPS charm', category: 'Tech', price: 319.99, rating: 4.3, image: require('../assets/GPSCharm.webp') },
  { id: '20', brand: 'Vigilante', name: 'Shock-proof case', category: 'Merch', price: 179.99, rating: 4.7, image: require('../assets/ShockProofCaase.webp') },
];

const screenWidth = Dimensions.get('window').width;

export default function MerchandiseScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchActive, setSearchActive] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'All') return true;
    return product.category === selectedCategory;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('Product', { product: item })}
    >
      <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      <Text style={styles.itemBrand}>{item.brand}</Text>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>R{item.price}</Text>
        <Ionicons name="add-circle" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title1}>Merchandise</Text>
          <Ionicons name="cart" size={22} color="#fff" />
        </View>

        <View style={styles.searchWrapper}>
          {searchActive ? (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Looking for merch"
                placeholderTextColor="#999"
                autoFocus
                onBlur={() => setSearchActive(false)}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setSearchActive(true)}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.textHeader}>
        <Text style={styles.title}>SHOP</Text>
        <Text style={styles.title}>WITH PURPOSE</Text>
        <Text style={styles.subtitle}>Find the Perfect Piece That Gives Back</Text>
      </View>

      <View style={styles.tabs}>
        {categories.map((category) => (
          <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.tabText,
                selectedCategory === category && styles.tabTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2f4156',
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title1: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
    width: 220,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  textHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 14,
    justifyContent: 'space-between',
  },
  tabText: {
    fontSize: 15,
    color: '#999',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  itemCard: {
    width: (screenWidth - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    height: 230,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  itemImage: {
    width: '100%',
    height: 130,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemBrand: {
    fontSize: 12,
    color: '#555',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
