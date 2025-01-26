import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import SvgImage from '../../assets/Logo-Starter.svg';

const StarterScreen = ({ navigation }: any) => {
  const [activePage, setActivePage] = useState(0); // Manage active page state
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView
  const descriptions = [
    'Discover the joy of learning with EDULEX AI, your personalized AR/AI teacher.',
    'Explore topics interactively and make learning engaging with fun AR games.',
    'Bridge the gap in education with AI-driven tools and personalized guidance.',
  ];

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollX / Dimensions.get('window').width); // Calculate active page
    setActivePage(page);
  };

  const handleDotPress = (index: number) => {
    setActivePage(index);
    scrollViewRef.current?.scrollTo({ x: index * Dimensions.get('window').width, animated: true });
  };

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
      <SvgImage height={350} width={600} style={styles.logo} />
        <Text style={styles.title}>EDULEX AI</Text>
      </View>

      {/* Blue Description Section */}
      <View style={styles.descriptionContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} // To optimize scroll event handling
          ref={scrollViewRef}
        >
          {descriptions.map((description, index) => (
            <View key={index} style={styles.descriptionSlide}>
              <Text style={styles.mainDescription}>{description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {descriptions.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
              <View
                style={[
                  styles.paginationDot,
                  activePage === index && styles.activeDot, // Highlight the active dot
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('RegisterStart')}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginText}>Login</Text>
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
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 130,
    height: 200, // Adjust the height of the logo
    width: 'auto', // Maintain aspect ratio or adjust as needed
  },
  title: {
    fontSize: 35, // Decreased font size
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: -30,
  },
  descriptionContainer: {
    flex: 1.5,
    backgroundColor: '#3DB2FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    marginTop: 130,
  },
  descriptionSlide: {
    width: Dimensions.get('window').width, // Full width for each slide
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainDescription: {
    fontSize: 20, // Decreased font size
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    marginHorizontal: 20,
    marginBottom: 50,
    marginTop: -120,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 160,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 5,
    marginTop: 30,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 30,
    paddingLeft: 16,
    paddingRight: 15,
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 18, // Decreased font size
    fontFamily: 'OpenDyslexic-Bold',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    marginLeft: 15,
    marginRight: 10,
  },
  loginText: {
    color: '#3DB2FF',
    fontSize: 18, // Decreased font size
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default StarterScreen;
