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

interface WordChallenge {
  word: string;
  clue: string;
  hint: string;
  category: string;
  difficulty: number;
}

const wordChallenges: WordChallenge[] = [
  // Level 1 - Simple 3-4 letter words
  { word: 'CAT', clue: '🐱 A furry pet that says meow', hint: 'Rhymes with hat', category: 'Animals', difficulty: 1 },
  { word: 'DOG', clue: '🐕 A loyal pet that barks', hint: 'Best friend of humans', category: 'Animals', difficulty: 1 },
  { word: 'SUN', clue: '☀️ Bright star in the sky', hint: 'Gives us light and warmth', category: 'Nature', difficulty: 1 },
  { word: 'CAR', clue: '🚗 Vehicle with four wheels', hint: 'Used for transportation', category: 'Transport', difficulty: 1 },
  { word: 'BOOK', clue: '📚 You read this for stories', hint: 'Made of pages', category: 'Objects', difficulty: 1 },
  { word: 'TREE', clue: '🌳 Tall plant with leaves', hint: 'Birds build nests in it', category: 'Nature', difficulty: 1 },
  
  // Level 2 - Medium 4-5 letter words
  { word: 'HAPPY', clue: '😊 Feeling joyful and good', hint: 'Opposite of sad', category: 'Emotions', difficulty: 2 },
  { word: 'HOUSE', clue: '🏠 Place where people live', hint: 'Has rooms and a roof', category: 'Places', difficulty: 2 },
  { word: 'WATER', clue: '💧 Clear liquid we drink', hint: 'Fish swim in it', category: 'Nature', difficulty: 2 },
  { word: 'MUSIC', clue: '🎵 Sounds that make songs', hint: 'You can dance to it', category: 'Arts', difficulty: 2 },
  { word: 'PHONE', clue: '📱 Device for calling people', hint: 'You can text with it too', category: 'Technology', difficulty: 2 },
  { word: 'SMILE', clue: '😄 Happy expression on face', hint: 'Shows your teeth', category: 'Emotions', difficulty: 2 },
  
  // Level 3 - Harder 5-6 letter words
  { word: 'FRIEND', clue: '👫 Someone you like and trust', hint: 'Person you play with', category: 'People', difficulty: 3 },
  { word: 'SCHOOL', clue: '🏫 Place where you learn', hint: 'Has classrooms and teachers', category: 'Places', difficulty: 3 },
  { word: 'FAMILY', clue: '👨‍👩‍👧‍👦 Parents and children together', hint: 'People who love you', category: 'People', difficulty: 3 },
  { word: 'RAINBOW', clue: '🌈 Colorful arc in the sky', hint: 'Appears after rain', category: 'Nature', difficulty: 3 },
  { word: 'GARDEN', clue: '🌻 Place where flowers grow', hint: 'You plant seeds here', category: 'Places', difficulty: 3 },
  { word: 'COOKIE', clue: '🍪 Sweet treat you can eat', hint: 'Often eaten with milk', category: 'Food', difficulty: 3 },
];

const WordBuildingGame = () => {
  const navigation = useNavigation();
  
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Game state
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedWords, setCompletedWords] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const generateNewChallenge = useCallback(() => {
    // Get words for current level
    const availableWords = wordChallenges.filter(challenge => challenge.difficulty <= level);
    const randomChallenge = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Create available letters (correct letters + some random ones)
    const wordLetters = randomChallenge.word.split('');
    const extraLetters: string[] = [];
    
    // Add 3-5 random letters to make it challenging
    const numExtra = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numExtra; i++) {
      let randomLetter;
      do {
        randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      } while (wordLetters.includes(randomLetter) || extraLetters.includes(randomLetter));
      extraLetters.push(randomLetter);
    }
    
    // Combine and shuffle all letters
    const allLetters = [...wordLetters, ...extraLetters];
    for (let i = allLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
    }

    setCurrentChallenge(randomChallenge);
    setAvailableLetters(allLetters);
    setPlacedLetters(new Array(randomChallenge.word.length).fill(null));
    setShowHint(false);

    // Animate challenge appearance
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [level, bounceAnim]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setStreak(0);
    setCompletedWords(0);
    setGameStarted(true);
    generateNewChallenge();
  }, [generateNewChallenge]);

  useEffect(() => {
    if (fontsLoaded && gameStarted) {
      generateNewChallenge();
    }
  }, [fontsLoaded, level, gameStarted, generateNewChallenge]);

  if (!fontsLoaded) {
    return null;
  }

  const selectLetter = (letter: string) => {
    if (selectedLetter === letter) {
      // Deselect if same letter is tapped
      setSelectedLetter(null);
      return;
    }
    setSelectedLetter(letter);
    
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const selectPosition = (position: number) => {
    if (placedLetters[position] !== null) {
      // Remove letter from this position
      removeLetter(position);
      return;
    }
    
    if (!selectedLetter) {
      Alert.alert('📝 Select a Letter First!', 'Tap on a letter below, then tap on an empty box to place it.');
      return;
    }
    
    // Place the selected letter in this position
    const newPlacedLetters = [...placedLetters];
    newPlacedLetters[position] = selectedLetter;
    setPlacedLetters(newPlacedLetters);
    
    // Remove letter from available letters
    const letterIndex = availableLetters.indexOf(selectedLetter);
    const newAvailableLetters = [...availableLetters];
    newAvailableLetters.splice(letterIndex, 1);
    setAvailableLetters(newAvailableLetters);
    
    // Clear selection
    setSelectedLetter(null);

    // Animate placement
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const removeLetter = (position: number) => {
    const letter = placedLetters[position];
    if (!letter) return;
    
    const newPlacedLetters = [...placedLetters];
    newPlacedLetters[position] = null;
    setPlacedLetters(newPlacedLetters);
    
    // Add letter back to available letters
    setAvailableLetters([...availableLetters, letter]);
  };

  const checkWord = () => {
    if (!currentChallenge || placedLetters.includes(null)) {
      Alert.alert('⚠️ Incomplete Word', 'Please fill in all letter positions first!');
      return;
    }

    const formedWord = placedLetters.join('');
    
    if (formedWord === currentChallenge.word) {
      // Correct word!
      const points = currentChallenge.difficulty * 25 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCompletedWords(prev => prev + 1);
      Vibration.vibrate(200);

      // Celebration animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Level up after certain completions
      if (completedWords > 0 && (completedWords + 1) % 5 === 0 && level < 3) {
        setLevel(prev => prev + 1);
        Alert.alert(
          '🎉 Level Up!',
          `Fantastic! You've reached level ${level + 1}!\nLonger words ahead!`,
          [{ text: 'Continue', onPress: () => generateNewChallenge() }]
        );
      } else {
        Alert.alert(
          '🎯 Perfect!',
          `Excellent spelling! "${currentChallenge.word}" is correct!\n+${points} points`,
          [{ text: 'Next Word', onPress: () => generateNewChallenge() }]
        );
      }
    } else {
      // Wrong word
      setStreak(0);
      setLives(prev => prev - 1);
      Vibration.vibrate([100, 50, 100, 50, 100]);

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

      if (lives - 1 <= 0) {
        Alert.alert(
          '💔 Game Over!',
          `Good effort! You scored ${score} points and completed ${completedWords} words.\n\nThe word was "${currentChallenge.word}" - ${currentChallenge.hint}`,
          [
            { text: 'Play Again', onPress: startNewGame },
            { text: 'Exit', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert(
          '❌ Not Quite Right!',
          `The word "${formedWord}" isn't correct.\n\nTry again! Lives left: ${lives - 1}\n\nHint: ${currentChallenge.hint}`,
          [{ text: 'Try Again', onPress: () => {} }]
        );
      }
    }
  };

  const clearAllLetters = () => {
    setAvailableLetters([...availableLetters, ...placedLetters.filter(letter => letter !== null) as string[]]);
    setPlacedLetters(new Array(currentChallenge!.word.length).fill(null));
    setSelectedLetter(null);
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
          <Text style={styles.headerTitle}>Word Builder</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Ionicons name="build" size={64} color="#3DB2FF" />
          <Text style={styles.instructionTitle}>Build Words from Clues!</Text>
          <Text style={styles.instructionText}>
            Select letters and place them in boxes to spell words from the given clues. Perfect for improving spelling and vocabulary!
          </Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleItem}>📖 Read the clue and emoji hint</Text>
            <Text style={styles.ruleItem}>👆 Tap a letter to select it (it will glow green)</Text>
            <Text style={styles.ruleItem}>📦 Tap an empty numbered box to place the letter</Text>
            <Text style={styles.ruleItem}>🔄 Tap filled boxes to remove letters</Text>
            <Text style={styles.ruleItem}>💡 Use hints if you get stuck</Text>
            <Text style={styles.ruleItem}>🎯 Complete 5 words to level up!</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
            <Text style={styles.startButtonText}>Start Building!</Text>
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
        <Text style={styles.headerTitle}>Word Builder</Text>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Words</Text>
          <Text style={styles.infoValue}>{completedWords}</Text>
        </View>
      </View>

      {currentChallenge && (
        <Animated.View 
          style={[
            styles.challengeContainer,
            { transform: [{ scale: bounceAnim }, { translateX: shakeAnim }] }
          ]}
        >
          <Text style={styles.categoryText}>{currentChallenge.category}</Text>
          <Text style={styles.clueText}>{currentChallenge.clue}</Text>
          
          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>💡 {currentChallenge.hint}</Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {selectedLetter 
            ? `💡 Letter "${selectedLetter}" selected! Now tap an empty box above to place it.`
            : '👆 First, tap a letter below. Then tap an empty box above to place it!'
          }
        </Text>
      </View>

      {/* Word Building Area */}
      <View style={styles.wordContainer}>
        <Text style={styles.buildLabel}>Tap the empty boxes to place letters:</Text>
        <View style={styles.letterBoxes}>
          {placedLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.letterBox,
                letter ? styles.filledBox : styles.emptyBox,
                selectedLetter && !letter ? styles.highlightedBox : null
              ]}
              onPress={() => selectPosition(index)}
            >
              <Text style={styles.boxLetter}>{letter || ''}</Text>
              {!letter && (
                <Text style={styles.boxPlaceholder}>{index + 1}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Available Letters */}
      <View style={styles.availableContainer}>
        <Text style={styles.availableLabel}>
          {selectedLetter ? `Selected: "${selectedLetter}" | Tap to deselect` : 'Tap a letter to select it:'}
        </Text>
        <View style={styles.lettersGrid}>
          {availableLetters.map((letter, index) => (
            <TouchableOpacity
              key={`${letter}-${index}`}
              style={[
                styles.letterTile,
                selectedLetter === letter ? styles.selectedLetterTile : null
              ]}
              onPress={() => selectLetter(letter)}
            >
              <Text style={[
                styles.tileLetter,
                selectedLetter === letter ? styles.selectedTileText : null
              ]}>
                {letter}
              </Text>
              {selectedLetter === letter && (
                <View style={styles.selectionIndicator}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.hintButton} onPress={() => setShowHint(true)}>
          <Ionicons name="bulb" size={16} color="#FFB74D" />
          <Text style={styles.hintButtonText}>Hint</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearAllLetters}>
          <Ionicons name="refresh" size={16} color="#FF7043" />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 3,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  dangerText: {
    color: '#F44336',
  },
  challengeContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#3DB2FF',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  clueText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    textAlign: 'center',
    lineHeight: 26,
  },
  hintContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  hintText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#E65100',
    textAlign: 'center',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  buildLabel: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 15,
  },
  letterBoxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  letterBox: {
    width: 50,
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  boxLetter: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  availableContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  availableLabel: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 15,
    textAlign: 'center',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#3DB2FF',
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#1976D2',
    textAlign: 'center',
    lineHeight: 20,
  },
  filledBox: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  emptyBox: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  highlightedBox: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    borderStyle: 'solid',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  boxPlaceholder: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#CCCCCC',
    bottom: 2,
    right: 4,
  },
  selectedLetterTile: {
    backgroundColor: '#2E7D32',
    transform: [{ scale: 1.1 }],
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedTileText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  letterTile: {
    width: 45,
    height: 45,
    backgroundColor: '#3DB2FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tileLetter: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  hintButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#E65100',
    marginLeft: 5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FF7043',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#D32F2F',
    marginLeft: 5,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  checkButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
});

export default WordBuildingGame; 