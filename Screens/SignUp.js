import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState("");

  // User fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [identifyingFeature, setIdentifyingFeature] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Authority fields
  const [securityNumber, setSecurityNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let userData = {};
      let userCredential;

      if (role === "authority") {
        if (!securityNumber || !email.trim() || !password || !confirmPassword) {
          Alert.alert("Error", "Please fill all fields for authority.");
          setLoading(false);
          return;
        }

        // Check authority record
        const docRef = firebase.firestore().collection("Authorities").doc(securityNumber);
        const doc = await docRef.get();

        if (!doc.exists) {
          Alert.alert("Error", "Invalid Security Number");
          setLoading(false);
          return;
        }

        userData = {
          ...doc.data(),
          role: "authority",
          email: email.trim(),
        };

        // Create Firebase Auth user
        userCredential = await firebase.auth().createUserWithEmailAndPassword(
          email.trim(),
          password
        );
        await userCredential.user.sendEmailVerification();

        const uid = userCredential.user.uid;

        // Store user in "users" collection
        await firebase.firestore().collection("users").doc(uid).set(userData);

        // Update Authority doc with email
        await docRef.update({ email: email.trim() });

        Alert.alert(
          "Verify your email",
          "A verification email has been sent. Please verify before logging in."
        );
        navigation.replace("Login");
      }

      if (role === "user") {
        if (
          !firstName.trim() ||
          !lastName.trim() ||
          !dob.trim() ||
          !emergencyContact.trim() ||
          !gender.trim() ||
          !height.trim() ||
          !identifyingFeature.trim() ||
          !username.trim() ||
          !phone.trim() ||
          !email.trim() ||
          !password ||
          !confirmPassword
        ) {
          Alert.alert("Error", "Please fill all fields for user.");
          setLoading(false);
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        userData = {
          name: fullName,
          dob: dob.trim(),
          emergencyContact: emergencyContact.trim(),
          gender: gender.trim(),
          height: height.trim(),
          weight: weight.trim() || "",
          identifyingFeature: identifyingFeature.trim(),
          username: username.trim(),
          phone: phone.trim(),
          role: "user",
          email: email.trim(),
        };

        // Create Firebase Auth user
        userCredential = await firebase.auth().createUserWithEmailAndPassword(
          email.trim(),
          password
        );
        await userCredential.user.sendEmailVerification();

        const uid = userCredential.user.uid;
        userData.UID = uid;

        // Store user in Firestore
        await firebase.firestore().collection("users").doc(uid).set(userData);

        Alert.alert(
          "Verify your email",
          "A verification email has been sent. Please verify before logging in."
        );
        navigation.replace("LogIn");
      }

      if (!role) {
        Alert.alert("Error", "Please select a role.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/vigilante-logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Image
            source={require("../assets/Vigilantetxt.png")}
            style={styles.txt}
            resizeMode="contain"
          />
        </View>

        {/* Role Selection */}
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === "user" && styles.selectedRole]}
            onPress={() => setRole("user")}
          >
            <Text style={[styles.roleText, role === "user" && { color: "#fff" }]}>
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === "authority" && styles.selectedRole]}
            onPress={() => setRole("authority")}
          >
            <Text style={[styles.roleText, role === "authority" && { color: "#fff" }]}>
              Authority
            </Text>
          </TouchableOpacity>
        </View>

        {/* Common Email Field */}
        {role !== "" && (
          <>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </>
        )}

        {/* Authority Fields */}
        {role === "authority" && (
          <>
            <Text style={styles.label}>Security Number:</Text>
            <TextInput
              style={styles.input}
              value={securityNumber}
              onChangeText={setSecurityNumber}
              placeholder="Enter security number"
              autoCapitalize="none"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
            />
          </>
        )}

        {/* User Fields */}
        {role === "user" && (
          <>
            <Text style={styles.label}>First Name:</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

            <Text style={styles.label}>Last Name:</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

            <Text style={styles.label}>DOB (YYYY-MM-DD):</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDob} />

            <Text style={styles.label}>Emergency Contact:</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Gender:</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} />

            <Text style={styles.label}>Height:</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Weight (optional):</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Identifying Feature:</Text>
            <TextInput
              style={styles.input}
              value={identifyingFeature}
              onChangeText={setIdentifyingFeature}
            />

            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} />

            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </>
        )}

        {/* Submit Button */}
        {role !== "" && (
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: -100,
  },
  txt: {
    width: 300,
    height: 50,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#DADADA',
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#DADADA',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#1E2C3A',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#1E2C3A',
  },
  button: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});













