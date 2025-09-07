import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { firebase } from '../config';

const MyReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firebase.firestore()
      .collection('reports')
      .where('reporterId', '==', userId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(list);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (reportId) => {
    await firebase.firestore().collection('reports').doc(reportId).update({ isRead: true });
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity style={styles.reportCard} onPress={() => markAsRead(item.id)}>
      <Text style={styles.posterName}>Poster ID: {item.posterId}</Text>
      <Text style={styles.message}>{item.message}</Text>

      {item.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Reply:</Text>
          <Text style={styles.replyText}>{item.reply}</Text>
          <Text style={styles.replyTimestamp}>
            {item.replyTimestamp?.toDate().toLocaleString()}
          </Text>
          {!item.isRead && <Text style={styles.unread}>NEW</Text>}
        </View>
      ) : (
        <Text style={styles.noReply}>No reply yet</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2f4156" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={item => item.id}
      renderItem={renderReport}
      contentContainerStyle={{ padding: 15 }}
    />
  );
};

const styles = StyleSheet.create({
  reportCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  posterName: { fontWeight: '700', fontSize: 16, marginBottom: 5 },
  message: { fontSize: 14, marginBottom: 5 },
  replyContainer: { marginTop: 10, backgroundColor: '#e1f5fe', padding: 10, borderRadius: 8 },
  replyLabel: { fontWeight: '700', marginBottom: 2 },
  replyText: { fontSize: 14 },
  replyTimestamp: { fontSize: 12, color: '#777', marginTop: 2 },
  unread: { fontSize: 12, color: '#fff', backgroundColor: '#FF3B30', paddingHorizontal: 5, borderRadius: 5, marginTop: 5 },
  noReply: { fontSize: 12, color: '#999', marginTop: 5 }
});

export default MyReportsScreen;
