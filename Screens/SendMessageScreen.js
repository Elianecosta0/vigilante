import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { firebase } from '../config';

const SendReportScreen = ({ route, navigation }) => {
  const { posterId, posterName } = route.params;
  const [message, setMessage] = useState('');
  const user = firebase.auth().currentUser;

  const sendReport = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a report.');
      return;
    }

    try {
      await firebase.firestore().collection('reports').add({
        posterId,
        posterName,
        message,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Report sent', 'Your report has been submitted.');
      setMessage('');
      navigation.goBack();
    } catch (error) {
      console.error('Send report error:', error);
      Alert.alert('Error', 'Failed to send report.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Report sighting for {posterName}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter details of the sighting..."
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={sendReport}>
        <Text style={styles.buttonText}>Send Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 },
  button: { backgroundColor: '#2f4156', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});

export default SendReportScreen;

