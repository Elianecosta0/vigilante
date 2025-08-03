
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const alertsData = [
  {
    id: '1',
    victim: 'Nomvula Dlamini',
    distance: '2.3 km away',
  },
  {
    id: '2',
    victim: 'Sipho Mokoena',
    distance: '1.1 km away',
  },
  {
    id: '3',
    victim: 'Lindiwe Nkosi',
    distance: '4.5 km away',
  },
  {
    id: '4',
    victim: 'Thabo Masilela',
    distance: '0.8 km away',
  },
  {
    id: '5',
    victim: 'Zanele Mthembu',
    distance: '3.0 km away',
  },
];

const ActiveAlertsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RequestDetailsScreen', { alertId: item.id })}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={28} color="red" />
        <Text style={styles.label}>GBV</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.victimName}>{item.victim}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Active Alerts</Text>
      </View>

      <FlatList
        data={alertsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ActiveAlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    backgroundColor: '#001f3f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    alignItems: 'center',
  },
  label: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  victimName: {
    fontSize: 18,
    fontWeight: '600',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
