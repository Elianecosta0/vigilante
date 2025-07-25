import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const MyDetails = ({ route }) => {
  const navigation = useNavigation();
   const [uid, setUid] = useState(null);
 
   const [name, setFullname] = useState('');
   const [dob, setDob] = useState('');
   const [gender, setGender] = useState('');
   const [height, setHeight] = useState('');
   const [weight, setWeight] = useState('');
   const [feature, setFeature] = useState('');
   const [emergencyContact, setEmergencyContact] = useState('');
   const [contact, setContact] = useState('');
 
   useEffect(() => {
     const user = firebase.auth().currentUser;
     if (user) {
       setUid(user.uid);
       const userRef = firebase.firestore().collection('users').doc(user.uid);
       userRef.get().then((doc) => {
         if (doc.exists) {
           const data = doc.data();
           setFullname(data.name || '');
           setDob(data.dob || '');
           setGender(data.gender || '');
           setHeight(data.height || '');
           setWeight(data.weight || '');
           setFeature(data.identifyingFeature || '');
           setEmergencyContact(data.emergencyContact || '');
           setContact(data.phone || '');
         }
       });
     }
   }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Details</Text>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>

          <Text style={styles.label}>DOB:</Text>
          <Text style={styles.value}>{dob}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{gender}</Text>

          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{height}</Text>

          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{weight}</Text>

          <Text style={styles.label}>Identifying Feature:</Text>
          <Text style={styles.value}>{feature}</Text>

          <Text style={styles.label}>Emergency Contact:</Text>
          <Text style={styles.value}>{emergencyContact}</Text>

          <Text style={styles.label}>Your Number:</Text>
          <Text style={styles.value}>{contact}</Text>

       
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});
