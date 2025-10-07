import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Video } from "expo-av";

const courses = [
  {
    id: 1,
    title: "Basic Self-Defense Techniques",
    instructor: "Safety Academy",
    views: "12.4K views",
    time: "3 days ago",
    video: require("../assets/Video.mp4"),
  },
  {
    id: 2,
    title: "Advanced Protection Strategies",
    instructor: "Urban Safety",
    views: "8.7K views",
    time: "1 week ago",
    video: require("../assets/Video.mp4"),
  },
  {
    id: 3,
    title: "Street Awareness Training",
    instructor: "Self-Defense Pro",
    views: "25.1K views",
    time: "2 weeks ago",
    video: require("../assets/Video.mp4"),
  },
];

const SelfDefenceScreen = ({ navigation }) => {
  const [subscribed, setSubscribed] = useState({});

  const handleSubscribe = (id) => {
    setSubscribed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PlaylistScreen", {
            selectedVideo: item,
            videos: courses,
          })
        }
      >
        <Video
          source={item.video}
          resizeMode="cover"
          style={styles.videoPreview}
          shouldPlay={false}
          isMuted
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.views} • {item.time}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Subscribe button */}
      <TouchableOpacity
        style={[
          styles.subscribeButton,
          subscribed[item.id] && styles.subscribedButton,
        ]}
        onPress={() => handleSubscribe(item.id)}
      >
        <Text
          style={[
            styles.subscribeText,
            subscribed[item.id] && styles.subscribedText,
          ]}
        >
          {subscribed[item.id] ? "Subscribed" : "Subscribe"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Self-Defense Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
    color: "#222",
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  videoPreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: { padding: 10 },
  title: { fontSize: 16, fontWeight: "600", color: "#000" },
  meta: { fontSize: 13, color: "#666", marginTop: 4 },

  // Subscribe button styles
  subscribeButton: {
    margin: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  subscribedButton: {
    backgroundColor: "#4CAF", 
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "600",
  },
  subscribedText: {
    color: "#fff",
  },
});

export default SelfDefenceScreen;
