import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RatingModal = ({ visible, onClose, onRate }) => {
  const [rating, setRating] = React.useState(0);

  const handleRate = async () => {
    if (rating === 5) {
      await onRate(rating, true); // Pass true to indicate 5-star rating
      Linking.openURL('https://apps.apple.com/in/app/eyex-eye-care-eye-exercises/id6739644245');
      onClose();
    } else if (rating > 0) {
      await onRate(rating, false);
      onClose(); // Allow closing for non-5-star ratings
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>How was your experience after the workout?</Text>
          <Text style={styles.subtitle}>Your feedback helps us improve!</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Icon
                  name={rating >= star ? 'star' : 'star-outline'}
                  size={40}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleRate}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
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
    paddingTop: 40, // Added top padding for close button
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#1B76BB',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 10,
    padding: 5,
    zIndex: 1,
  },
});

export default RatingModal;
