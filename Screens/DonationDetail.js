import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const DonationDetails = ({ route, navigation }) => {
  const { donation } = route.params;

  return (
    <View style={styles.container}>
      {/* Header with Drawer Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Ionicons name="menu" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation Details</Text>
        <View style={{ width: 26 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Donation Image */}
        <Image source={donation.image} style={styles.image} />

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{donation.title}</Text>
          <Text style={styles.description}>{donation.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${donation.progress * 100}%` }]} />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Raised: {donation.raised}</Text>
              <Text style={styles.progressText}>Goal: {donation.target}</Text>
            </View>
          </View>

          {/* Donor Count */}
          <Text style={styles.donorCount}>{donation.donors}</Text>

          {/* Extra Description (like Figma) */}
          <View style={styles.extraDescriptionContainer}>
            <Text style={styles.extraDescriptionTitle}>Description</Text>
            <Text style={styles.extraDescriptionText}>
              Your contribution helps us provide vital resources to those in need. Every donation counts in creating a safe and supportive community.Your donation provides urgent support to those affected by gender-based violence — including access to safe shelter, medical care, counseling, legal protection, and trauma recovery services. Every contribution helps restore hope, healing, and a path toward independence.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Donate Button at Bottom */}
      <TouchableOpacity style={styles.donateButton}>
        <Text style={styles.donateButtonText}>Donate Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  image: { width: '100%', height: 250 },
  detailsContainer: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 15, color: '#666', marginBottom: 16, lineHeight: 22 },

  progressContainer: { marginBottom: 16 },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: { height: 8, backgroundColor: '#FF6B6B', borderRadius: 4 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 13, color: '#666' },

  donorCount: { fontSize: 14, color: '#999', marginBottom: 20 },

  extraDescriptionContainer: { marginTop: 20 },
  extraDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  extraDescriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },

  donateButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  donateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DonationDetails;
