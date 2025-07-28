import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../config'; // Make sure your firebase config is correctly imported

const AddEmergencyContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [open, setOpen] = useState(false);
  const [relationship, setRelationship] = useState(null);
  const [items, setItems] = useState([
    { label: 'Parent', value: 'parent' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Friend', value: 'friend' },
    { label: 'Partner', value: 'partner' },
    { label: 'Other', value: 'other' },
  ]);

  const handleSave = async () => {
    if (!name || !phone || !relationship) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('emergencyContacts').add({
        userId,
        name,
        phone,
        relationship,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert('✅ Emergency contact saved!');
      navigation.goBack();
    } catch (error) {
      console.error('Firebase Error:', error);
      alert('❌ Failed to save contact. Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Emergency Contact</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Jane Doe"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. +1234567890"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Relationship</Text>
        <View style={{ zIndex: 1000 }}>
          <DropDownPicker
            open={open}
            value={relationship}
            items={items}
            setOpen={setOpen}
            setValue={setRelationship}
            setItems={setItems}
            placeholder="Select relationship"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />
        </View>

        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="person-add-outline" size={20} color="#4a4a4a" />
          <Text style={styles.contactBtnText}>Pick from Contacts (coming soon)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Contact</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddEmergencyContactScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderColor: '#ccc',
    marginTop: 5,
  },
  dropdownBox: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ccc',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  contactBtnText: {
    marginLeft: 8,
    color: '#4a4a4a',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#1B263B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
