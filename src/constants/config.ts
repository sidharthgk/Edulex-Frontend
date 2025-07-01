// API Configuration
export const API_CONFIG = {
  EDULEX: {
    BASE_URL: 'https://api.edulex.space',
    OCR_ENDPOINT: '/api/ocr',
    TEACHING_PLAN_ENDPOINT: '/api/agent/plan',
    QUIZ_ENDPOINT: '/api/agent/quiz',
    SUMMARIZATION_ENDPOINT: '/api/agent/summarization',
  },
  AVATAR_TALK: {
    BASE_URL: 'https://avatartalk.ai/api/inference',
    API_KEY: 'ZyHObNUl68AjESc982WH4QO9bir66NUQqYFSDVlcOoI',
  },
};

// Avatar options for AvatarTalk API
export const AVATAR_OPTIONS = [
  { id: 'japanese_man', name: 'Japanese Man', emoji: '👨‍🏫' },
  { id: 'old_european_woman', name: 'Elderly Woman', emoji: '👵' },
  { id: 'european_woman', name: 'European Woman', emoji: '👩‍🏫' },
  { id: 'black_man', name: 'Black Man', emoji: '👨‍🎓' },
  { id: 'japanese_woman', name: 'Japanese Woman', emoji: '👩‍🎓' },
  { id: 'iranian_man', name: 'Iranian Man', emoji: '👨‍💼' },
  { id: 'mexican_man', name: 'Mexican Man', emoji: '👨‍🔬' },
  { id: 'mexican_woman', name: 'Mexican Woman', emoji: '👩‍🔬' },
];

// Emotion options for avatars
export const EMOTION_OPTIONS = [
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'neutral', name: 'Neutral', emoji: '😐' },
  { id: 'serious', name: 'Serious', emoji: '😐' },
  { id: 'surprise', name: 'Surprised', emoji: '😲' },
  { id: 'fear', name: 'Fearful', emoji: '😰' },
  { id: 'disgust', name: 'Disgusted', emoji: '🤢' },
];

// Language options for speech synthesis
export const LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English', emoji: '🇺🇸' },
  { id: 'es', name: 'Spanish', emoji: '🇪🇸' },
  { id: 'fr', name: 'French', emoji: '🇫🇷' },
  { id: 'de', name: 'German', emoji: '🇩🇪' },
  { id: 'it', name: 'Italian', emoji: '🇮🇹' },
  { id: 'pt', name: 'Portuguese', emoji: '🇵🇹' },
  { id: 'pl', name: 'Polish', emoji: '🇵🇱' },
  { id: 'tr', name: 'Turkish', emoji: '🇹🇷' },
  { id: 'ru', name: 'Russian', emoji: '🇷🇺' },
  { id: 'nl', name: 'Dutch', emoji: '🇳🇱' },
  { id: 'cs', name: 'Czech', emoji: '🇨🇿' },
  { id: 'ar', name: 'Arabic', emoji: '🇸🇦' },
  { id: 'cn', name: 'Chinese', emoji: '🇨🇳' },
  { id: 'ja', name: 'Japanese', emoji: '🇯🇵' },
  { id: 'hu', name: 'Hungarian', emoji: '🇭🇺' },
  { id: 'ko', name: 'Korean', emoji: '🇰🇷' },
  { id: 'hi', name: 'Hindi', emoji: '🇮🇳' },
];
