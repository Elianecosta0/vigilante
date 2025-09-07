import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MissingPersonDetails = ({ route }) => {
  const {id, name, age, image, description, lastSeen,  postedByName,
    postedByUid, contact } = route.params;
  const navigation = useNavigation();

/*  const handleMessage = () => {
  if (!contact) {
    return Alert.alert("No contact number available");
  }
  const message = `Hi, I saw your report about ${name}. I may have information.`;
  Linking.openURL(`sms:${contact}?body=${encodeURIComponent(message)}`);
};
 */



const handleMessage = () => {
  navigation.navigate('ChatScreen', {
   recipientId: postedByUid,
      recipientName: postedByName,
  });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}, {age}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.lastSeen}>Last seen: {lastSeen}</Text>
      <Text style={styles.postedBy}>Posted by: {postedByName}</Text>
      <Text style={styles.postedBy}>Contact: {contact}</Text>

      <TouchableOpacity style={styles.button} onPress={handleMessage}>
        <Text style={styles.buttonText}>Message Reporter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MissingPersonDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  lastSeen: {
    fontSize: 14,
    marginBottom: 10,
    color: '#444',
  },
  postedBy: {
    fontSize: 13,
    color: '#777',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#1B263B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
