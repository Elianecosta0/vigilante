import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCounting && countdown === 0) {
      setIsCounting(false);
      sendAlert();
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const startEmergency = () => {
    setCountdown(5);
    setIsCounting(true);
  };

  const cancelEmergency = () => {
    setCountdown(null);
    setIsCounting(false);
  };

  const sendAlert = () => {
    Alert.alert('Emergency Alert Sent', 'Authorities have been notified.');
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.openDrawer()}>
           <Ionicons name="menu" size={30} color="#000" />
         </TouchableOpacity>
        
       </View>
      
      <Text style={styles.info}>
        For easier access to the emergency button, go to settings to make it easily accessible.
      </Text>

      {!isCounting ? (
        <TouchableOpacity onPress={startEmergency} style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.countdownWrapper}>
          <Text style={styles.countdown}>{countdown}</Text>
          <TouchableOpacity onPress={cancelEmergency} style={styles.cancelButton}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.note}>*An alert will be sent out to emergency contact and nearby authority</Text>
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
   header: {
     paddingTop: 50,
     paddingHorizontal: 20,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 16,
   },
  info: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: '#444',
  },
  emergencyButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  emergencyText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  countdownWrapper: {
    alignItems: 'center',
  },
  countdown: {
    fontSize: 60,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cancelButton: {
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  cancelText: {
    color: 'red',
    fontSize: 22,
    fontWeight: '600',
  },
  note: {
    marginTop: 40,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
