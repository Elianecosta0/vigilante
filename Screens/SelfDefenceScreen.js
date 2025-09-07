import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput , SafeAreaView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const courses = [
  {
    id: 1,
    title: "Basic Self-Defense Techniques",
    instructor: "Safety Academy",
    views: "12.4K views",
    time: "3 days ago",
    duration: "12:45",
    image: require('../assets/photo3.jpg'),
    isSubscribed: false,
  },
  {
    id: 2,
    title: "Advanced Protection Strategies",
    instructor: "Urban Safety",
    views: "8.7K views",
    time: "1 week ago",
    duration: "18:22",
    image: require('../assets/photo5.jpg'),
    isSubscribed: true,
  },
  {
    id: 3,
    title: "Street Awareness Training",
    instructor: "Self-Defense Pro",
    views: "25.1K views",
    time: "2 weeks ago",
    duration: "15:30",
    image: require('../assets/photo3.jpg'),
    isSubscribed: false,
  },
];

const SelfDefenceScreen = ({ navigation }) => {
  const [videos, setVideos] = useState(courses);

  const toggleSubscribe = (id) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, isSubscribed: !video.isSubscribed } : video
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Self-Defense Courses</Text>

      {/* Drawer and Search */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={styles.menuButtonInside}
        >
          <Ionicons name="menu" size={26} color="#333" />
        </TouchableOpacity>

        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search courses..." 
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Courses List */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={item.image} style={styles.courseImage} />
              <Text style={styles.durationBadge}>{item.duration}</Text>
            </View>
            <View style={styles.courseInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person-circle" size={36} color="#999" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.instructor}>{item.instructor}</Text>
                <Text style={styles.meta}>{item.views} • {item.time}</Text>
              </View>
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[
                styles.subscribeButton,
                item.isSubscribed && styles.subscribedButton
              ]}
              onPress={() => toggleSubscribe(item.id)}
            >
              <Text style={[
                styles.subscribeText,
                item.isSubscribed && styles.subscribedText
              ]}>
                {item.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  menuButtonInside: { marginRight: 10 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  courseCard: { marginBottom: 24 },
  thumbnailContainer: { position: 'relative', marginBottom: 12 },
  courseImage: { width: '100%', height: 200, borderRadius: 12 },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  courseInfo: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  avatar: { marginRight: 12 },
  textContainer: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  instructor: { fontSize: 14, color: '#666', marginBottom: 2 },
  meta: { fontSize: 13, color: '#999' },
  menuButton: { padding: 8 },
  subscribeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  subscribedButton: { backgroundColor: '#f0f0f0' },
  subscribeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  subscribedText: { color: '#666' },
});

export default SelfDefenceScreen;

