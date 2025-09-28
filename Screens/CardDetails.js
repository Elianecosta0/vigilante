import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../components/CartContext';
import { db, auth } from '../config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const CardDetails = () => {
  const navigation = useNavigation();
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const totalAmount = getTotalPrice ? getTotalPrice() : 0;
  const userId = auth.currentUser?.uid;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const webViewRef = useRef(null);

  // Generate a unique reference for the transaction
  const generateReference = () => {
    return `paystack_${userId}_${Date.now()}`;
  };

  // Handle payment success
  const handlePaymentSuccess = async (reference) => {
    try {
      const itemsForTransaction = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await addDoc(collection(db, 'transactions'), {
        amount: totalAmount,
        items: itemsForTransaction,
        status: 'success',
        reference: reference,
        timestamp: serverTimestamp(),
        userId,
      });

      clearCart();
      setShowPaymentModal(false);
      setIsProcessing(false);
      navigation.navigate('ThankyouScreen');
    } catch (error) {
      console.log('Error saving transaction:', error);
      Alert.alert('Error', 'Something went wrong saving your payment.');
      setIsProcessing(false);
    }
  };

  // Handle payment close
  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setIsProcessing(false);
  };

  // Start payment process
  const startPayment = () => {
    if (totalAmount <= 0) {
      Alert.alert('Invalid Amount', 'Your cart is empty.');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Authentication Required', 'Please log in to make a payment.');
      navigation.navigate('Login');
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(true);
  };

  // HTML form for Paystack payment - IMPROVED VERSION
  const paystackFormHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Paystack Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
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
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: #2f4156;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 16px;
            }
            .payment-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 4px solid #2f4156;
            }
            .amount {
                font-size: 28px;
                font-weight: bold;
                color: #2f4156;
                margin: 10px 0;
            }
            .email {
                color: #666;
                font-size: 14px;
            }
            .payment-button {
                background: linear-gradient(135deg, #2f4156, #1a2a3a);
                color: white;
                padding: 18px 30px;
                border: none;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin: 10px 0;
                transition: all 0.3s ease;
            }
            .payment-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
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
            .security-note {
                margin-top: 20px;
                font-size: 12px;
                color: #888;
            }
            .loading {
                display: none;
                margin-top: 20px;
            }
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #2f4156;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">💳</div>
            <h2>Secure Payment</h2>
            <p class="subtitle">Complete your purchase securely</p>
            
            <div class="payment-info">
                <p>You're paying:</p>
                <div class="amount">R ${totalAmount}</div>
                <p class="email">to ${auth.currentUser?.email || 'your account'}</p>
            </div>
            
            <button class="payment-button" onclick="initializePayment()">
                Pay R ${totalAmount}
            </button>
            
            <button class="cancel-button" onclick="closePayment()">
                Cancel Payment
            </button>
            
            <div class="security-note">
                🔒 Your payment is secure and encrypted
            </div>
            
            <div id="loading" class="loading">
                <div class="spinner"></div>
                <p>Processing payment...</p>
            </div>
        </div>

        <script>
            function initializePayment() {
                document.getElementById('loading').style.display = 'block';
                document.querySelector('.payment-button').disabled = true;
                
                const paymentAmount = ${totalAmount * 100};
                const userEmail = '${auth.currentUser?.email || "customer@example.com"}';
                const reference = '${generateReference()}';
                
                // Use Paystack popup directly instead of iframe
                const handler = PaystackPop.setup({
                    key: 'pk_test_840d7e3a57a86f2c751b2ffb6e900fede6459f9d',
                    email: userEmail,
                    amount: paymentAmount,
                    currency: 'ZAR',
                    ref: reference,
                    metadata: {
                        custom_fields: [
                            {
                                display_name: "Mobile App",
                                variable_name: "mobile_app",
                                value: "React Native"
                            }
                        ]
                    },
                    callback: function(response) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'success',
                            reference: response.reference,
                            transaction: response
                        }));
                    },
                    onClose: function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'cancelled'
                        }));
                    }
                });
                
                // Open in new window style
                handler.openIframe();
            }
            
            function closePayment() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'cancelled'
                }));
            }
            
            // Make sure Paystack is loaded
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof PaystackPop === 'undefined') {
                    // Retry loading Paystack
                    const script = document.createElement('script');
                    script.src = 'https://js.paystack.co/v1/inline.js';
                    document.head.appendChild(script);
                }
            });
            
            // Handle errors
            window.addEventListener('error', function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    error: e.error ? e.error.message : 'Unknown error'
                }));
            });
        </script>
    </body>
    </html>
  `;

  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'success') {
        Alert.alert('Payment Successful', 'Your payment was processed successfully!');
        handlePaymentSuccess(data.reference);
      } else if (data.type === 'cancelled') {
        handlePaymentClose();
        Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
      } else if (data.type === 'error') {
        handlePaymentClose();
        Alert.alert('Payment Error', 'An error occurred during payment. Please try again.');
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Checkout</Text>

        {/* Order Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                R{item.price} x {item.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Amount:</Text>
            <Text style={styles.totalAmount}>R{totalAmount}</Text>
          </View>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.disabledButton]}
          onPress={startPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          You will be redirected to a secure payment page to enter your card details.
        </Text>
      </ScrollView>

      {/* Payment Modal - FULL SCREEN */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handlePaymentClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Secure Payment Gateway</Text>
            <TouchableOpacity onPress={handlePaymentClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <WebView
            ref={webViewRef}
            source={{ html: paystackFormHTML }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2f4156" />
                <Text style={styles.loadingText}>Loading secure payment gateway...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error: ', nativeEvent);
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, flexGrow: 1 },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333',
    textAlign: 'center',
  },
  summaryBox: {
    padding: 25,
    borderRadius: 15,
    backgroundColor: '#F7F8F9',
    borderColor: '#DADADA',
    borderWidth: 1,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#555',
    flex: 2,
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#DADADA',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4156',
  },
  payButton: {
    backgroundColor: '#2f4156',
    paddingVertical: 18,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  payButtonText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    backgroundColor: '#f8f9fa',
    height: 80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
    width: width,
    height: height - 80, // Full height minus header
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#666',
  },
});






