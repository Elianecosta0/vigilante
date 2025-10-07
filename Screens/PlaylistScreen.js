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

const PlaylistScreen = ({ route }) => {
  const { selectedVideo, videos } = route.params;
  const [currentVideo, setCurrentVideo] = useState(selectedVideo);

  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={currentVideo.video}
        useNativeControls
        resizeMode="cover"
        shouldPlay
        style={styles.mainVideo}
      />

      <View style={styles.info}>
        <Text style={styles.title}>{currentVideo.title}</Text>
        <Text style={styles.meta}>
          {currentVideo.views} • {currentVideo.time}
        </Text>
        <Text style={styles.instructor}>By {currentVideo.instructor}</Text>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => setCurrentVideo(item)}
          >
            <Video
              source={item.video}
              resizeMode="cover"
              style={styles.thumbnail}
              shouldPlay={false}
              isMuted
            />
            <View style={styles.textContainer}>
              <Text style={styles.playlistTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.meta}>
                {item.views} • {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mainVideo: { width: "100%", height: 220, backgroundColor: "#000" },
  info: { padding: 12 },
  title: { fontSize: 18, fontWeight: "bold", color: "#000" },
  instructor: { fontSize: 14, color: "#444", marginTop: 2 },
  meta: { fontSize: 13, color: "#777", marginTop: 2 },
  playlistItem: { flexDirection: "row", padding: 10, alignItems: "center" },
  thumbnail: { width: 120, height: 70, borderRadius: 8, backgroundColor: "#000" },
  textContainer: { flex: 1, marginLeft: 10 },
  playlistTitle: { fontSize: 15, fontWeight: "600", color: "#000" },
});

export default PlaylistScreen;
