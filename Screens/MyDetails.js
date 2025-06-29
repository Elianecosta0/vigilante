import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const MyDetails = ({ route }) => {
  const {
    name,
    dob,
    gender,
    height,
    weight,
    feature,
    emergencyContact,
    yourNumber,
    password,
  } = route.params || {};

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
          <Text style={styles.value}>{yourNumber}</Text>

          <Text style={styles.label}>Password:</Text>
          <Text style={styles.value}>{password}</Text>
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
