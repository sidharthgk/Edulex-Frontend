import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Animated,
  ScrollView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PatternItem {
  shape: string;
  color: string;
  icon: string;
}

const shapes = ['circle', 'square', 'triangle'];
const colors = ['red', 'blue', 'green', 'yellow'];
const iconMap: { [key: string]: string } = {
  circle: '●',
  square: '■',
  triangle: '▲',
};

const colorMap: { [key: string]: string } = {
  red: '#F44336',
  blue: '#2196F3', 
  green: '#4CAF50',
  yellow: '#FFC107',
};

const PatternRecognitionGame = () => {
  const navigation = useNavigation();
  
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Game state
  const [currentPattern, setCurrentPattern] = useState<PatternItem[]>([]);
  const [userPattern, setUserPattern] = useState<PatternItem[]>([]);
  const [availableChoices, setAvailableChoices] = useState<PatternItem[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showingPattern, setShowingPattern] = useState(true);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const generatePattern = useCallback(() => {
    const patternLength = Math.min(2 + level, 5);
    const pattern: PatternItem[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      const shape = shapes[i % shapes.length];
      const color = colors[i % colors.length];
      pattern.push({
        shape,
        color,
        icon: iconMap[shape],
      });
    }

    const choices: PatternItem[] = [];
    pattern.forEach(item => {
      if (!choices.some(c => c.shape === item.shape && c.color === item.color)) {
        choices.push(item);
      }
    });

    // Add wrong choices
    for (let i = 0; i < 3; i++) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const wrongItem = {
        shape: randomShape,
        color: randomColor,
        icon: iconMap[randomShape],
      };
      
      if (!choices.some(c => c.shape === wrongItem.shape && c.color === wrongItem.color)) {
        choices.push(wrongItem);
      }
    }

    setCurrentPattern(pattern);
    setUserPattern([]);
    setAvailableChoices(choices.sort(() => Math.random() - 0.5));
    setShowingPattern(true);

    setTimeout(() => {
      setShowingPattern(false);
    }, 3000);
  }, [level]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setGameStarted(true);
    generatePattern();
  }, [generatePattern]);

  useEffect(() => {
    if (fontsLoaded && gameStarted) {
      generatePattern();
    }
  }, [fontsLoaded, level, gameStarted, generatePattern]);

  if (!fontsLoaded) {
    return null;
  }

  const handleItemChoice = (item: PatternItem) => {
    if (showingPattern) return;

    const newUserPattern = [...userPattern, item];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === currentPattern.length) {
      setTimeout(() => {
        checkPattern(newUserPattern);
      }, 500);
    }
  };

  const checkPattern = (userSeq: PatternItem[]) => {
    const isCorrect = userSeq.every((item, index) => {
      const expectedItem = currentPattern[index];
      return item.shape === expectedItem.shape && item.color === expectedItem.color;
    });

    if (isCorrect) {
      setScore(prev => prev + currentPattern.length * 10);
      Vibration.vibrate(100);
      
      if (level < 4) {
        setLevel(prev => prev + 1);
        Alert.alert('🎉 Great!', 'Moving to next level!', [
          { text: 'Continue', onPress: () => {} }
        ]);
      } else {
        Alert.alert('✅ Perfect!', 'Pattern completed!', [
          { text: 'Next', onPress: () => generatePattern() }
        ]);
      }
    } else {
      Vibration.vibrate([100, 50, 100]);
      Alert.alert('❌ Try Again!', 'That\'s not the right pattern!', [
        { text: 'Retry', onPress: () => {
          setUserPattern([]);
          setShowingPattern(true);
          setTimeout(() => setShowingPattern(false), 2000);
        }}
      ]);
    }
  };

  if (!gameStarted) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pattern Master</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Ionicons name="eye" size={64} color="#3DB2FF" />
          <Text style={styles.instructionTitle}>Complete the Pattern!</Text>
          <Text style={styles.instructionText}>
            Watch the pattern carefully, then recreate it!
          </Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
            <Text style={styles.startButtonText}>Start Playing!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pattern Master</Text>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
      </View>

      {showingPattern ? (
        <View style={styles.patternContainer}>
          <Text style={styles.instruction}>Remember this pattern:</Text>
          <View style={styles.patternDisplay}>
            {currentPattern.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.patternItem,
                  { backgroundColor: colorMap[item.color] }
                ]}
              >
                <Text style={styles.patternIcon}>{item.icon}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.instruction}>Recreate the pattern:</Text>
          
          <View style={styles.userPatternContainer}>
            {userPattern.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.patternItem,
                  styles.userPatternItem,
                  { backgroundColor: colorMap[item.color] }
                ]}
              >
                <Text style={styles.patternIcon}>{item.icon}</Text>
              </View>
            ))}
          </View>

          <View style={styles.choicesContainer}>
            {availableChoices.map((item, index) => (
              <Animated.View
                key={`${item.shape}-${item.color}-${index}`}
                style={[{ transform: [{ scale: scaleAnim }] }]}
              >
                <TouchableOpacity
                  style={[
                    styles.choiceItem,
                    { backgroundColor: colorMap[item.color] }
                  ]}
                  onPress={() => handleItemChoice(item)}
                >
                  <Text style={styles.choiceIcon}>{item.icon}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginLeft: 10,
  },
  instructionContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 100,
  },
  instructionTitle: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  instruction: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  patternContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  patternDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  userPatternContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
    minHeight: 80,
  },
  patternItem: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  userPatternItem: {
    borderWidth: 3,
    borderColor: '#3DB2FF',
  },
  patternIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
  choiceItem: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default PatternRecognitionGame; 