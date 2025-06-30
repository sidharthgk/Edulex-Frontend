import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const MinigamesScreen = () => {
  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Word Matching Game State
  const [currentWord, setCurrentWord] = useState('');
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [wordScore, setWordScore] = useState(0);

  // Sequence Memory Game State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceLevel, setSequenceLevel] = useState(1);

  // Pattern Recognition Game State
  const [pattern, setPattern] = useState<string[]>([]);
  const [patternChoices, setPatternChoices] = useState<string[]>([]);
  const [patternScore, setPatternScore] = useState(0);

  const words = ['cat', 'dog', 'sun', 'book', 'tree', 'bird', 'fish', 'star', 'moon', 'car'];
  const patterns = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

  useEffect(() => {
    if (fontsLoaded) {
      initializeWordGame();
      initializePatternGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Word Matching Game Functions
  const initializeWordGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const otherWords = words.filter(w => w !== randomWord);
    const shuffledChoices = [randomWord, ...otherWords.slice(0, 2)].sort(() => Math.random() - 0.5);
    
    setCurrentWord(randomWord);
    setWordChoices(shuffledChoices);
  };

  const handleWordChoice = (selectedWord: string) => {
    if (selectedWord === currentWord) {
      setWordScore(prev => prev + 1);
      Vibration.vibrate(100);
      Alert.alert('Correct! 🎉', 'Great job!', [
        { text: 'Next Word', onPress: initializeWordGame }
      ]);
    } else {
      Alert.alert('Try Again! 🤔', 'That\'s not quite right.', [
        { text: 'Try Again', onPress: () => {} }
      ]);
    }
  };

  // Sequence Memory Game Functions
  const startSequenceGame = () => {
    const newSequence = [];
    for (let i = 0; i < sequenceLevel + 1; i++) {
      newSequence.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSequence);
    setUserSequence([]);
    setShowingSequence(true);
    
    // Show sequence with delays
    newSequence.forEach((num, index) => {
      setTimeout(() => {
        // Visual feedback would be implemented with button highlighting
        if (index === newSequence.length - 1) {
          setTimeout(() => setShowingSequence(false), 500);
        }
      }, (index + 1) * 800);
    });
  };

  const handleSequenceButton = (buttonIndex: number) => {
    if (showingSequence) return;
    
    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);
    
    if (newUserSequence.length === sequence.length) {
      if (JSON.stringify(newUserSequence) === JSON.stringify(sequence)) {
        setSequenceLevel(prev => prev + 1);
        Vibration.vibrate(100);
        Alert.alert('Perfect! 🌟', `Level ${sequenceLevel + 1} unlocked!`, [
          { text: 'Next Level', onPress: startSequenceGame }
        ]);
      } else {
        Alert.alert('Try Again! 🔄', 'The sequence was different.', [
          { text: 'Restart', onPress: () => {
            setSequenceLevel(1);
            startSequenceGame();
          }}
        ]);
      }
    }
  };

  // Pattern Recognition Game Functions
  const initializePatternGame = () => {
    const patternLength = 3;
    const newPattern = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(patterns[Math.floor(Math.random() * patterns.length)]);
    }
    
    const correctNext = patterns[Math.floor(Math.random() * patterns.length)];
    const wrongChoices = patterns.filter(p => p !== correctNext).slice(0, 2);
    const shuffledChoices = [correctNext, ...wrongChoices].sort(() => Math.random() - 0.5);
    
    setPattern([...newPattern, correctNext]);
    setPatternChoices(shuffledChoices);
  };

  const handlePatternChoice = (selectedPattern: string) => {
    const correctPattern = pattern[pattern.length - 1];
    if (selectedPattern === correctPattern) {
      setPatternScore(prev => prev + 1);
      Vibration.vibrate(100);
      Alert.alert('Excellent! 🎨', 'Pattern completed!', [
        { text: 'Next Pattern', onPress: initializePatternGame }
      ]);
    } else {
      Alert.alert('Not Quite! 🎯', 'Look at the pattern again.', [
        { text: 'Try Again', onPress: () => {} }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Games</Text>
        <Text style={styles.headerSubtitle}>Fun games to improve reading and memory</Text>
      </View>

      {/* Word Matching Game */}
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Ionicons name="book-outline" size={30} color="#4CAF50" />
          <Text style={styles.gameTitle}>Word Matching</Text>
          <Text style={styles.score}>Score: {wordScore}</Text>
        </View>
        
        <Text style={styles.instruction}>Find the word that matches:</Text>
        <View style={styles.targetWordContainer}>
          <Text style={styles.targetWord}>{currentWord}</Text>
        </View>
        
        <View style={styles.choicesContainer}>
          {wordChoices.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.choiceButton}
              onPress={() => handleWordChoice(word)}
            >
              <Text style={styles.choiceText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sequence Memory Game */}
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Ionicons name="flash-outline" size={30} color="#FF9800" />
          <Text style={styles.gameTitle}>Memory Sequence</Text>
          <Text style={styles.score}>Level: {sequenceLevel}</Text>
        </View>
        
        <Text style={styles.instruction}>
          {showingSequence ? 'Watch the sequence...' : 'Repeat the sequence:'}
        </Text>
        
        <View style={styles.sequenceContainer}>
          {[0, 1, 2, 3].map((buttonIndex) => (
            <TouchableOpacity
              key={buttonIndex}
              style={[
                styles.sequenceButton,
                { backgroundColor: ['#FF5722', '#2196F3', '#4CAF50', '#FFC107'][buttonIndex] },
                showingSequence && sequence[userSequence.length] === buttonIndex && styles.activeSequenceButton
              ]}
              onPress={() => handleSequenceButton(buttonIndex)}
              disabled={showingSequence}
            >
              <Text style={styles.sequenceButtonText}>{buttonIndex + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={startSequenceGame}
        >
          <Text style={styles.startButtonText}>Start New Game</Text>
        </TouchableOpacity>
      </View>

      {/* Pattern Recognition Game */}
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Ionicons name="color-palette-outline" size={30} color="#9C27B0" />
          <Text style={styles.gameTitle}>Pattern Recognition</Text>
          <Text style={styles.score}>Score: {patternScore}</Text>
        </View>
        
        <Text style={styles.instruction}>Complete the pattern:</Text>
        <View style={styles.patternContainer}>
          {pattern.slice(0, -1).map((color, index) => (
            <View
              key={index}
              style={[
                styles.patternBlock,
                { backgroundColor: getColorCode(color) }
              ]}
            />
          ))}
          <View style={styles.questionBlock}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>
        
        <View style={styles.choicesContainer}>
          {patternChoices.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorChoice,
                { backgroundColor: getColorCode(color) }
              ]}
              onPress={() => handlePatternChoice(color)}
            >
              <Text style={styles.colorText}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How to Play</Text>
        <View style={styles.instructionItem}>
          <Ionicons name="book-outline" size={20} color="#4CAF50" />
          <Text style={styles.instructionText}>Word Matching: Find the matching word</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="flash-outline" size={20} color="#FF9800" />
          <Text style={styles.instructionText}>Memory: Watch and repeat the sequence</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="color-palette-outline" size={20} color="#9C27B0" />
          <Text style={styles.instructionText}>Patterns: Complete the color pattern</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getColorCode = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    red: '#FF5722',
    blue: '#2196F3',
    green: '#4CAF50',
    yellow: '#FFC107',
    orange: '#FF9800',
    purple: '#9C27B0',
  };
  return colorMap[colorName] || '#999999';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  gameCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gameTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    flex: 1,
    marginLeft: 10,
  },
  score: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  instruction: {
    fontSize: 16,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 15,
  },
  targetWordContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  targetWord: {
    fontSize: 24,
    color: '#1976D2',
    fontFamily: 'OpenDyslexic-Bold',
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  choiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  choiceText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sequenceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  activeSequenceButton: {
    transform: [{ scale: 1.1 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sequenceButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  patternContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  patternBlock: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  questionBlock: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  questionMark: {
    fontSize: 20,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Bold',
  },
  colorChoice: {
    borderRadius: 15,
    padding: 15,
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  colorText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionsCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 10,
    flex: 1,
  },
});

export default MinigamesScreen; 