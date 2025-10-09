import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Authority Profile</Text>
      <Text style={{ marginTop: 10, color: '#555' }}>Profile details will go here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default ProfileScreen;
