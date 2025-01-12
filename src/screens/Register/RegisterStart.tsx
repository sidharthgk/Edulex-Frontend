import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RegisterStart = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Top Blue Section with Cropped Image */}
      <View style={styles.topImageContainer}>
        <Image
          source={require('../../assets/start_logo.png')} // Replace with the cropped image path
          style={styles.topImage}
        />
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Create Your Profile Now!</Text>
        <Text style={styles.subtitle}>
          Create a profile to save your learning progress and keep learning for free!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('RegisterAge')}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImageContainer: {
    flex: 1.3, // Slightly larger space for the image
    backgroundColor: '#007BFF', // Fallback blue background
    borderBottomLeftRadius: 40, // Rounded edges at the bottom
    borderBottomRightRadius: 40,
    overflow: 'hidden', // Ensures the image stays within the rounded corners
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the container
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -40, // Overlap the rounded white section on the blue
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#E9F5FF',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  nextButton: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default RegisterStart;
