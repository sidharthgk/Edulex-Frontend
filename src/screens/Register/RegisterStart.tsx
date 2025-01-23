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
    backgroundColor: '#3DB2FF',
  },
  topImageContainer: {
    flex: 1.3, // Slightly larger space for the image
    backgroundColor: '#3DB2FF', // Fallback blue background
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
    marginTop: 5, // Overlap the rounded white section on the blue
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 28,
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'OpenDyslexic-Bold',
  },
  subtitle: {
    fontSize: 17,
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  backButton: {
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  backButtonText: {
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  nextButton: {
    padding: 12,
    backgroundColor: '#3DB2FF',
    borderRadius: 50,
    width: '45%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default RegisterStart;
