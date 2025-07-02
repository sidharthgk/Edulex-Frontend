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

interface WordSet {
  word: string;
  difficulty: number;
  category: string;
}

const wordSets: WordSet[] = [
  { word: 'cat', difficulty: 1, category: 'animals' },
  { word: 'dog', difficulty: 1, category: 'animals' },
  { word: 'sun', difficulty: 1, category: 'nature' },
  { word: 'car', difficulty: 1, category: 'objects' },
  { word: 'book', difficulty: 1, category: 'objects' },
  { word: 'tree', difficulty: 1, category: 'nature' },
  { word: 'fish', difficulty: 1, category: 'animals' },
  { word: 'bird', difficulty: 1, category: 'animals' },
  { word: 'house', difficulty: 2, category: 'objects' },
  { word: 'happy', difficulty: 2, category: 'emotions' },
  { word: 'water', difficulty: 2, category: 'nature' },
  { word: 'apple', difficulty: 2, category: 'food' },
];

const MinigamesScreen = () => {
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  // Current screen state
  const [currentScreen, setCurrentScreen] = useState('hub');

  // Word Matching Game State
  const [currentWord, setCurrentWord] = useState<WordSet | null>(null);
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [wordScore, setWordScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Memory Game State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceLevel, setSequenceLevel] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  // Letter Recognition Game State
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [letterChoices, setLetterChoices] = useState<string[]>([]);
  const [letterScore, setLetterScore] = useState(0);
  const [isUppercase, setIsUppercase] = useState(true);

  const confusingLetters = [
    ['b', 'd'], ['p', 'q'], ['m', 'w'], ['n', 'u'],
    ['f', 't'], ['h', 'n'], ['i', 'l'], ['o', 'a'],
    ['c', 'e'], ['s', 'z'], ['v', 'y'], ['k', 'h'],
  ];

  useEffect(() => {
    if (fontsLoaded && currentScreen !== 'hub') {
      if (currentScreen === 'wordMatch') {
        initializeWordGame();
      } else if (currentScreen === 'letters') {
        initializeLetterGame();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded, currentScreen]);

  if (!fontsLoaded) {
    return null;
  }

  // Word Matching Game Functions
  const initializeWordGame = () => {
    const randomWord = wordSets[Math.floor(Math.random() * wordSets.length)];
    const otherWords = wordSets.filter(w => w.word !== randomWord.word);
    const shuffledChoices = [randomWord.word, ...otherWords.slice(0, 2).map(w => w.word)]
      .sort(() => Math.random() - 0.5);

    setCurrentWord(randomWord);
    setWordChoices(shuffledChoices);
    setSelectedChoice(null);
  };

  const handleWordChoice = (selectedWord: string) => {
    if (!currentWord || selectedChoice) {return;}

    setSelectedChoice(selectedWord);

    setTimeout(() => {
      if (selectedWord === currentWord.word) {
        setWordScore(prev => prev + currentWord.difficulty * 10);
        Vibration.vibrate(100);
        Alert.alert('Correct! 🎉', 'Great job!', [
          { text: 'Next Word', onPress: initializeWordGame },
        ]);
      } else {
        Vibration.vibrate([100, 50, 100]);
        Alert.alert('Try Again! 🤔', `The correct word was "${currentWord.word}".`, [
          { text: 'Next Word', onPress: initializeWordGame },
        ]);
      }
    }, 500);
  };

  // Memory Game Functions
  const startMemoryGame = () => {
    const newSequence = [];
    for (let i = 0; i < sequenceLevel + 1; i++) {
      newSequence.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSequence);
    setUserSequence([]);
    setShowingSequence(true);
    setCurrentStep(0);

    newSequence.forEach((num, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === newSequence.length - 1) {
          setTimeout(() => {
            setShowingSequence(false);
            setCurrentStep(0);
          }, 800);
        }
      }, (index + 1) * 1000);
    });
  };

  const handleMemoryButton = (buttonIndex: number) => {
    if (showingSequence) {return;}

    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      if (JSON.stringify(newUserSequence) === JSON.stringify(sequence)) {
        setSequenceLevel(prev => prev + 1);
        Vibration.vibrate(100);
        Alert.alert('Perfect! 🌟', `Level ${sequenceLevel + 1} unlocked!`, [
          { text: 'Next Level', onPress: startMemoryGame },
        ]);
      } else {
        setSequenceLevel(1);
        Alert.alert('Try Again! 🔄', 'The sequence was different.', [
          { text: 'Restart', onPress: startMemoryGame },
        ]);
      }
    }
  };

  // Letter Recognition Game Functions
  const initializeLetterGame = () => {
    // Select a random confusing letter pair
    const letterPair = confusingLetters[Math.floor(Math.random() * confusingLetters.length)];
    const targetLetter = letterPair[Math.floor(Math.random() * letterPair.length)];
    const displayLetter = isUppercase ? targetLetter.toUpperCase() : targetLetter;

    // Create choices with the target letter and confusing alternatives
    const otherLetter = letterPair.find(l => l !== targetLetter) || 'x';
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random letter

    const choices = [
      isUppercase ? targetLetter.toUpperCase() : targetLetter,
      isUppercase ? otherLetter.toUpperCase() : otherLetter,
      isUppercase ? randomLetter.toUpperCase() : randomLetter,
    ].sort(() => Math.random() - 0.5);

    setCurrentLetter(displayLetter);
    setLetterChoices(choices);
  };

  const handleLetterChoice = (selectedLetter: string) => {
    const correctLetter = isUppercase ? currentLetter.toUpperCase() : currentLetter.toLowerCase();
    if (selectedLetter === correctLetter) {
      setLetterScore(prev => prev + 10);
      Vibration.vibrate(100);
      Alert.alert('Perfect! 🎯', 'You found the right letter!', [
        { text: 'Next Letter', onPress: initializeLetterGame },
      ]);
    } else {
      Vibration.vibrate([100, 50, 100]);
      Alert.alert('Try Again! 🔤', `The correct letter was "${correctLetter}".`, [
        { text: 'Next Letter', onPress: initializeLetterGame },
      ]);
    }
  };

  const toggleCase = () => {
    setIsUppercase(!isUppercase);
    if (currentLetter) {
      setCurrentLetter(isUppercase ? currentLetter.toLowerCase() : currentLetter.toUpperCase());
      setLetterChoices(letterChoices.map(letter =>
        isUppercase ? letter.toLowerCase() : letter.toUpperCase()
      ));
    }
  };

  if (currentScreen === 'hub') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Games</Text>
          <Text style={styles.headerSubtitle}>Choose a game to improve your skills</Text>
        </View>

        <View style={styles.gamesGrid}>
          <TouchableOpacity
            style={styles.gameCard}
            onPress={() => setCurrentScreen('wordMatch')}
          >
            <View style={styles.gameIconContainer}>
              <Ionicons name="book-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.gameTitle}>Word Matching</Text>
            <Text style={styles.gameDescription}>Match words and build vocabulary</Text>
            <View style={styles.gameStats}>
              <Text style={styles.gameStatsText}>Best Score: {wordScore}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gameCard}
            onPress={() => setCurrentScreen('memory')}
          >
            <View style={styles.gameIconContainer}>
              <Ionicons name="flash-outline" size={40} color="#FF9800" />
            </View>
            <Text style={styles.gameTitle}>Memory Challenge</Text>
            <Text style={styles.gameDescription}>Remember and repeat sequences</Text>
            <View style={styles.gameStats}>
              <Text style={styles.gameStatsText}>Level: {sequenceLevel}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gameCard}
            onPress={() => setCurrentScreen('letters')}
          >
            <View style={styles.gameIconContainer}>
              <Ionicons name="text-outline" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.gameTitle}>Letter Recognition</Text>
            <Text style={styles.gameDescription}>Identify confusing letters correctly</Text>
            <View style={styles.gameStats}>
              <Text style={styles.gameStatsText}>Score: {letterScore}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits of Playing</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="bulb-outline" size={20} color="#3DB2FF" />
            <Text style={styles.benefitText}>Improves memory and concentration</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="eye-outline" size={20} color="#3DB2FF" />
            <Text style={styles.benefitText}>Enhances visual processing</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="library-outline" size={20} color="#3DB2FF" />
            <Text style={styles.benefitText}>Builds vocabulary and reading skills</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (currentScreen === 'wordMatch') {
    return (
      <View style={styles.container}>
        <View style={styles.gameHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('hub')}
          >
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.gameHeaderTitle}>Word Matching</Text>
          <Text style={styles.gameHeaderScore}>Score: {wordScore}</Text>
        </View>

        <View style={styles.gameContent}>
          {currentWord && (
            <>
              <Text style={styles.instruction}>Find the word that matches:</Text>

              <View style={styles.targetWordContainer}>
                <Text style={styles.targetWord}>{currentWord.word}</Text>
                <Text style={styles.categoryLabel}>{currentWord.category}</Text>
              </View>

              <View style={styles.choicesContainer}>
                {wordChoices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.choiceButton,
                      selectedChoice === choice && choice === currentWord.word && styles.correctChoice,
                      selectedChoice === choice && choice !== currentWord.word && styles.wrongChoice,
                    ]}
                    onPress={() => handleWordChoice(choice)}
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
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    );
  }

  if (currentScreen === 'memory') {
    return (
      <View style={styles.container}>
        <View style={styles.gameHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('hub')}
          >
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.gameHeaderTitle}>Memory Challenge</Text>
          <Text style={styles.gameHeaderScore}>Level: {sequenceLevel}</Text>
        </View>

        <View style={styles.gameContent}>
          <Text style={styles.instruction}>
            {showingSequence ? `Watch the sequence... (${currentStep}/${sequence.length})` :
             sequence.length > 0 ? 'Repeat the sequence:' : 'Press Start to begin!'}
          </Text>

          <View style={styles.memoryContainer}>
            {[0, 1, 2, 3].map((buttonIndex) => (
              <TouchableOpacity
                key={buttonIndex}
                style={[
                  styles.memoryButton,
                  { backgroundColor: ['#FF5722', '#2196F3', '#4CAF50', '#FFC107'][buttonIndex] },
                  showingSequence && sequence[currentStep - 1] === buttonIndex && styles.activeMemoryButton,
                ]}
                onPress={() => handleMemoryButton(buttonIndex)}
                disabled={showingSequence}
              >
                <Text style={styles.memoryButtonText}>{buttonIndex + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={startMemoryGame}
          >
            <Text style={styles.startButtonText}>Start New Sequence</Text>
          </TouchableOpacity>

          {userSequence.length > 0 && (
            <View style={styles.progressIndicator}>
              <Text style={styles.progressText}>
                Progress: {userSequence.length}/{sequence.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  if (currentScreen === 'letters') {
    return (
      <View style={styles.container}>
        <View style={styles.gameHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('hub')}
          >
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.gameHeaderTitle}>Letter Recognition</Text>
          <Text style={styles.gameHeaderScore}>Score: {letterScore}</Text>
        </View>

        <View style={styles.gameContent}>
          <Text style={styles.instruction}>Find the letter that matches:</Text>

          <View style={styles.targetWordContainer}>
            <Text style={styles.targetLetter}>{currentLetter}</Text>
            <TouchableOpacity style={styles.caseToggle} onPress={toggleCase}>
              <Text style={styles.caseToggleText}>
                {isUppercase ? 'Switch to lowercase' : 'Switch to UPPERCASE'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.choicesContainer}>
            {letterChoices.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.letterChoice}
                onPress={() => handleLetterChoice(letter)}
              >
                <Text style={styles.letterChoiceText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              💡 Tip: Look carefully at the letter shape and direction!
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
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
  gamesGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gameCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  gameTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  gameStats: {
    alignItems: 'center',
  },
  gameStatsText: {
    fontSize: 12,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  benefitsCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 10,
    flex: 1,
  },
  gameHeader: {
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
  gameHeaderTitle: {
    fontSize: 20,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    flex: 1,
    textAlign: 'center',
  },
  gameHeaderScore: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  gameContent: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  choiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
  memoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  memoryButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  activeMemoryButton: {
    transform: [{ scale: 1.2 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  memoryButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  startButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  progressIndicator: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  patternContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  patternBlock: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  questionBlock: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  questionMark: {
    fontSize: 24,
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
  targetLetter: {
    fontSize: 120,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
  },
  caseToggle: {
    backgroundColor: '#3DB2FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  caseToggleText: {
    color: 'white',
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  letterChoice: {
    backgroundColor: '#FFFFFF',
    width: 80,
    height: 80,
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  letterChoiceText: {
    fontSize: 48,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
  },
  tipContainer: {
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
  },
});

export default MinigamesScreen;
