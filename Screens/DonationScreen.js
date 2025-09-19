import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const donations = [
  {
    id: 1,
    title: "Support Victims of Domestic Violence",
    description: "Help provide shelter and counseling for survivors",
    progress: 0.65,
    target: 50000,
    raised: 32500,
    donors: 1200,
    image: require('../assets/photo1.jpg'),
  },
  {
    id: 2,
    title: "Community Safety Initiative",
    description: "Fund neighborhood watch programs and safety workshops",
    progress: 0.35,
    target: 30000,
    raised: 10500,
    donors: 845,
    image: require('../assets/photo3.jpg'),
  },
];

const DonationScreen = ({ navigation }) => {
  const [localDonations, setLocalDonations] = useState(donations);

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
          {localDonations.map(item => (
            <TouchableOpacity
              key={item.id.toString()}
              style={styles.donationCard}
              onPress={() => navigation.navigate('DonationDetails', {
                donation: item,
                onDonate: (amount) => {
                  const updatedDonations = localDonations.map(d => {
                    if (d.id === item.id) {
                      const newRaised = d.raised + amount;
                      return {
                        ...d,
                        raised: newRaised,
                        donors: d.donors + 1,
                        progress: Math.min(newRaised / d.target, 1),
                      };
                    }
                    return d;
                  });
                  setLocalDonations(updatedDonations);
                }
              })}
            >
              <Image source={item.image} style={styles.donationImage} />
              <View style={styles.donationContent}>
                <Text style={styles.donationTitle}>{item.title}</Text>
                <Text style={styles.donationDescription}>{item.description}</Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
                  </View>
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>Raised: R{item.raised.toLocaleString()}</Text>
                    <Text style={styles.progressText}>Goal: R{item.target.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.donationFooter}>
                  <Text style={styles.donorCount}>{item.donors.toLocaleString()} donors</Text>
                  <TouchableOpacity
                    style={styles.donateButton}
                    onPress={() => navigation.navigate('DonationPayment', {
                      donation: item,
                      onDonate: (amount) => {
                        const updatedDonations = localDonations.map(d => {
                          if (d.id === item.id) {
                            const newRaised = d.raised + amount;
                            return {
                              ...d,
                              raised: newRaised,
                              donors: d.donors + 1,
                              progress: Math.min(newRaised / d.target, 1),
                            };
                          }
                          return d;
                        });
                        setLocalDonations(updatedDonations);
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  donationList: { paddingHorizontal: 16, paddingBottom: 20 },
  donationCard: { borderRadius: 12, backgroundColor: '#fff', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' },
  donationImage: { width: '100%', height: 160 },
  donationContent: { padding: 16 },
  donationTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  donationDescription: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  progressContainer: { marginBottom: 16 },
  progressBar: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, backgroundColor: '#2f4156', borderRadius: 3 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12, color: '#666' },
  donationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  donorCount: { fontSize: 13, color: '#999' },
  donateButton: { backgroundColor: '#2f4156', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
  donateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default DonationScreen;
