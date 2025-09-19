import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const DonationDetails = ({ route, navigation }) => {
  const { donation, onDonate } = route.params;

  const [raised, setRaised] = useState(donation.raised);
  const [donors, setDonors] = useState(donation.donors);
  const [progress, setProgress] = useState(donation.progress);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={donation.image} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{donation.title}</Text>
          <Text style={styles.description}>{donation.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Raised: R{raised.toLocaleString()}</Text>
              <Text style={styles.progressText}>Goal: R{donation.target.toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.donorCount}>{donors.toLocaleString()} donors</Text>
        </View>
      </ScrollView>

      {/* Donate Button */}
      <TouchableOpacity
        style={styles.donateButton}
        onPress={() =>
          navigation.navigate('DonationPayment', {
            donation,
            onDonate: (amount) => {
              const newRaised = raised + amount;
              const newDonors = donors + 1;
              const newProgress = Math.min(newRaised / donation.target, 1);

              setRaised(newRaised);
              setDonors(newDonors);
              setProgress(newProgress);

              if (onDonate) onDonate(amount); // Update parent screen as well
            },
          })
        }
      >
        <Text style={styles.donateButtonText}>Donate Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250 },
  detailsContainer: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 15, color: '#666', marginBottom: 16, lineHeight: 22 },
  progressContainer: { marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: '#2f4156', borderRadius: 4 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 13, color: '#666' },
  donorCount: { fontSize: 14, color: '#999', marginBottom: 20 },
  donateButton: { backgroundColor: '#2f4156', borderRadius: 30, paddingVertical: 16, marginHorizontal: 16, marginBottom: 20, alignItems: 'center' },
  donateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DonationDetails;
