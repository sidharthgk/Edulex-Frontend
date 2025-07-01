import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Animated,
  Dimensions,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface WordSet {
  word: string;
  difficulty: number;
  category: string;
}

const wordSets: WordSet[] = [
  // Easy words (3-4 letters)
  { word: 'cat', difficulty: 1, category: 'animals' },
  { word: 'dog', difficulty: 1, category: 'animals' },
  { word: 'sun', difficulty: 1, category: 'nature' },
  { word: 'car', difficulty: 1, category: 'objects' },
  { word: 'book', difficulty: 1, category: 'objects' },
  { word: 'tree', difficulty: 1, category: 'nature' },
  { word: 'fish', difficulty: 1, category: 'animals' },
  { word: 'bird', difficulty: 1, category: 'animals' },

  // Medium words (5-6 letters)
  { word: 'house', difficulty: 2, category: 'objects' },
  { word: 'happy', difficulty: 2, category: 'emotions' },
  { word: 'water', difficulty: 2, category: 'nature' },
  { word: 'apple', difficulty: 2, category: 'food' },
  { word: 'plane', difficulty: 2, category: 'objects' },
  { word: 'flower', difficulty: 2, category: 'nature' },
  { word: 'friend', difficulty: 2, category: 'people' },
  { word: 'school', difficulty: 2, category: 'places' },

  // Hard words (7+ letters)
  { word: 'rainbow', difficulty: 3, category: 'nature' },
  { word: 'computer', difficulty: 3, category: 'objects' },
  { word: 'elephant', difficulty: 3, category: 'animals' },
  { word: 'birthday', difficulty: 3, category: 'events' },
  { word: 'wonderful', difficulty: 3, category: 'emotions' },
  { word: 'playground', difficulty: 3, category: 'places' },
];

const WordMatchingGame = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Game state
  const [currentWord, setCurrentWord] = useState<WordSet | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Game timer
  useEffect(() => {
    let timer: any;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameActive]);

  // Initialize game
  useEffect(() => {
    if (fontsLoaded) {
      generateNewWord();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded, level]);

  if (!fontsLoaded) {
    return null;
  }

  const generateNewWord = () => {
    // Filter words by current difficulty level
    const availableWords = wordSets.filter(w => w.difficulty <= level);
    if (availableWords.length === 0) {return;}

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    // Generate wrong choices from same difficulty level
    const wrongChoices = availableWords
      .filter(w => w.word !== randomWord.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(w => w.word);

    // Shuffle all choices
    const allChoices = [randomWord.word, ...wrongChoices].sort(() => Math.random() - 0.5);

    setCurrentWord(randomWord);
    setChoices(allChoices);
    setSelectedChoice(null);
  };

  const handleChoice = (selectedWord: string) => {
    if (!currentWord || selectedChoice) {return;}

    setSelectedChoice(selectedWord);

    // Animate button press
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

    setTimeout(() => {
      if (selectedWord === currentWord.word) {
        // Correct answer
        const points = currentWord.difficulty * 10 + (streak * 5);
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        Vibration.vibrate(100);

        // Level up after certain streaks
        if (streak > 0 && (streak + 1) % 5 === 0 && level < 3) {
          setLevel(prev => prev + 1);
          Alert.alert(
            '🎉 Level Up!',
            `Great job! You've reached level ${level + 1}!`,
            [{ text: 'Continue', onPress: () => generateNewWord() }]
          );
        } else {
          // Fade transition to next word
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            generateNewWord();
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          });
        }
      } else {
        // Wrong answer
        setStreak(0);
        Vibration.vibrate([100, 50, 100]);
        Alert.alert(
          '🤔 Try Again!',
          `The correct word was "${currentWord.word}". Keep trying!`,
          [{ text: 'Next Word', onPress: () => generateNewWord() }]
        );
      }
    }, 500);
  };

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(60); // 1 minute game
    setScore(0);
    setStreak(0);
    setLevel(1);
    setGameComplete(false);
    generateNewWord();
  };

  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);

    let performance = 'Good effort!';
    if (score >= 200) {performance = 'Outstanding! 🌟';}
    else if (score >= 150) {performance = 'Excellent! 🎉';}
    else if (score >= 100) {performance = 'Great job! 👏';}
    else if (score >= 50) {performance = 'Well done! 😊';}

    Alert.alert(
      '⏰ Time\'s Up!',
      `${performance}\n\nFinal Score: ${score}\nBest Streak: ${streak}\nLevel Reached: ${level}`,
      [
        { text: 'Play Again', onPress: startGame },
        { text: 'Back to Games', onPress: () => navigation.goBack() },
      ]
    );
  };

  const pauseGame = () => {
    setGameActive(false);
    Alert.alert(
      '⏸️ Game Paused',
      'Take your time! Ready to continue?',
      [
        { text: 'Resume', onPress: () => setGameActive(true) },
        { text: 'End Game', onPress: endGame },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Word Matching</Text>
          <Text style={styles.headerSubtitle}>Match the words correctly</Text>
        </View>

        {gameActive && (
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={pauseGame}
          >
            <Ionicons name="pause" size={24} color="#FF9800" />
          </TouchableOpacity>
        )}
      </View>

      {/* Game Stats */}
      {gameActive && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={[styles.statValue, timeLeft <= 10 && styles.urgentTime]}>
              {timeLeft}s
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
        </View>
      )}

      {/* Game Content */}
      <View style={styles.gameContent}>
        {!gameActive && !gameComplete ? (
          // Start Screen
          <View style={styles.startScreen}>
            <View style={styles.iconContainer}>
              <Ionicons name="book-outline" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.gameTitle}>Word Matching Challenge</Text>
            <Text style={styles.gameDescription}>
              Match words as quickly and accurately as possible!
              Build streaks to level up and earn bonus points.
            </Text>

            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>How to Play:</Text>
              <Text style={styles.rule}>• Find the word that matches the target</Text>
              <Text style={styles.rule}>• Build streaks for bonus points</Text>
              <Text style={styles.rule}>• Level up every 5 correct answers</Text>
              <Text style={styles.rule}>• You have 60 seconds!</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        ) : gameActive && currentWord ? (
          // Active Game
          <Animated.View
            style={[styles.gameArea, { opacity: fadeAnim }]}
          >
            <Text style={styles.instruction}>Find the word that matches:</Text>

            <View style={styles.targetWordContainer}>
              <Text style={styles.targetWord}>{currentWord.word}</Text>
              <Text style={styles.categoryLabel}>{currentWord.category}</Text>
            </View>

            <View style={styles.choicesContainer}>
              {choices.map((choice, index) => (
                <Animated.View
                  key={index}
                  style={{ transform: [{ scale: scaleAnim }] }}
                >
                  <TouchableOpacity
                    style={[
                      styles.choiceButton,
                      selectedChoice === choice && choice === currentWord.word && styles.correctChoice,
                      selectedChoice === choice && choice !== currentWord.word && styles.wrongChoice,
                    ]}
                    onPress={() => handleChoice(choice)}
                    disabled={!!selectedChoice}
                  >
                    <Text style={[
                      styles.choiceText,
                      selectedChoice === choice && choice === currentWord.word && styles.correctChoiceText,
                      selectedChoice === choice && choice !== currentWord.word && styles.wrongChoiceText,
                    ]}>
                      {choice}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Progress indicators */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Next level: {5 - (streak % 5)}/5 streak
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((streak % 5) / 5) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  pauseButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  statValue: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 2,
  },
  urgentTime: {
    color: '#FF5722',
  },
  gameContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  gameTitle: {
    fontSize: 28,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  gameDescription: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  rulesContainer: {
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  rulesTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 5,
    paddingLeft: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  targetWordContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  targetWord: {
    fontSize: 32,
    color: '#1976D2',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#1976D2',
    fontFamily: 'OpenDyslexic-Regular',
    opacity: 0.7,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  choiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    minWidth: (screenWidth - 80) / 3,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctChoice: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wrongChoice: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  choiceText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
  },
  correctChoiceText: {
    color: '#4CAF50',
    fontFamily: 'OpenDyslexic-Bold',
  },
  wrongChoiceText: {
    color: '#F44336',
    fontFamily: 'OpenDyslexic-Bold',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 10,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});

export default WordMatchingGame;
