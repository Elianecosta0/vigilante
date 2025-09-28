import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import WebView from 'react-native-webview';
import { db, auth } from '../config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const DonationPaymentScreen = ({ route, navigation }) => {
  const { donation, onDonate } = route.params;

  const [amount, setAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const webViewRef = useRef(null);

  // Save donation to Firestore
  const saveDonationToFirestore = async (donatedAmount, reference) => {
    try {
      // 1. Save the individual donation
      await addDoc(collection(db, 'donations'), {
        amount: donatedAmount,
        donationCampaignId: donation.id, // This is "1" or "2"
        donationCampaignTitle: donation.title,
        donorUserId: auth.currentUser?.uid || null,
        donorEmail: auth.currentUser?.email || 'anonymous@donor.com',
        paymentMethod: 'paystack',
        paymentReference: reference,
        status: 'completed',
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      // 2. Update the campaign total in donationCampaigns collection
      const campaignRef = doc(db, 'donationCampaigns', donation.id);
      await updateDoc(campaignRef, {
        currentAmount: increment(donatedAmount),
        donorCount: increment(1),
        updatedAt: serverTimestamp()
      });

      console.log('Donation saved to Firestore successfully');
    } catch (error) {
      console.error('Error saving donation to Firestore:', error);
      throw error;
    }
  };

  // Generate a unique reference for the transaction
  const generateReference = () => {
    return `donation_${donation.id}_${Date.now()}`;
  };

  // Handle payment success
  const handlePaymentSuccess = async (reference) => {
    try {
      const donatedAmount = Number(amount);
      
      // Save to Firestore
      await saveDonationToFirestore(donatedAmount, reference);
      
      // Call the onDonate callback to update the local UI immediately
      if (onDonate) {
        onDonate(donatedAmount);
      }

      setShowPaymentModal(false);
      setIsProcessing(false);

      Alert.alert(
        'Thank You! 🎉',
        `Your donation of R${donatedAmount.toLocaleString()} has been received for "${donation.title}".`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log('Error processing donation:', error);
      Alert.alert('Error', 'Something went wrong processing your donation.');
      setIsProcessing(false);
    }
  };

  // Handle payment close
  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setIsProcessing(false);
  };

  // Validate and start payment process
  const startPayment = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return Alert.alert('Invalid amount', 'Please enter a valid donation amount in Rands.');
    }

    const donatedAmount = Number(amount);
    
    if (donatedAmount < 10) {
      return Alert.alert('Minimum Donation', 'Minimum donation amount is R10.');
    }

    setIsProcessing(true);
    setShowPaymentModal(true);
  };

  // HTML form for Paystack payment
  const paystackFormHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Donation Payment</title>
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
            .donation-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 4px solid #FF6B6B;
            }
            .cause-title {
                font-size: 16px;
                color: #333;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .amount {
                font-size: 28px;
                font-weight: bold;
                color: #FF6B6B;
                margin: 10px 0;
            }
            .email {
                color: #666;
                font-size: 14px;
            }
            .payment-button {
                background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
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
                box-shadow: 0 10px 20px rgba(255,107,107,0.3);
            }
            .cancel-button {
                background: #6c757d;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 1010px;
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
            <div class="logo">❤️</div>
            <h2>Donation Payment</h2>
            <p class="subtitle">Supporting a great cause</p>
            
            <div class="donation-info">
                <p class="cause-title">${donation.title}</p>
                <p>Your donation amount:</p>
                <div class="amount">R ${amount}</div>
                <p class="email">Thank you for your generosity!</p>
            </div>
            
            <button class="payment-button" onclick="initializePayment()">
                Donate R ${amount}
            </button>
            
            <button class="cancel-button" onclick="closePayment()">
                Cancel Donation
            </button>
            
            <div class="test-info">
                💡 <strong>Test Mode:</strong> Use card: 4242 4242 4242 4242<br>
                Any expiry date, any CVV
            </div>
            
            <div class="security-note">
                🔒 Your donation is secure and encrypted
            </div>
        </div>

        <script>
            function initializePayment() {
                const paymentAmount = ${Number(amount) * 100};
                const userEmail = '${auth.currentUser?.email || 'donor@example.com'}';
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
                                display_name: "Donation Cause",
                                variable_name: "donation_cause",
                                value: "${donation.title}"
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

  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'success') {
        handlePaymentSuccess(data.reference);
      } else if (data.type === 'cancelled') {
        handlePaymentClose();
        Alert.alert('Donation Cancelled', 'You cancelled the donation process.');
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Donate to {donation.title}</Text>
        <Text style={styles.description}>{donation.description}</Text>

        {/* Current Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Raised: R{(donation.currentAmount || donation.raised).toLocaleString()} of R{(donation.targetAmount || donation.target).toLocaleString()}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((donation.currentAmount || donation.raised) / (donation.targetAmount || donation.target)) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Donation Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Donation Amount (R)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.amountHint}>Minimum donation: R10</Text>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmounts}>
          <Text style={styles.quickAmountsLabel}>Quick Select:</Text>
          <View style={styles.amountButtons}>
            {[50, 100, 200, 500, 1000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>R{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Donate Button */}
        <TouchableOpacity 
          style={[styles.donateButton, (!amount || isProcessing) && styles.disabledButton]} 
          onPress={startPayment}
          disabled={!amount || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.donateButtonText}>
              Donate R{amount || '0'}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 Your payment is processed securely via Paystack
        </Text>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handlePaymentClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Secure Donation</Text>
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
            scalesPageToFit={true}
            mixedContentMode="compatibility"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  progressContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  amountHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  quickAmounts: {
    marginBottom: 30,
  },
  quickAmountsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: '18%',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  donateButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 10,
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

export default DonationPaymentScreen;
