import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const WritingTest = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Top Icon */}
      <Image
        source={require('../../assets/writing_icon.png')} // Path to the provided icon
        style={styles.icon}
      />

      {/* Instruction Text */}
      <Text style={styles.instruction}>
        Please write the following paragraph in your notebook. When you are done, take a
        picture of your work and upload it using the button below.
      </Text>

      {/* Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          "Creativity is seeing the world in new ways, finding hidden patterns, and
          making connections between things that seem unrelated."
        </Text>
      </View>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 220, // Larger icon size
    height: 220,
    resizeMode: 'contain',
    marginTop: 30,
  },
  instruction: {
    fontSize: 16,
    color: '#FF0000', // Red color for the instruction text
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  paragraphBox: {
    backgroundColor: '#E9F5FF', // Light blue box for the paragraph
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#007BFF', // Subtle border for clarity
    marginVertical: 20,
  },
  paragraph: {
    fontSize: 18, // Increased font size for readability
    lineHeight: 28,
    color: '#000000', // Black text for maximum contrast
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
  uploadButton: {
    backgroundColor: '#007BFF', // Blue background for the button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  uploadButtonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexia-friendly font
  },
});

export default WritingTest;
