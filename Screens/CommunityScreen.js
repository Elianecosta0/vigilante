
import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

export default function CommunityScreen() {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;

  const [conversationsMap, setConversationsMap] = useState(new Map());
  const [groupsMap, setGroupsMap] = useState(new Map());
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users once for search
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot(snapshot => {
        const users = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.id !== currentUser.uid);
        setAllUsers(users);
      });
    return () => unsubscribe();
  }, []);

  // Fetch private chats efficiently
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("privateChats")
      .where("participants", "array-contains", currentUser.uid)
      .onSnapshot(snapshot => {
        const updatedMap = new Map();
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const otherUserId = data.participants.find(id => id !== currentUser.uid);

          const userData = allUsers.find(u => u.id === otherUserId);
          const name =
            (userData?.firstName && userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.displayName) || userData?.email || "Unknown User";

          updatedMap.set(otherUserId, {
            id: otherUserId,
            name,
            lastMessage: data.lastMessage || "",
            updatedAt: data.lastUpdated || data.createdAt || null,
            type: "chat",
          });
        });
        setConversationsMap(updatedMap);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [allUsers]);


  // Fetch groups

  // Filter users by search query safely
  useEffect(() => {

    const results = users.filter(u =>
      (u.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery, users]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .onSnapshot(snapshot => {
        const updatedMap = new Map(groupsMap);
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const updatedAt = data.lastUpdated || data.createdAt || null;

          updatedMap.set(doc.id, {
            id: doc.id,
            name: data.name || "Unnamed Group",
            members: data.members || [],
            admins: data.admins || [],
            lastMessage: data.lastMessage || "",
            updatedAt,
            type: "group",
          });
        });
        setGroupsMap(updatedMap);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);


  // Combine chats & groups and apply search
  const allItems = [...conversationsMap.values(), ...groupsMap.values()]
    .sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() || 0;
      const bTime = b.updatedAt?.toMillis?.() || 0;
      return bTime - aTime;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q);
    });

  const openConversation = (item) => {
    if (item.type === "group") {
      navigation.navigate("GroupChat", { groupId: item.id, groupName: item.name });
    } else {
      navigation.navigate("PrivateChat", { userId: item.id, userName: item.name });
    }
  };

  const handleJoinGroup = async (group) => {
    try {
      const groupRef = firebase.firestore().collection("groups").doc(group.id);
      await groupRef.update({
        members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to join group.");
    }
  };

  const handleStartPrivateChat = user => {
    navigation.navigate('PrivateChat', { userId: user.id, userName: user.name || 'User' });
  };

  const renderPrivateChat = ({ item }) => {
    const otherUserId = item.participants.find(uid => uid !== currentUser.uid);
    const otherUser = users.find(u => u.id === otherUserId);
    const otherUserName = otherUser?.name || 'User';


  const handleLeaveGroup = async (group) => {
    try {
      const groupRef = firebase.firestore().collection("groups").doc(group.id);
      await groupRef.update({
        members: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to leave group.");
    }
  };

  const handleShareGroup = (group) => {
    const link = `https://yourapp.com/group/${group.id}`;
    Clipboard.setString(link);
    Alert.alert("Group link copied!", "You can now share it with friends.");
  };

  const handleCreateGroup = () => {
    Alert.prompt(
      "Create Group",
      "Enter group name:",
      async (groupName) => {
        if (!groupName?.trim()) return;
        try {
          const groupRef = await firebase.firestore().collection("groups").add({
            name: groupName.trim(),
            members: [currentUser.uid],
            admins: [currentUser.uid],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          });
          Alert.alert("Success", "Group created successfully!");
        } catch (err) {
          console.log(err);
          Alert.alert("Error", "Failed to create group.");
        }
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4a6fa5" />
          <Text style={{ color: "#4a6fa5", marginTop: 10 }}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Chatbot Button */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <Text style={styles.chatbotButtonText}>Talk to SafeSpace Bot 🤖</Text>
      </TouchableOpacity>

      {/* Create Group Button */}
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={handleCreateGroup}
      >
        <Text style={styles.createGroupButtonText}>+ Create Group</Text>
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Search chats or groups..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />


      <FlatList
        data={allItems}
        keyExtractor={(item) => item.type + "-" + item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => openConversation(item)}
          >
            <Ionicons
              name={item.type === "group" ? "people" : "person"}
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {item.lastMessage ? (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              ) : null}
            </View>
            {item.type === "group" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.members.includes(currentUser.uid) ? (
                  <TouchableOpacity
                    style={styles.joinedBadge}
                    onPress={() => handleLeaveGroup(item)}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Joined</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.joinBadge}
                    onPress={() => handleJoinGroup(item)}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Join</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShareGroup(item)}
                >
                  <Ionicons name="share-social" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {searchQuery ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => handleStartPrivateChat(item)}
            >
              <Text style={styles.groupName}>{item.name || 'User'}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={[...privateChats, ...groups]}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            item.participants ? renderPrivateChat({ item }) : (
              <TouchableOpacity
                style={[styles.groupItem, joinedGroupIds.has(item.id) && styles.joinedGroup]}
                onPress={() =>
                  navigation.navigate('GroupChat', { groupId: item.id, groupName: item.name || 'Group' })
                }
              >
                <Text style={styles.groupName}>{item.name || 'Group'}</Text>
                {joinedGroupIds.has(item.id) && <Text style={styles.joinedBadge}>Joined</Text>}
              </TouchableOpacity>
            )
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#e6edf5" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e6edf5" },
  chatbotButton: {
    backgroundColor: "#4b6e91",
    margin: 10,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  chatbotButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  createGroupButton: {
    backgroundColor: "#6a1b9a",
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  createGroupButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#aab6c4",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a6fa5",
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "space-between",
  },
  icon: { marginRight: 15 },
  name: { fontSize: 16, fontWeight: "600", color: "#fff" },
  lastMessage: { fontSize: 14, color: "#dbe4f0", marginTop: 4 },
  joinBadge: {
    backgroundColor: "#3a82c4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
  },
  joinedBadge: {
    backgroundColor: "#2e5a8e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
  },
  shareButton: {
    backgroundColor: "#597ca3",
    padding: 6,
    borderRadius: 10,
  },
});
};