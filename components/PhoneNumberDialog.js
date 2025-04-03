import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PhoneNumberDialog = ({ visible, onClose, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (phoneNumber.length === 10) {
      onSubmit(phoneNumber);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Enter Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter 10 digit number"
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#999"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, phoneNumber.length !== 10 && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={phoneNumber.length !== 10}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1D1D',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitButton: {
    backgroundColor: '#1B76BB',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default PhoneNumberDialog;
