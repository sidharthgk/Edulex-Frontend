import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';


interface Word {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  pronunciation: string;
  learned: boolean;
  attempts: number;
  correctAttempts: number;
}

const VocabularyBuilder = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [gameMode, setGameMode] = useState<'learn' | 'quiz' | 'review'>('learn');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [progress, setProgress] = useState({ correct: 0, total: 0 });
  const [fadeAnim] = useState(new Animated.Value(0));
  


  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Sample vocabulary words organized by category
  const vocabularyWords: Word[] = [
    // Reading & Literature
    {
      id: '1',
      word: 'narrative',
      definition: 'A story or account of events',
      example: 'The book tells the narrative of a young explorer.',
      difficulty: 'Medium',
      category: 'Reading',
      pronunciation: 'NAR-uh-tiv',
      learned: false,
      attempts: 0,
      correctAttempts: 0,
    },
    {
      id: '2',
      word: 'character',
      definition: 'A person in a story, book, or play',
      example: 'Harry Potter is the main character in the series.',
      difficulty: 'Easy',
      category: 'Reading',
      pronunciation: 'CHAR-ik-ter',
      learned: true,
      attempts: 3,
      correctAttempts: 3,
    },
    {
      id: '3',
      word: 'metaphor',
      definition: 'A comparison without using like or as',
      example: 'Her voice is music to my ears.',
      difficulty: 'Hard',
      category: 'Reading',
      pronunciation: 'MET-uh-for',
      learned: false,
      attempts: 0,
      correctAttempts: 0,
    },
    // Science
    {
      id: '4',
      word: 'photosynthesis',
      definition: 'The process plants use to make food from sunlight',
      example: 'Plants need sunlight for photosynthesis.',
      difficulty: 'Hard',
      category: 'Science',
      pronunciation: 'foh-toh-SIN-thuh-sis',
      learned: false,
      attempts: 0,
      correctAttempts: 0,
    },
    {
      id: '5',
      word: 'gravity',
      definition: 'The force that pulls objects toward Earth',
      example: 'Gravity makes things fall down.',
      difficulty: 'Medium',
      category: 'Science',
      pronunciation: 'GRAV-i-tee',
      learned: true,
      attempts: 2,
      correctAttempts: 2,
    },
    // Math
    {
      id: '6',
      word: 'fraction',
      definition: 'A part of a whole number',
      example: 'One half is written as the fraction 1/2.',
      difficulty: 'Medium',
      category: 'Math',
      pronunciation: 'FRAK-shun',
      learned: false,
      attempts: 0,
      correctAttempts: 0,
    },
    // Everyday
    {
      id: '7',
      word: 'curious',
      definition: 'Wanting to learn or know more about something',
      example: 'She was curious about how birds fly.',
      difficulty: 'Easy',
      category: 'Everyday',
      pronunciation: 'KYUR-ee-us',
      learned: true,
      attempts: 1,
      correctAttempts: 1,
    },
    {
      id: '8',
      word: 'excellent',
      definition: 'Very good; outstanding',
      example: 'She did an excellent job on her project.',
      difficulty: 'Easy',
      category: 'Everyday',
      pronunciation: 'EK-suh-lent',
      learned: false,
      attempts: 0,
      correctAttempts: 0,
    },
  ];

  const categories = ['All', 'Reading', 'Science', 'Math', 'Everyday'];

  const getFilteredWords = useCallback(() => {
    if (selectedCategory === 'All') {
      return vocabularyWords;
    }
    return vocabularyWords.filter(word => word.category === selectedCategory);
  }, [selectedCategory, vocabularyWords]);

  const getRandomWord = useCallback(() => {
    const filteredWords = getFilteredWords();
    const availableWords = gameMode === 'review' 
      ? filteredWords.filter(w => w.learned)
      : filteredWords.filter(w => !w.learned);
    
    if (availableWords.length === 0) {
      return filteredWords[Math.floor(Math.random() * filteredWords.length)];
    }
    
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }, [getFilteredWords, gameMode]);

  const startNewWord = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setShowDefinition(gameMode === 'learn');
    setUserGuess('');
    
    // Animate word appearance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [gameMode, selectedCategory, fadeAnim]);

  const pronounceWord = (word: string) => {
    Speech.speak(word, {
      rate: 0.8,
      pitch: 1.0,
    });
  };

  const handleGuessSubmit = () => {
    if (!currentWord || !userGuess.trim()) return;

    const isCorrect = userGuess.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    // Update word stats
    currentWord.attempts += 1;
    if (isCorrect) {
      currentWord.correctAttempts += 1;
      if (currentWord.correctAttempts >= 2) {
        currentWord.learned = true;
      }
    }

    // Update progress
    setProgress(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));

    if (isCorrect) {
      Alert.alert(
        '🎉 Correct!',
        `Great job! "${currentWord.word}" means: ${currentWord.definition}`,
        [{ text: 'Next Word', onPress: startNewWord }]
      );
    } else {
      Alert.alert(
        '📚 Keep Learning',
        `The word was "${currentWord.word}". ${currentWord.definition}\n\nExample: ${currentWord.example}`,
        [{ text: 'Try Again', onPress: startNewWord }]
      );
    }
  };

  const handleShowDefinition = () => {
    setShowDefinition(true);
    if (currentWord) {
      Alert.alert(
        `📖 ${currentWord.word}`,
        `Definition: ${currentWord.definition}\n\nExample: ${currentWord.example}\n\nPronunciation: ${currentWord.pronunciation}`,
        [
          { text: 'Hear It', onPress: () => pronounceWord(currentWord.word) },
          { text: 'Got It', onPress: () => {} }
        ]
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#666666';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reading': return '#9C27B0';
      case 'Science': return '#2196F3';
      case 'Math': return '#FF5722';
      case 'Everyday': return '#4CAF50';
      default: return '#666666';
    }
  };

  const getProgressPercentage = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.correct / progress.total) * 100);
  };

  const getLearnedWordsCount = () => {
    return vocabularyWords.filter(w => w.learned).length;
  };

  useEffect(() => {
    startNewWord();
  }, [gameMode, selectedCategory, startNewWord]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 Vocabulary Builder</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Stats */}
      <View style={styles.progressContainer}>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{getLearnedWordsCount()}</Text>
          <Text style={styles.progressLabel}>Words Learned</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{getProgressPercentage()}%</Text>
          <Text style={styles.progressLabel}>Accuracy</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{progress.total}</Text>
          <Text style={styles.progressLabel}>Total Attempts</Text>
        </View>
      </View>

      {/* Game Mode Selection */}
      <View style={styles.modeContainer}>
        <Text style={styles.sectionTitle}>🎮 Learning Mode</Text>
        <View style={styles.modeButtons}>
          {['learn', 'quiz', 'review'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                gameMode === mode && styles.modeButtonActive
              ]}
              onPress={() => setGameMode(mode as any)}
            >
              <Text style={[
                styles.modeButtonText,
                gameMode === mode && styles.modeButtonTextActive
              ]}>
                {mode === 'learn' && '📖 Learn'}
                {mode === 'quiz' && '🧠 Quiz'}
                {mode === 'review' && '🔄 Review'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>📂 Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
                { borderColor: getCategoryColor(category) }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && { color: getCategoryColor(category) }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Current Word Display */}
      {currentWord && (
        <Animated.View style={[styles.wordContainer, { opacity: fadeAnim }]}>
          <View style={styles.wordCard}>
            <View style={styles.wordHeader}>
              <View style={styles.wordTags}>
                <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(currentWord.difficulty) }]}>
                  <Text style={styles.tagText}>{currentWord.difficulty}</Text>
                </View>
                <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(currentWord.category) }]}>
                  <Text style={styles.tagText}>{currentWord.category}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.pronounceButton}
                onPress={() => pronounceWord(currentWord.word)}
              >
                <Ionicons name="volume-high" size={24} color="#3DB2FF" />
              </TouchableOpacity>
            </View>

            {gameMode === 'learn' ? (
              // Learning Mode - Show word and definition
              <View style={styles.learnContent}>
                <Text style={styles.wordText}>{currentWord.word}</Text>
                <Text style={styles.pronunciationText}>{currentWord.pronunciation}</Text>
                {showDefinition && (
                  <>
                    <Text style={styles.definitionText}>{currentWord.definition}</Text>
                    <Text style={styles.exampleText}>Example: {currentWord.example}</Text>
                  </>
                )}
                <TouchableOpacity style={styles.nextButton} onPress={startNewWord}>
                  <Text style={styles.nextButtonText}>Next Word</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Quiz Mode - Show definition, guess word
              <View style={styles.quizContent}>
                <Text style={styles.definitionText}>{currentWord.definition}</Text>
                <Text style={styles.exampleText}>Example: {currentWord.example}</Text>
                
                <TextInput
                  style={styles.guessInput}
                  placeholder="Type the word..."
                  value={userGuess}
                  onChangeText={setUserGuess}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.hintButton}
                    onPress={handleShowDefinition}
                  >
                    <Ionicons name="bulb-outline" size={20} color="#FF9800" />
                    <Text style={styles.hintButtonText}>Hint</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.submitButton, !userGuess.trim() && styles.submitButtonDisabled]}
                    onPress={handleGuessSubmit}
                    disabled={!userGuess.trim()}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Word List Preview */}
      <View style={styles.wordListContainer}>
        <Text style={styles.sectionTitle}>📝 Your Vocabulary</Text>
        {getFilteredWords().slice(0, 5).map((word) => (
          <TouchableOpacity
            key={word.id}
            style={styles.wordListItem}
            onPress={() => {
              setCurrentWord(word);
              setShowDefinition(true);
              handleShowDefinition();
            }}
          >
            <View style={styles.wordListContent}>
              <Text style={styles.wordListWord}>{word.word}</Text>
              <Text style={styles.wordListDefinition}>{word.definition}</Text>
              <View style={styles.wordListStats}>
                <Text style={styles.wordListAttempts}>
                  {word.correctAttempts}/{word.attempts} correct
                </Text>
                {word.learned && (
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.wordListPronounce}
              onPress={() => pronounceWord(word.word)}
            >
              <Ionicons name="volume-high" size={20} color="#3DB2FF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllButtonText}>View All Words ({getFilteredWords().length})</Text>
          <Ionicons name="arrow-forward" size={16} color="#3DB2FF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
  },
  progressCard: {
    alignItems: 'center',
    flex: 1,
  },
  progressNumber: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  modeContainer: {
    marginBottom: 25,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  modeButtonActive: {
    backgroundColor: '#3DB2FF',
    borderColor: '#3DB2FF',
  },
  modeButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#666666',
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderWidth: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#F0F8FF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  wordContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  wordTags: {
    flexDirection: 'row',
  },
  difficultyTag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  categoryTag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  pronounceButton: {
    padding: 8,
  },
  learnContent: {
    alignItems: 'center',
  },
  wordText: {
    fontSize: 32,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 10,
  },
  pronunciationText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Italic',
    color: '#666666',
    marginBottom: 20,
  },
  definitionText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 15,
  },
  exampleText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Italic',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  quizContent: {
    alignItems: 'center',
  },
  guessInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    textAlign: 'center',
    marginVertical: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  hintButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#FF9800',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  wordListContainer: {
    marginBottom: 40,
  },
  wordListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  wordListContent: {
    flex: 1,
  },
  wordListWord: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  wordListDefinition: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 5,
  },
  wordListStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordListAttempts: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#999999',
  },
  wordListPronounce: {
    padding: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginRight: 5,
  },
});

export default VocabularyBuilder; 