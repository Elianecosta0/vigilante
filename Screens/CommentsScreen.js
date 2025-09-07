import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../config';

const CommentsScreen = ({ route }) => {
  const { posterId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const auth = firebase.auth();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('posters')
      .doc(posterId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setComments(doc.data().comments || []);
        }
      });

    return () => unsubscribe();
  }, [posterId]);

  const handleAddComment = async () => {
  if (!newComment.trim()) return;
  try {
    const user = auth.currentUser;

    // ✅ Fetch user details from Firestore instead of displayName
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    const userName = userDoc.exists ? userDoc.data().name : user.email;

    const comment = {
      userId: user.uid,
      name: userName || 'Anonymous',
      text: newComment,
      createdAt: new Date(),
    };

    await firebase.firestore().collection('posters').doc(posterId).update({
      comments: firebase.firestore.FieldValue.arrayUnion(comment),
    });

    setNewComment('');
  } catch (error) {
    console.error('Error posting comment:', error);
  }
};

  const renderItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: auth.currentUser?.photoURL || 'https://via.placeholder.com/30' }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.text}</Text>
        {item.createdAt && (
          <Text style={styles.time}>
            {new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Input for new comment */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a comment..."
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Ionicons name="send" size={24} color="#2f4156" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  commentItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 35, height: 35, borderRadius: 18, marginRight: 10 },
  commentContent: { flex: 1, backgroundColor: '#f2f2f2', borderRadius: 8, padding: 8 },
  name: { fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    padding: 10,
  },
  input: { flex: 1, padding: 8, backgroundColor: '#f2f2f2', borderRadius: 20, marginRight: 10 },
});

export default CommentsScreen;
