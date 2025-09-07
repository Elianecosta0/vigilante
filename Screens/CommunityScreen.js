import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config'; // compat style

export default function CommunityScreen() {
  const navigation = useNavigation();

  // Firebase references
  const db = firebase.firestore();
  const auth = firebase.auth();

  const [groups, setGroups] = useState([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState(new Set());

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Fetch all groups live
  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const allGroups = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            members: doc.data().members || [], // ensure members array exists
          }));
          setGroups(allGroups);

          // Track which groups current user belongs to
          const joined = allGroups
            .filter(g => g.members.includes(auth.currentUser.uid))
            .map(g => g.id);
          setJoinedGroupIds(new Set(joined));
        },
        error => {
          console.error('Error fetching groups:', error);
        }
      );

    return () => unsubscribe();
  }, []);

  // Create group handler
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Please enter a group name');
      return;
    }

    try {
      // Check if group with same name exists
      if (
        groups.some(
          g => g.name.toLowerCase() === newGroupName.trim().toLowerCase()
        )
      ) {
        Alert.alert('Group with this name already exists');
        return;
      }

      await db.collection('groups').add({
        name: newGroupName.trim(),
        members: [auth.currentUser.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });

      Alert.alert(`Group "${newGroupName}" created!`);
      setNewGroupName('');
      setCreateModalVisible(false);
    } catch (e) {
      Alert.alert('Error creating group', e.message);
    }
  };

  // Join existing group handler
  const handleJoinGroup = async group => {
    if (joinedGroupIds.has(group.id)) {
      Alert.alert('You are already a member of this group');
      return;
    }
    try {
      const groupRef = db.collection('groups').doc(group.id);
      await groupRef.update({
        members: [...(group.members || []), auth.currentUser.uid],
      });
      Alert.alert(`You joined "${group.name}"`);
      setJoinModalVisible(false);
    } catch (e) {
      Alert.alert('Error joining group', e.message);
    }
  };

  // Render each group item with Joined badge if joined
  const renderGroupItem = ({ item }) => {
    const isJoined = joinedGroupIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.groupItem, isJoined && styles.joinedGroup]}
        onPress={() =>
          navigation.navigate('GroupChat', {
            groupId: item.id,
            groupName: item.name,
          })
        }
      >
        <Text style={styles.groupName}>{item.name}</Text>
        {isJoined && <Text style={styles.joinedBadge}>Joined</Text>}
      </TouchableOpacity>
    );
  };

  // Groups available to join
  const availableToJoin = groups.filter(g => !joinedGroupIds.has(g.id));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#6a1b9a" />
        </TouchableOpacity>
        <Text style={styles.title}>Community Channels</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Chatbot Button */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Text style={styles.chatbotButtonText}>Talk to SafeSpace Bot 💬</Text>
      </TouchableOpacity>

      {/* Groups List */}
      <FlatList
        data={groups}
        keyExtractor={item => item.id}
        renderItem={renderGroupItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.buttonText}>Start a Safe Space</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setJoinModalVisible(true)}
        >
          <Text style={styles.buttonText}>Become a Support Member</Text>
        </TouchableOpacity>
      </View>

      {/* Create Group Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start a Safe Space</Text>
            <TextInput
              placeholder="Enter group name"
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateGroup}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Join Group Modal */}
      <Modal visible={joinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Become a Support Member</Text>
            {availableToJoin.length === 0 ? (
              <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                No groups available to join.
              </Text>
            ) : (
              <FlatList
                data={availableToJoin}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.joinGroupItem}
                    onPress={() => handleJoinGroup(item)}
                  >
                    <Text style={styles.joinGroupName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setJoinModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f0fa' },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6a1b9a',
  },

  chatbotButton: {
    backgroundColor: '#d29fcc',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 15,
  },

  chatbotButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  groupItem: {
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  joinedGroup: {
    backgroundColor: '#e1bee7',
  },

  groupName: {
    fontSize: 18,
    color: '#4a148c',
    fontWeight: '600',
  },

  joinedBadge: {
    backgroundColor: '#7b1fa2',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 12,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    marginBottom: 100,
  },

  button: {
    backgroundColor: '#9c27b0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#7b1fa2',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#6a1b9a',
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: '#9c27b0',
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
  },

  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: '#eee',
  },

  cancelButtonText: {
    color: '#6a1b9a',
  },

  joinGroupItem: {
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  joinGroupName: {
    fontSize: 16,
    color: '#6a1b9a',
  },
});
