import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { firebase } from '../config';

const ReportScreen = ({ route }) => {
  const { posterId } = route.params;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeReportId, setActiveReportId] = useState(null);

  useEffect(() => {
    if (!posterId) return;

    const unsubscribe = firebase.firestore()
      .collection('reports')
      .where('posterId', '==', posterId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(list);
        setLoading(false);
      }, error => {
        console.error('Error fetching reports:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [posterId]);

  const sendReply = async (reportId) => {
    if (!replyText.trim()) return;

    try {
      await firebase.firestore()
        .collection('reports')
        .doc(reportId)
        .update({
          reply: replyText,
          replyTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      setReplyText('');
      setActiveReportId(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportUser}>{item.reporterName || 'Anonymous'}</Text>
      <Text style={styles.reportPhone}>{item.phoneNumber || 'No phone number'}</Text>
      <Text style={styles.reportText}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>

      {item.reply && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Reply:</Text>
          <Text style={styles.replyText}>{item.reply}</Text>
          <Text style={styles.replyTimestamp}>{new Date(item.replyTimestamp?.toDate()).toLocaleString()}</Text>
        </View>
      )}

      {/* Reply input (visible when poster clicks 'Reply') */}
      {activeReportId === item.id && !item.reply && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply..."
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={styles.replyButton} onPress={() => sendReply(item.id)}>
            <Text style={styles.replyButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show reply button if no reply yet */}
      {!item.reply && activeReportId !== item.id && (
        <TouchableOpacity style={styles.replyButton} onPress={() => setActiveReportId(item.id)}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f4156" />
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#777' }}>No reports yet for this post.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        renderItem={renderReport}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reportCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  reportUser: { fontWeight: '700', fontSize: 16, marginBottom: 2 },
  reportPhone: { fontSize: 14, color: '#555', marginBottom: 5 },
  reportText: { fontSize: 14, color: '#555' },
  timestamp: { fontSize: 12, color: '#999', marginTop: 5 },
  replyContainer: { marginTop: 10, padding: 10, backgroundColor: '#e1f5fe', borderRadius: 8 },
  replyLabel: { fontWeight: '700', marginBottom: 2 },
  replyText: { fontSize: 14 },
  replyTimestamp: { fontSize: 12, color: '#777', marginTop: 2 },
  replyInputContainer: { flexDirection: 'row', marginTop: 10 },
  replyInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10 },
  replyButton: { backgroundColor: '#2f4156', paddingHorizontal: 15, justifyContent: 'center', marginLeft: 5, borderRadius: 8 },
  replyButtonText: { color: '#fff', fontWeight: '600' }
});

export default ReportScreen;


