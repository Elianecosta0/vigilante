import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { db } from '../config';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';

const DonationScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch donation campaigns from Firestore
    const fetchDonations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'donationCampaigns'));
        const campaignsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // This will be "1", "2" etc.
          ...doc.data()
        }));
        setDonations(campaignsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setLoading(false);
      }
    };

    fetchDonations();

    // Optional: Real-time listener for live updates
    const unsubscribe = onSnapshot(collection(db, 'donationCampaigns'), (snapshot) => {
      const updatedCampaigns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(updatedCampaigns);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f4156" />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Donations</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Donation List */}
        <View style={styles.donationList}>
          {donations.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.donationCard}
              onPress={() => navigation.navigate('DonationPayment', {
                donation: item,
                onDonate: (amount) => {
                  // This will update the local state for immediate UI feedback
                  // Firestore updates are handled in DonationPaymentScreen
                  const updatedDonations = donations.map(d => {
                    if (d.id === item.id) {
                      const newRaised = (d.currentAmount || d.raised) + amount;
                      return {
                        ...d,
                        currentAmount: newRaised,
                        donorCount: (d.donorCount || d.donors) + 1,
                        progress: Math.min(newRaised / (d.targetAmount || d.target), 1),
                      };
                    }
                    return d;
                  });
                  setDonations(updatedDonations);
                }
              })}
            >
              {/* Image with fallback handling */}
              <View style={styles.imageContainer}>
                {getImageSource(item.image) ? (
                  <Image source={getImageSource(item.image)} style={styles.donationImage} />
                ) : (
                  <View style={styles.defaultImage}>
                    <Ionicons name="heart" size={40} color="#FF6B6B" />
                    <Text style={styles.defaultImageText}>Donation Cause</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.donationContent}>
                <Text style={styles.donationTitle}>{item.title}</Text>
                <Text style={styles.donationDescription}>{item.description}</Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { 
                      width: `${((item.currentAmount || item.raised) / (item.targetAmount || item.target)) * 100}%` 
                    }]} />
                  </View>
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>
                      Raised: R{(item.currentAmount || item.raised).toLocaleString()}
                    </Text>
                    <Text style={styles.progressText}>
                      Goal: R{(item.targetAmount || item.target).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.donationFooter}>
                  <Text style={styles.donorCount}>
                    {(item.donorCount || item.donors).toLocaleString()} donors
                  </Text>
                  <TouchableOpacity
                    style={styles.donateButton}
                    onPress={() => navigation.navigate('DonationPayment', {
                      donation: item,
                      onDonate: (amount) => {
                        const updatedDonations = donations.map(d => {
                          if (d.id === item.id) {
                            const newRaised = (d.currentAmount || d.raised) + amount;
                            return {
                              ...d,
                              currentAmount: newRaised,
                              donorCount: (d.donorCount || d.donors) + 1,
                              progress: Math.min(newRaised / (d.targetAmount || d.target), 1),
                            };
                          }
                          return d;
                        });
                        setDonations(updatedDonations);
                      }
                    })}
                  >
                    <Text style={styles.donateButtonText}>Donate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to handle image sources - FIXED VERSION
const getImageSource = (imageName) => {
  try {
    if (imageName === 'photo1.jpg') {
      return require('../assets/photo1.jpg');
    } else if (imageName === 'photo3.jpg') {
      return require('../assets/photo3.jpg');
    }
    // Return null if image not found - will show default placeholder
    return null;
  } catch (error) {
    console.log('Image not found, using placeholder:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  donationList: { 
    paddingHorizontal: 16, 
    paddingBottom: 20 
  },
  donationCard: { 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    marginBottom: 20, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    overflow: 'hidden' 
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f9fa',
  },
  donationImage: { 
    width: '100%', 
    height: 160 
  },
  defaultImage: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  defaultImageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  donationContent: { 
    padding: 16 
  },
  donationTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8 
  },
  donationDescription: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 16, 
    lineHeight: 20 
  },
  progressContainer: { 
    marginBottom: 16 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 3, 
    marginBottom: 8 
  },
  progressFill: { 
    height: 6, 
    backgroundColor: '#2f4156', 
    borderRadius: 3 
  },
  progressTextContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  progressText: { 
    fontSize: 12, 
    color: '#666' 
  },
  donationFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  donorCount: { 
    fontSize: 13, 
    color: '#999' 
  },
  donateButton: { 
    backgroundColor: '#2f4156', 
    borderRadius: 20, 
    paddingVertical: 8, 
    paddingHorizontal: 20 
  },
  donateButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});

export default DonationScreen;
