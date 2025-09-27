import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { firebase } from '../config';

export default function GroupDetailScreen({ route }) {
  const { groupId, groupName } = route.params;
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const db = firebase.firestore();
  const auth = firebase.auth();
  const currentUser = auth.currentUser;

  // Fetch group data
  useEffect(() => {
    const unsubscribe = db.collection('groups').doc(groupId).onSnapshot(docSnap => {
      if (!docSnap.exists) return;
      const data = docSnap.data();
      setAdmins(data.admins || []);
      const memberIds = data.members || [];

      // Fetch member names
      Promise.all(
        memberIds.map(async uid => {
          const userSnap = await db.collection('users').doc(uid).get();
          if (userSnap.exists) {
            const userData = userSnap.data();
            return { uid, name: userData.name || uid };
          }
          return { uid, name: uid };
        })
      ).then(resolved => setMembers(resolved));
    });

    return () => unsubscribe();
  }, [groupId]);

  // Copy group link
  const handleCopyLink = () => {
    const link = `https://yourapp.com/group/${groupId}`;
    Clipboard.setString(link);
    Alert.alert('Group link copied!', 'You can now share it with others.');
  };

  // Remove member (only admin)
  const handleRemoveMember = (uid, name) => {
    if (!admins.includes(currentUser.uid)) {
      Alert.alert('Permission denied', 'Only admins can remove members.');
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const groupRef = db.collection('groups').doc(groupId);
            await groupRef.update({
              members: firebase.firestore.FieldValue.arrayRemove(uid),
              admins: firebase.firestore.FieldValue.arrayRemove(uid),
            });
          },
        },
      ]
    );
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberText}>{item.name}</Text>
      {admins.includes(item.uid) && <Text style={styles.adminBadge}>Admin</Text>}
      {admins.includes(currentUser.uid) && !admins.includes(item.uid) && (
        <TouchableOpacity
          onPress={() => handleRemoveMember(item.uid, item.name)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>{groupName}</Text>

          {/* Shareable link */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Group ID: {groupId}</Text>
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
              <Text style={styles.copyText}>Copy Link</Text>
            </TouchableOpacity>
          </View>

          {/* Members list */}
          <Text style={styles.membersHeader}>Members ({members.length})</Text>
          <FlatList
            data={members}
            keyExtractor={(item) => item.uid}
            renderItem={renderMember}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#e6edf5' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#4a6fa5' },

  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  linkText: { fontSize: 14, color: '#333' },
  copyButton: { backgroundColor: '#4a6fa5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  copyText: { color: '#fff', fontWeight: 'bold' },

  membersHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },

  memberItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberText: { fontSize: 16, color: '#333' },
  adminBadge: {
    backgroundColor: '#597ca3',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: '#d9534f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  removeText: { color: '#fff', fontSize: 12 },
});
