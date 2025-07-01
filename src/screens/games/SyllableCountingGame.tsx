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

interface WordData {
  word: string;
  syllableCount: number;
  syllableBreakdown: string;
  difficulty: number;
  category: string;
}

const wordsData: WordData[] = [
  // 1 syllable - Easy
  { word: 'cat', syllableCount: 1, syllableBreakdown: 'cat', difficulty: 1, category: 'animals' },
  { word: 'dog', syllableCount: 1, syllableBreakdown: 'dog', difficulty: 1, category: 'animals' },
  { word: 'sun', syllableCount: 1, syllableBreakdown: 'sun', difficulty: 1, category: 'nature' },
  { word: 'tree', syllableCount: 1, syllableBreakdown: 'tree', difficulty: 1, category: 'nature' },
  { word: 'book', syllableCount: 1, syllableBreakdown: 'book', difficulty: 1, category: 'objects' },
  { word: 'fish', syllableCount: 1, syllableBreakdown: 'fish', difficulty: 1, category: 'animals' },
  
  // 2 syllables - Medium
  { word: 'happy', syllableCount: 2, syllableBreakdown: 'hap-py', difficulty: 2, category: 'emotions' },
  { word: 'water', syllableCount: 2, syllableBreakdown: 'wa-ter', difficulty: 2, category: 'nature' },
  { word: 'apple', syllableCount: 2, syllableBreakdown: 'ap-ple', difficulty: 2, category: 'food' },
  { word: 'candy', syllableCount: 2, syllableBreakdown: 'can-dy', difficulty: 2, category: 'food' },
  { word: 'tiger', syllableCount: 2, syllableBreakdown: 'ti-ger', difficulty: 2, category: 'animals' },
  { word: 'flower', syllableCount: 2, syllableBreakdown: 'flow-er', difficulty: 2, category: 'nature' },
  { word: 'pencil', syllableCount: 2, syllableBreakdown: 'pen-cil', difficulty: 2, category: 'objects' },
  
  // 3 syllables - Hard
  { word: 'elephant', syllableCount: 3, syllableBreakdown: 'el-e-phant', difficulty: 3, category: 'animals' },
  { word: 'butterfly', syllableCount: 3, syllableBreakdown: 'but-ter-fly', difficulty: 3, category: 'animals' },
  { word: 'bicycle', syllableCount: 3, syllableBreakdown: 'bi-cy-cle', difficulty: 3, category: 'objects' },
  { word: 'computer', syllableCount: 3, syllableBreakdown: 'com-pu-ter', difficulty: 3, category: 'objects' },
  { word: 'banana', syllableCount: 3, syllableBreakdown: 'ba-na-na', difficulty: 3, category: 'food' },
  { word: 'umbrella', syllableCount: 3, syllableBreakdown: 'um-brel-la', difficulty: 3, category: 'objects' },
];

const SyllableCountingGame = () => {
  const navigation = useNavigation();
  
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Game state
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(1)).current;

  const generateNewWord = useCallback(() => {
    // Get words for current level (max syllables = level + 1)
    const maxSyllables = Math.min(level + 1, 3);
    const availableWords = wordsData.filter(word => word.syllableCount <= maxSyllables);
    if (availableWords.length === 0) return;

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
    setSelectedCount(null);
    setShowBreakdown(false);

    // Animate word appearance
    Animated.sequence([
      Animated.timing(wordAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(wordAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [level, wordAnim]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setGameStarted(true);
    generateNewWord();
  }, [generateNewWord]);

  useEffect(() => {
    if (fontsLoaded && gameStarted) {
      generateNewWord();
    }
  }, [fontsLoaded, level, gameStarted, generateNewWord]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSyllableChoice = (count: number) => {
    if (!currentWord || selectedCount !== null) {
      return;
    }

    setSelectedCount(count);

    setTimeout(() => {
      if (count === currentWord.syllableCount) {
        // Correct answer
        const points = currentWord.syllableCount * 10 + (streak * 5);
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        setShowBreakdown(true);
        Vibration.vibrate(100);

        setTimeout(() => {
          // Level up after certain streaks
          if (streak > 0 && (streak + 1) % 5 === 0 && level < 3) {
            setLevel(prev => prev + 1);
            Alert.alert(
              '🎉 Level Up!',
              `Great progress! You've reached level ${level + 1}!`,
              [{ text: 'Continue', onPress: () => {} }]
            );
          } else {
            generateNewWord();
          }
        }, 2000);
      } else {
        // Wrong answer
        setStreak(0);
        Vibration.vibrate([100, 50, 100]);
        setShowBreakdown(true);

        setTimeout(() => {
          Alert.alert(
            '❌ Try Again!',
            `"${currentWord.word}" has ${currentWord.syllableCount} syllable${currentWord.syllableCount > 1 ? 's' : ''}!\n\nBreakdown: ${currentWord.syllableBreakdown}`,
            [{ text: 'Next Word', onPress: () => generateNewWord() }]
          );
        }, 2000);
      }
    }, 500);
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
          <Text style={styles.headerTitle}>Syllable Counter</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Ionicons name="mic" size={64} color="#3DB2FF" />
          <Text style={styles.instructionTitle}>Count the Syllables!</Text>
          <Text style={styles.instructionText}>
            How many parts can you hear in each word? Each part is called a syllable!
          </Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleItem}>• Look at the word shown</Text>
            <Text style={styles.ruleItem}>• Count how many syllables (parts) it has</Text>
            <Text style={styles.ruleItem}>• Tap the number that matches</Text>
            <Text style={styles.ruleItem}>• Example: "cat" = 1, "happy" = 2 (hap-py)</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
            <Text style={styles.startButtonText}>Start Counting!</Text>
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
        <Text style={styles.headerTitle}>Syllable Counter</Text>
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
          <Text style={styles.infoLabel}>Streak</Text>
          <Text style={styles.infoValue}>{streak}</Text>
        </View>
      </View>

      <Text style={styles.instruction}>How many syllables does this word have?</Text>

      {currentWord && (
        <Animated.View 
          style={[
            styles.wordDisplay,
            { 
              transform: [
                { scale: wordAnim },
                { translateX: shakeAnim }
              ] 
            }
          ]}
        >
          <Text style={styles.displayWord}>{currentWord.word}</Text>
          {showBreakdown && (
            <Text style={styles.syllableBreakdown}>{currentWord.syllableBreakdown}</Text>
          )}
        </Animated.View>
      )}

      <View style={styles.choicesContainer}>
        {[1, 2, 3].map((count) => (
          <Animated.View
            key={count}
            style={[
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.choiceButton,
                selectedCount === count && styles.selectedChoiceButton,
                selectedCount === count && selectedCount === currentWord?.syllableCount && styles.correctChoiceButton,
                selectedCount === count && selectedCount !== currentWord?.syllableCount && styles.wrongChoiceButton,
              ]}
              onPress={() => handleSyllableChoice(count)}
              disabled={selectedCount !== null}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  selectedCount === count && styles.selectedChoiceButtonText,
                ]}
              >
                {count}
              </Text>
              <Text style={styles.choiceButtonLabel}>
                syllable{count > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {currentWord && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            💡 Tip: Try clapping while saying the word - each clap is one syllable!
          </Text>
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
    marginLeft: -5,
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
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  wordDisplay: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: '#3DB2FF',
    minWidth: 200,
  },
  displayWord: {
    fontSize: 36,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    textAlign: 'center',
  },
  syllableBreakdown: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
  choiceButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    width: 90,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedChoiceButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#3DB2FF',
  },
  correctChoiceButton: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wrongChoiceButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  choiceButtonText: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
  },
  selectedChoiceButtonText: {
    color: '#3DB2FF',
  },
  choiceButtonLabel: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },
  hintContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
});

export default SyllableCountingGame; 