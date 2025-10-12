import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import WebView from 'react-native-webview';
import { db, auth } from '../config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const courses = [
  {
    id: 1,
    title: "Basic Self-Defense Techniques",
    instructor: "Safety Academy",
    views: "12.4K views",
    time: "3 days ago",
    video: require("../assets/Vigilante.mp4"),
    price: 99,
  },
  {
    id: 2,
    title: "Advanced Protection Strategies",
    instructor: "Urban Safety",
    views: "8.7K views",
    time: "1 week ago",
    video: require("../assets/Vigilante.mp4"),
    price: 149,
  },
  {
    id: 3,
    title: "Street Awareness Training",
    instructor: "Self-Defense Pro",
    views: "25.1K views",
    time: "2 weeks ago",
    video: require("../assets/Vigilante.mp4"),
    price: 129,
  },
];

const SelfDefenceScreen = ({ navigation }) => {
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const webViewRef = React.useRef(null);

  useEffect(() => {
    loadUserSubscriptions();
  }, []);

  const loadUserSubscriptions = async () => {
    try {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      // Get user's subscriptions document
      const userSubsRef = doc(db, 'subscriptions', auth.currentUser.uid);
      const userSubsDoc = await getDoc(userSubsRef);
      
      if (userSubsDoc.exists()) {
        const userData = userSubsDoc.data();
        const subscriptions = userData.subscriptions || [];
        setUserSubscriptions(subscriptions);
      } else {
        // No subscriptions yet
        setUserSubscriptions([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      setLoading(false);
    }
  };

  const isSubscribedToCourse = (courseId) => {
    return userSubscriptions.some(sub => sub.courseId === courseId);
  };

  const handleVideoPress = (item) => {
    if (!isSubscribedToCourse(item.id)) {
      Alert.alert(
        "Subscription Required",
        `Subscribe to "${item.title}" to access this course.`,
        [
          { text: "Not Now", style: "cancel" },
          { text: "Subscribe", onPress: () => startSubscriptionProcess(item) }
        ]
      );
      return;
    }
    
    navigation.navigate("PlaylistScreen", {
      selectedVideo: item,
      videos: courses.filter(course => isSubscribedToCourse(course.id)),
    });
  };

  const startSubscriptionProcess = (course) => {
    if (!auth.currentUser) {
      Alert.alert(
        "Login Required",
        "Please log in to subscribe to courses.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    setSelectedCourse(course);
    setShowSubscriptionModal(true);
  };

  const saveSubscriptionToFirestore = async (course, reference) => {
    try {
      const userSubsRef = doc(db, 'subscriptions', auth.currentUser.uid);
      const userSubsDoc = await getDoc(userSubsRef);
      
      const subscriptionData = {
        subscriptionId: `sub_${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        status: 'active',
        paymentReference: reference,
        subscribedAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      if (userSubsDoc.exists()) {
        // Get current subscriptions and add new one
        const currentData = userSubsDoc.data();
        const currentSubscriptions = currentData.subscriptions || [];
        const updatedSubscriptions = [...currentSubscriptions, subscriptionData];
        
        // Update with new array
        await updateDoc(userSubsRef, {
          subscriptions: updatedSubscriptions,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new subscriptions document
        await setDoc(userSubsRef, {
          subscriptions: [subscriptionData],
          userId: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      console.log('Course subscription saved to Firestore');
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  };

  const removeSubscriptionFromFirestore = async (courseId) => {
    try {
      const userSubsRef = doc(db, 'subscriptions', auth.currentUser.uid);
      const userSubsDoc = await getDoc(userSubsRef);
      
      if (userSubsDoc.exists()) {
        const userData = userSubsDoc.data();
        const subscriptions = userData.subscriptions || [];
        
        // Filter out the subscription to remove
        const updatedSubscriptions = subscriptions.filter(sub => sub.courseId !== courseId);
        
        // Update with filtered array
        await updateDoc(userSubsRef, {
          subscriptions: updatedSubscriptions,
          updatedAt: new Date().toISOString()
        });
        console.log('Subscription removed from Firestore');
      }
    } catch (error) {
      console.error('Error removing subscription:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      await saveSubscriptionToFirestore(selectedCourse, reference);
      
      // Reload subscriptions to get the latest data
      await loadUserSubscriptions();
      
      setShowSubscriptionModal(false);
      setIsProcessing(false);
      setSelectedCourse(null);

      Alert.alert(
        "Subscribed! 🎉",
        `You now have access to "${selectedCourse.title}"`,
        [{ text: "Start Learning", onPress: () => {} }]
      );
    } catch (error) {
      console.log('Error processing subscription:', error);
      Alert.alert('Error', 'Something went wrong activating your subscription.');
      setIsProcessing(false);
    }
  };

  const handleUnsubscribe = async (course) => {
    Alert.alert(
      "Unsubscribe",
      `Are you sure you want to unsubscribe from "${course.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unsubscribe", 
          style: "destructive",
          onPress: async () => {
            try {
              await removeSubscriptionFromFirestore(course.id);
              
              // Reload subscriptions to get the latest data
              await loadUserSubscriptions();
              
              Alert.alert(
                "Unsubscribed",
                `You have unsubscribed from "${course.title}"`
              );
            } catch (error) {
              console.error('Error unsubscribing:', error);
              Alert.alert('Error', 'Failed to unsubscribe. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handlePaymentClose = () => {
    setShowSubscriptionModal(false);
    setSelectedCourse(null);
    setIsProcessing(false);
  };

  const generateReference = () => {
    return `course_sub_${selectedCourse?.id}_${auth.currentUser?.uid}_${Date.now()}`;
  };

  const getSubscriptionFormHTML = () => {
    if (!selectedCourse) return '';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Course Subscription</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                padding: 40px 30px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 500px;
                text-align: center;
            }
            .logo { font-size: 32px; margin-bottom: 10px; }
            .subtitle { color: #666; margin-bottom: 30px; font-size: 16px; }
            .course-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 4px solid #007bff;
            }
            .course-name { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .instructor { color: #666; margin-bottom: 10px; }
            .price { font-size: 28px; font-weight: bold; color: #007bff; margin: 10px 0; }
            .features { text-align: left; margin: 15px 0; }
            .feature { margin: 5px 0; color: #555; }
            .payment-button {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 18px 30px;
                border: none;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin: 10px 0;
            }
            .cancel-button {
                background: #6c757d;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
            }
            .test-info {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 10px;
                margin-top: 15px;
                font-size: 12px;
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">📚</div>
            <h2>Course Subscription</h2>
            <p class="subtitle">Get access to this course</p>
            
            <div class="course-info">
                <div class="course-name">${selectedCourse.title}</div>
                <div class="instructor">By ${selectedCourse.instructor}</div>
                <div class="price">R ${selectedCourse.price}</div>
                <div class="features">
                    <div class="feature">✅ Full course access</div>
                    <div class="feature">✅ 30-day access period</div>
                    <div class="feature">✅ Downloadable resources</div>
                    <div class="feature">✅ Cancel anytime</div>
                </div>
            </div>
            
            <button class="payment-button" onclick="initializePayment()">
                Subscribe Now - R ${selectedCourse.price}
            </button>
            
            <button class="cancel-button" onclick="closePayment()">
                Cancel
            </button>
            
            <div class="test-info">
                💡 <strong>Test Mode:</strong> Use card: 4242 4242 4242 4242<br>
                Any expiry date, any CVV
            </div>
        </div>

        <script>
            function initializePayment() {
                const paymentAmount = ${selectedCourse.price * 100};
                const userEmail = '${auth.currentUser?.email || 'student@example.com'}';
                const reference = '${generateReference()}';
                
                const handler = PaystackPop.setup({
                    key: 'pk_test_840d7e3a57a86f2c751b2ffb6e900fede6459f9d',
                    email: userEmail,
                    amount: paymentAmount,
                    currency: 'ZAR',
                    ref: reference,
                    metadata: {
                        custom_fields: [
                            {
                                display_name: "Course",
                                variable_name: "course_name",
                                value: "${selectedCourse.title}"
                            }
                        ]
                    },
                    callback: function(response) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'success',
                            reference: response.reference
                        }));
                    },
                    onClose: function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'cancelled'
                        }));
                    }
                });
                
                handler.openIframe();
            }
            
            function closePayment() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'cancelled'
                }));
            }
        </script>
    </body>
    </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'success') {
        handlePaymentSuccess(data.reference);
      } else if (data.type === 'cancelled') {
        handlePaymentClose();
        Alert.alert('Subscription Cancelled', 'You cancelled the subscription process.');
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isSubscribed = isSubscribedToCourse(item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => handleVideoPress(item)}>
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
            <Text style={styles.price}>R{item.price}</Text>
          </View>
        </TouchableOpacity>

        {/* Subscription/Unsubscribe button */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isSubscribed ? styles.unsubscribeButton : styles.subscribeButton
          ]}
          onPress={() => 
            isSubscribed 
              ? handleUnsubscribe(item) 
              : startSubscriptionProcess(item)
          }
        >
          <Text style={styles.subscribeText}>
            {isSubscribed ? "Unsubscribe" : `Subscribe - R${item.price}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Self-Defense Courses</Text>
      
      <View style={styles.subscriptionInfo}>
        <Text style={styles.infoText}>
          💡 Subscribe to individual courses. Each subscription gives you 30-day access.
        </Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderItem}
      />

      {/* Subscription Modal */}
      <Modal
        visible={showSubscriptionModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handlePaymentClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Subscribe to Course</Text>
            <TouchableOpacity onPress={handlePaymentClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <WebView
            ref={webViewRef}
            source={{ html: getSubscriptionFormHTML() }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ... (styles remain exactly the same)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666' 
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
    color: "#222",
  },
  subscriptionInfo: {
    backgroundColor: '#e7f3ff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  card: {
    marginHorizontal: 16,
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
  price: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#007bff",
    marginTop: 4 
  },
  subscribeButton: {
    margin: 10,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  unsubscribeButton: {
    backgroundColor: "#dc3545",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
    backgroundColor: '#6c757d',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
    width: width,
  },
});

export default SelfDefenceScreen;
