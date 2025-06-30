import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const SkipAssessmentConfirmation = ({ navigation }: any) => {
  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleTakeAssessment = () => {
    navigation.navigate('DyslexiaTestStart');
  };

  const handleSkipConfirmed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <Ionicons name="help-circle-outline" size={80} color="#FF6B6B" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Are you sure you want to skip?</Text>

        {/* Main Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.subtitle}>
            This assessment is really important for your learning journey
          </Text>
          
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>
                Helps us understand your unique learning style
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>
                Creates a personalized learning path just for you
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>
                Identifies your strengths and areas for improvement
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>
                Takes only 10-15 minutes to complete
              </Text>
            </View>
          </View>

          <Text style={styles.encouragementText}>
            We believe in your potential! This assessment will help us support you better 
            and create the most effective learning experience for your needs.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.takeAssessmentButton}
            onPress={handleTakeAssessment}
          >
            <Text style={styles.takeAssessmentButtonText}>
              Let's Take the Assessment
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipConfirmed}
          >
            <Text style={styles.skipButtonText}>
              I'll do it later
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.noteText}>
          Don't worry - you can always take this assessment later from your profile settings.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  messageContainer: {
    width: '100%',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26,
  },
  benefitsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3DB2FF',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  benefitText: {
    fontSize: 16,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 10,
    lineHeight: 22,
    flex: 1,
  },
  encouragementText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  takeAssessmentButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  takeAssessmentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '85%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#888888',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
  },
  noteText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});

export default SkipAssessmentConfirmation; 