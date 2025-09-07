// MinimalSignUp.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [phone, setPhone] = useState("");// New phone number state
  const [securityNumber, setSecurityNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
  setLoading(true);

  if (!role) return Alert.alert("Select a role");
  if (!email.trim() || !password) return Alert.alert("Fill all required fields");
  if (password !== confirmPassword) return Alert.alert("Passwords do not match");
  if (!phone.trim()) return Alert.alert("Enter your phone number");
  if (role === "authority" && !securityNumber) return Alert.alert("Enter Security Number");

  try {
    let userData = { role, email: email.trim(), phone: phone.trim() };
    if (role === "user") userData.name = name.trim();

    const userCredential = await firebase.auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    // Send verification email
    await userCredential.user.sendEmailVerification();

    const uid = userCredential.user.uid;
    await firebase.firestore().collection("users").doc(uid).set(userData);

    Alert.alert("Verify your email", "Check your inbox before logging in");

    // 🔑 Sign out so they can't access the app before verification
    await firebase.auth().signOut();

    // ✅ Navigate to login screen
    navigation.replace("LogIn"); 
    // use replace so they can’t go "back" to signup
  } catch (err) {
    Alert.alert("Error", err.message);
  } finally {
    setLoading(false);
  }
};
const handleLogin = () => navigation.navigate('LogIn');


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Select Role:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity style={[styles.roleButton, role === "user" && styles.selectedRole]} onPress={() => setRole("user")}>
              <Text style={[styles.roleText, role === "user" && { color: "#fff" }]}>User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleButton, role === "authority" && styles.selectedRole]} onPress={() => setRole("authority")}>
              <Text style={[styles.roleText, role === "authority" && { color: "#fff" }]}>Authority</Text>
            </TouchableOpacity>
          </View>

          {role === "user" && <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />}
          
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" keyboardType="phone-pad" />

          {role === "authority" && <TextInput style={styles.input} value={securityNumber} onChangeText={setSecurityNumber} placeholder="Security Number" keyboardType="number-pad" />}

          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { padding: 25 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  roleContainer: { flexDirection: "row", marginBottom: 20 },
  roleButton: { flex: 1, padding: 12, backgroundColor: "#DDD", marginHorizontal: 5, alignItems: "center", borderRadius: 8 },
  selectedRole: { backgroundColor: "#1E2C3A" },
  roleText: { fontWeight: "bold", color: "#1E2C3A" },
  input: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: "#F7F8F9" },
  button: { backgroundColor: "#1E2C3A", padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  linkText: { color: '#1E2C3A', textAlign: 'center' },
});

