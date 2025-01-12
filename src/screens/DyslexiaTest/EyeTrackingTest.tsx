import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EyeTrackingTest = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Circular Placeholder for Camera */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>Camera Placeholder</Text>
      </View>

      {/* Reading Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          The cat is on the mat. The dog runs fast. Look at the red ball. Can you find the star?
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={() => console.log('Refresh')}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('WritingTest')} // Navigate to the next screen
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  cameraPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular shape
    backgroundColor: '#E9F5FF', // Light blue background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF', // Blue border
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280', // Light gray text
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
  paragraphBox: {
    backgroundColor: '#E9F5FF', // Light blue box
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#007BFF', // Subtle border for clarity
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#000000', // Black text for maximum contrast
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: '#E9F5FF', // Light blue background for refresh button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#007BFF', // Blue text
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
  nextButton: {
    backgroundColor: '#007BFF', // Blue background for next button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
});

export default EyeTrackingTest;
