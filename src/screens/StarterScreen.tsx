import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StarterScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo2.png')} // Replace with your logo
          style={styles.logo}
        />
        <Text style={styles.title}>EDULEX AI</Text>
      </View>

      {/* Blue Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.mainDescription}>
          Explore, Learn, and Grow with Your New Friend.
        </Text>
        <Text style={styles.subDescription}>
          With your AR friend by your side, learning becomes an exciting
          adventure tailored just for you!
        </Text>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.activeDot]} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
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
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007BFF',
  },
  descriptionContainer: {
    flex: 1.5,
    backgroundColor: '#007BFF', // Blue background
    borderTopLeftRadius: 30, // Rounded corners
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mainDescription: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#E9F5FF', // Lighter text for secondary description
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4', // Light gray dot
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFFFFF', // White active dot
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // White border for register button
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  registerText: {
    color: '#FFFFFF', // White text for register button
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FFFFFF', // White background for login button
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  loginText: {
    color: '#007BFF', // Blue text for login button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StarterScreen;
