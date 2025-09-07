import React, { useState, useRef } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { firebase } from "../config";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

const PhoneAuth = ({ onSuccess }) => {
  const recaptchaVerifier = useRef(null);
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");

  const sendVerification = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const id = await phoneProvider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(id);
      Alert.alert("Verification code sent!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      await firebase.auth().currentUser.linkWithCredential(credential);
      Alert.alert("Phone number verified!");
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />
      {!verificationId ? (
        <>
          <Text>Enter Phone Number:</Text>
          <TextInput
            placeholder="+27 123 456 789"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <TouchableOpacity onPress={sendVerification}>
            <Text>Send Verification Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Enter Verification Code:</Text>
          <TextInput
            placeholder="123456"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <TouchableOpacity onPress={confirmCode}>
            <Text>Confirm Code</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PhoneAuth;
