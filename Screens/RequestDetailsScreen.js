import React from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RequestDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>REQUESTER DETAILS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <Image
          source={{
            uri: 'https://thumbs.dreamstime.com/b/portrait-happy-female-generation-z-person-profile-picture-head-shot-beautiful-positive-young-woman-having-attractive-appearance-328069168.jpg',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Nomvula Dlamini</Text>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyLabel}>Emergency Contact</Text>
          <Text style={styles.contactNumber}>+27 82 123 4567</Text>
          <Text style={styles.contactNumber}>+27 83 987 6543</Text>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>
            Priority response needed. Victim reports ongoing threat at residence.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.respondButton}>
          <Text style={styles.buttonText}>RESPOND</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RequestDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001f3f',
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
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  emergencySection: {
    width: '100%',
    marginBottom: 25,
  },
  emergencyLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  contactNumber: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  notesSection: {
    width: '100%',
    marginBottom: 40,
  },
  notesLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  respondButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});