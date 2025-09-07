import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { firebase } from '../config'; // compat style

export default function GroupDetailScreen({ route }) {
  const { groupId, groupName } = route.params;
  const [memberNames, setMemberNames] = useState([]);

  const db = firebase.firestore();

  useEffect(() => {
    async function fetchMembers() {
      const groupRef = db.collection('groups').doc(groupId);
      const groupSnap = await groupRef.get();
      if (!groupSnap.exists) return;

      const memberIds = groupSnap.data().members || [];

      // Fetch user profiles for each memberId
      const memberPromises = memberIds.map(async uid => {
        const userSnap = await db.collection('users').doc(uid).get();
        if (userSnap.exists) {
          const data = userSnap.data();
          console.log('User data:', data); // Debug
          return data.name || uid;
        }
        return uid; // fallback
      });

      const resolvedNames = await Promise.all(memberPromises);
      setMemberNames(resolvedNames);
    }

    fetchMembers();
  }, [groupId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.members}>Members: {memberNames.length}</Text>

        <FlatList
          data={memberNames}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Text style={styles.memberText}>{item}</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10, paddingTop: 20 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },

  members: { fontSize: 14, color: '#555', marginBottom: 15 },

  memberItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  memberText: {
    fontSize: 16,
  },
});
