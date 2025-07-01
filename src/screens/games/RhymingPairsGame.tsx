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

interface RhymePair {
  word1: string;
  word2: string;
  difficulty: number;
}

const rhymePairs: RhymePair[] = [
  // Easy rhymes
  { word1: 'cat', word2: 'hat', difficulty: 1 },
  { word1: 'dog', word2: 'log', difficulty: 1 },
  { word1: 'sun', word2: 'fun', difficulty: 1 },
  { word1: 'car', word2: 'star', difficulty: 1 },
  { word1: 'tree', word2: 'bee', difficulty: 1 },
  { word1: 'book', word2: 'look', difficulty: 1 },
  { word1: 'fish', word2: 'dish', difficulty: 1 },
  { word1: 'bird', word2: 'word', difficulty: 1 },
  
  // Medium rhymes
  { word1: 'house', word2: 'mouse', difficulty: 2 },
  { word1: 'plane', word2: 'rain', difficulty: 2 },
  { word1: 'flower', word2: 'tower', difficulty: 2 },
  { word1: 'happy', word2: 'snappy', difficulty: 2 },
  { word1: 'water', word2: 'daughter', difficulty: 2 },
  { word1: 'bright', word2: 'light', difficulty: 2 },
  
  // Hard rhymes
  { word1: 'rainbow', word2: 'elbow', difficulty: 3 },
  { word1: 'elephant', word2: 'relevant', difficulty: 3 },
  { word1: 'wonderful', word2: 'colorful', difficulty: 3 },
  { word1: 'computer', word2: 'commuter', difficulty: 3 },
];

const RhymingPairsGame = () => {
  const navigation = useNavigation();
  
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Game state
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleRoundComplete = useCallback(() => {
    const accuracy = ((matchedPairs.length + 1) / attempts) * 100;
    
    if (accuracy >= 75 && level < 3) {
      setLevel(prev => prev + 1);
      Alert.alert(
        '🎉 Level Complete!',
        `Great job! You found all the rhyming pairs!\nAccuracy: ${accuracy.toFixed(0)}%\nLevel ${level + 1} unlocked!`,
        [{ text: 'Next Level', onPress: () => {} }] // Will regenerate on level change
      );
    } else if (accuracy >= 75) {
      Alert.alert(
        '🏆 Game Complete!',
        `Excellent work! You've mastered all levels!\nFinal Score: ${score}\nAccuracy: ${accuracy.toFixed(0)}%`,
        [
          { text: 'Play Again', onPress: () => {
            setScore(0);
            setLevel(1);
            setAttempts(0);
            setGameStarted(true);
          }},
          { text: 'Exit', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      Alert.alert(
        '🔄 Try Again',
        `You found all pairs, but let's improve accuracy!\nCurrent: ${accuracy.toFixed(0)}% (Need 75%+)`,
        [{ text: 'Retry Level', onPress: () => {} }] // Will regenerate on retry
      );
    }
  }, [matchedPairs.length, attempts, level, score, navigation]);

  const generateNewRound = useCallback(() => {
    // Get pairs for current level
    const availablePairs = rhymePairs.filter(pair => pair.difficulty <= level);
    const selectedPairs = availablePairs
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, availablePairs.length));

    // Create shuffled word array
    const words = selectedPairs.flatMap(pair => [pair.word1, pair.word2]);
    const shuffledWords = words.sort(() => Math.random() - 0.5);

    setGameWords(shuffledWords);
    setSelectedWords([]);
    setMatchedPairs([]);
  }, [level]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setAttempts(0);
    setGameStarted(true);
    generateNewRound();
  }, [generateNewRound]);

  useEffect(() => {
    if (fontsLoaded && gameStarted) {
      generateNewRound();
    }
  }, [fontsLoaded, level, gameStarted, generateNewRound]);

  if (!fontsLoaded) {
    return null;
  }

  const handleWordPress = (word: string) => {
    if (selectedWords.includes(word) || isWordMatched(word)) {
      return;
    }

    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);

    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (newSelectedWords.length === 2) {
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        checkForMatch(newSelectedWords);
      }, 500);
    }
  };

  const checkForMatch = (words: string[]) => {
    const [word1, word2] = words;
    const isMatch = rhymePairs.some(pair => 
      (pair.word1 === word1 && pair.word2 === word2) ||
      (pair.word1 === word2 && pair.word2 === word1)
    );

    if (isMatch) {
      // Correct match
      setMatchedPairs(prev => [...prev, words]);
      setScore(prev => prev + (level * 10));
      setSelectedWords([]);
      Vibration.vibrate(100);

      // Check if round is complete
      if (matchedPairs.length + 1 >= gameWords.length / 2) {
        setTimeout(() => {
          handleRoundComplete();
        }, 1000);
      }
    } else {
      // Wrong match
      Vibration.vibrate([100, 50, 100]);
      
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        '❌ Not a Match!',
        `"${word1}" and "${word2}" don't rhyme. Try again!`,
        [{ text: 'Continue', onPress: () => setSelectedWords([]) }]
      );
    }
  };

  const isWordMatched = (word: string) => {
    return matchedPairs.some(pair => pair.includes(word));
  };

  const isWordSelected = (word: string) => {
    return selectedWords.includes(word);
  };

  if (!gameStarted) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rhyming Pairs</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Ionicons name="musical-notes" size={64} color="#3DB2FF" />
          <Text style={styles.instructionTitle}>Find the Rhyming Words!</Text>
          <Text style={styles.instructionText}>
            Tap two words that sound alike at the end. For example, "cat" and "hat" rhyme!
          </Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleItem}>• Tap two words that rhyme</Text>
            <Text style={styles.ruleItem}>• Find all the pairs to complete the level</Text>
            <Text style={styles.ruleItem}>• Get 75% accuracy to advance</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
            <Text style={styles.startButtonText}>Start Playing!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rhyming Pairs</Text>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Level</Text>
          <Text style={styles.infoValue}>{level}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Score</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Matches</Text>
          <Text style={styles.infoValue}>{matchedPairs.length}/{gameWords.length / 2}</Text>
        </View>
      </View>

      <Text style={styles.instruction}>Tap two words that rhyme!</Text>

      <Animated.View 
        style={[
          styles.wordsContainer,
          { transform: [{ translateX: shakeAnim }] }
        ]}
      >
        {gameWords.map((word, index) => (
          <Animated.View
            key={index}
            style={[
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.wordButton,
                isWordSelected(word) && styles.selectedWordButton,
                isWordMatched(word) && styles.matchedWordButton,
              ]}
              onPress={() => handleWordPress(word)}
              disabled={isWordMatched(word)}
            >
              <Text
                style={[
                  styles.wordButtonText,
                  isWordSelected(word) && styles.selectedWordButtonText,
                  isWordMatched(word) && styles.matchedWordButtonText,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      {selectedWords.length === 1 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>
            Selected: <Text style={styles.selectedWord}>{selectedWords[0]}</Text>
          </Text>
          <Text style={styles.selectedHint}>Now pick a word that rhymes!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
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
    lineHeight: 24,
    marginBottom: 30,
  },
  rulesContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  rulesTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 10,
  },
  ruleItem: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 5,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  infoItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  instruction: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 15,
  },
  wordButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 120,
    alignItems: 'center',
  },
  selectedWordButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#3DB2FF',
  },
  matchedWordButton: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wordButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
  },
  selectedWordButtonText: {
    color: '#3DB2FF',
  },
  matchedWordButtonText: {
    color: '#4CAF50',
  },
  selectedContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  selectedWord: {
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  selectedHint: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#3DB2FF',
    marginTop: 5,
  },
});

export default RhymingPairsGame; 