import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import SvgImage from '../../assets/Ilustration-Register.svg';

const RegisterStart = ({ navigation }: any) => {
  let [fontsLoaded] = useFonts({
        'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
        'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
        'OpenDyslexic-itallic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
      });
      if (!fontsLoaded) {
        return null;
      }
  return (
    <View style={styles.container}>
      {/* Top Blue Section with Cropped Image */}
      <View style={styles.topImageContainer}>
        <SvgImage height={400} width={500}
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
            onPress={() => navigation.navigate('RegisterScreen')}
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
    flex: 0.8, // Slightly larger space for the image
    backgroundColor: '#3DB2FF', // Fallback blue background
    borderBottomLeftRadius: 40, // Rounded edges at the bottom
    borderBottomRightRadius: 40,
    overflow: 'hidden', // Ensures the image stays within the rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  topImage: {
    width: 500,
    height: 300,
    marginTop: 50,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
   backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 35,
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'OpenDyslexic-Bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
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
