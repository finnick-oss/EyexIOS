import React, { useState } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  Keyboard,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";  
// import { db } from "../../firebase";  
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; 

const PHONE_NUMBER_REGEX = /^(\+91|\+91\-|0)?[6789]\d{9}$/;

const NumForm = () => {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const validateNumber = (text) => {
    if (text.length === 0) {
      setError("Mobile number is required.");
      return false;
    }
    if (!PHONE_NUMBER_REGEX.test(text)) {
      setError("Please enter a valid 10-digit mobile number (digits only).");
      return false;
    }
    setError("");
    return true;
  };

  const handleTextChange = (text) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setNumber(filteredText);
    if (filteredText.length === 10 && PHONE_NUMBER_REGEX.test(filteredText)) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const isValid = validateNumber(number);

    if (isValid) {
      // Open Razorpay Checkout
      try {
        const options = {
          description: "Subscription for Diet Plan",
          image: "./assets/applogo.jpg",
          currency: "INR",
          key: "rzp_test_RPm0EYdQ9lG9xp",
          subscription_id: "sub_RPnMVb3wVNHuSi",
          name: "Eyex Subscription",
          theme: { color: "#53a20e" },
        };
        const paymentResult = await RazorpayCheckout.open(options);
        await setDoc(doc(db, "subscriptions", number), {
        phone: number,
        paymentId: paymentResult.razorpay_payment_id,
        status: "paid",
        timestamp: new Date().toISOString(),
});

    // ✅ Save locally for faster access next time
    await AsyncStorage.setItem("hasPaid", "true");
    await AsyncStorage.setItem("phoneNumber", number);

    Alert.alert("Payment Success", `Payment ID: ${paymentResult.razorpay_payment_id}`);
    navigation.navigate("DietPlan");
      } catch (error) {
        Alert.alert(
          "Payment Failed",
          `${error.code} | ${error.description}`
        );
      }
    } else {
      Alert.alert("Error", "Please enter a valid 10-digit number.");
    }
  };

  const inputStyle = [styles.input, error && styles.inputError];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mobile Number Verification</Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={inputStyle}
          placeholder="Enter your 10-digit mobile number"
          value={number}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={10}
          onBlur={() => validateNumber(number)}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.errorSpacer} />
        )}

        <Button
          title="Validate & Subscribe"
          onPress={handleSubmit}
          disabled={number.length < 10}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f7f7" },
  container: { flex: 1, padding: 24, justifyContent: "flex-start", paddingTop: 80 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 8, fontWeight: "600" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  inputError: { borderColor: "#dc3545", borderWidth: 2 },
  errorText: { color: "#dc3545", marginBottom: 20, fontSize: 12, paddingLeft: 5 },
  errorSpacer: { marginBottom: 20 },
});

export default NumForm;
