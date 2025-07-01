import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserStats {
  lessonsCompleted: number;
  achievements: number;
  daysStreak: number;
  totalPoints: number;
  gamesPlayed: number;
  ocrScans: number;
}

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [dyslexicFontEnabled, setDyslexicFontEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Sample user data - would come from backend/storage
  const userStats: UserStats = {
    lessonsCompleted: 24,
    achievements: 8,
    daysStreak: 5,
    totalPoints: 1890,
    gamesPlayed: 47,
    ocrScans: 12,
  };

  const handleTakeAssessment = () => {
    navigation.navigate('DyslexiaTestStart');
  };

  const handleAssessmentHistory = () => {
    Alert.alert('📊 Assessment History', 'View your past assessment results and track your progress over time.\n\n• Initial Assessment: 65% accuracy\n• Follow-up (1 month): 78% accuracy\n• Latest: 85% accuracy\n\n📈 Great improvement!');
  };

  const handleSettings = () => {
    Alert.alert('⚙️ Settings Saved!', 'Your preferences have been updated and will be applied throughout the app.');
  };

  const handleHelp = () => {
    Alert.alert('🆘 Help & Support', 'Get help with:\n\n• Using OCR camera features\n• Understanding assessment results\n• Playing learning games\n• Connecting with community\n\nContact: support@edulex.ai');
  };

  const handleAbout = () => {
    Alert.alert('ℹ️ About Edulex AI', 'Version 1.0.0\n\nEducational AI assistant for dyslexic learners aged 8-18.\n\nDeveloped with ❤️ to make learning accessible and fun.\n\n© 2024 Edulex AI Team');
  };

  const handleExportData = () => {
    Alert.alert('📤 Export Data', 'Your learning data has been exported to your device. This includes:\n\n• Progress statistics\n• Game scores\n• Achievement history\n• Assessment results\n\nData exported successfully!');
  };

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Clear All Data',
      'This will permanently delete all your local data including progress, scores, and preferences. This action cannot be undone.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Data', style: 'destructive', onPress: () => {
          Alert.alert('✅ Data Cleared', 'All local data has been removed.');
        }},
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '👋 Log Out',
      'Are you sure you want to log out? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => {
          Alert.alert('✅ Logged Out', 'You have been successfully logged out. See you soon!');
        }},
      ]
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 100 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={50} color="#3DB2FF" />
        </View>
        <Text style={styles.userName}>Alex Johnson</Text>
        <Text style={styles.userEmail}>alex.johnson@example.com</Text>
        <Text style={styles.userLevel}>Learning Level: Intermediate</Text>
      </View>

      {/* Enhanced Stats Grid */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={20} color="#4CAF50" />
            <Text style={styles.statNumber}>{userStats.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.statNumber}>{userStats.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color="#FF6B6B" />
            <Text style={styles.statNumber}>{userStats.daysStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#9C27B0" />
            <Text style={styles.statNumber}>{userStats.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="game-controller" size={20} color="#2196F3" />
            <Text style={styles.statNumber}>{userStats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="camera" size={20} color="#FF9800" />
            <Text style={styles.statNumber}>{userStats.ocrScans}</Text>
            <Text style={styles.statLabel}>OCR Scans</Text>
          </View>
        </View>
      </View>

      {/* Assessment Section */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Assessment & Learning</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleTakeAssessment}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="analytics-outline" size={24} color="#3DB2FF" />
            <Text style={styles.menuItemText}>Take New Assessment</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleAssessmentHistory}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={24} color="#4CAF50" />
            <Text style={styles.menuItemText}>Assessment History</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>+20%</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Accessibility Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="text-outline" size={24} color="#9C27B0" />
            <Text style={styles.menuItemText}>Dyslexic-Friendly Font</Text>
          </View>
          <Switch
            value={dyslexicFontEnabled}
            onValueChange={setDyslexicFontEnabled}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="contrast-outline" size={24} color="#FF6B6B" />
            <Text style={styles.menuItemText}>High Contrast Mode</Text>
          </View>
          <Switch
            value={highContrastMode}
            onValueChange={setHighContrastMode}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="volume-high-outline" size={24} color="#4CAF50" />
            <Text style={styles.menuItemText}>Sound Effects</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="phone-portrait-outline" size={24} color="#FF9800" />
            <Text style={styles.menuItemText}>Vibration Feedback</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color="#3DB2FF" />
            <Text style={styles.menuItemText}>Daily Reminders</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="moon-outline" size={24} color="#5D4037" />
            <Text style={styles.menuItemText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={24} color="#666666" />
            <Text style={styles.menuItemText}>Advanced Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* Data Management */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="download-outline" size={24} color="#4CAF50" />
            <Text style={styles.menuItemText}>Export My Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleClearData}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>Clear All Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Support & Info</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#3DB2FF" />
            <Text style={styles.menuItemText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#3DB2FF" />
            <Text style={styles.menuItemText}>About Edulex AI</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
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
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3DB2FF',
  },
  userName: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 5,
  },
  userLevel: {
    fontSize: 14,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statsContainer: {
    marginHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
    paddingLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 15,
  },
  progressBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  progressBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
  },
  logoutItem: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  logoutText: {
    color: '#FF6B6B',
  },
});

export default ProfileScreen;
