
import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const DictationTestInstructions = () => {
  const navigation = useNavigation();

  return (

    <View>

      <Text>Dictation Test</Text>
       <TouchableOpacity style={styles.nextbutton} onPress={() => navigation.navigate('DictationTest' as never)}/>

    </View>
  );

};

const styles = StyleSheet.create({
  nextbutton: {
    // Add your styles here
  },
});

export default DictationTestInstructions;


