import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config'; // Adjust the path to your Firebase config


export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

 useEffect(() => {
  if (!currentUser) return;
  console.log("Current user ID:", currentUser.uid);

  const unsubscribe = firebase.firestore()
    .collection('notifications')
    .where('recipientId', '==', currentUser.uid)
    .where('isRead', '==', false)
    .orderBy('timestamp', 'desc')
   .onSnapshot(snapshot => {
  console.log("Notifications snapshot size:", snapshot.size);
  const notifs = snapshot.docs.map(doc => {
    console.log("Notification doc data:", doc.data());
    return { id: doc.id, ...doc.data() };
  });
  setNotifications(notifs);
}, error => {
  console.error("Error fetching notifications:", error.message);
});

  return () => unsubscribe();
}, [currentUser]);


  const openChat = async (notification) => {
    // Mark notification as read
    await firebase.firestore()
      .collection('notifications')
      .doc(notification.id)
      .update({ isRead: true });

    // Navigate to ChatScreen
    navigation.navigate('ChatScreen', {
      recipientId: notification.senderId,
      chatId: notification.chatId,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openChat(item)} style={styles.notificationItem}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationText}>
  New message from {item.senderName}: {item.message}
</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
            No new notifications
          </Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
  },
  notificationTextContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

