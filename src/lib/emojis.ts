/**
 * Centralized Unicode Standard Emojis Palette & Section Tokens
 * 
 * Sources:
 * - Unicode Consortium: https://unicode.org/emoji/charts/full-emoji-list.html
 * - Emojipedia: https://emojipedia.org/
 * - Google Noto Color Emoji: https://fonts.google.com/noto/specimen/Noto+Color+Emoji
 */

export const SECTION_EMOJIS = {
  hero: '👋',
  about: '👨‍💻',
  skills: '🛠️',
  experience: '💼',
  education: '🎓',
  projects: '🚀',
  languages: '🌐',
  hobbies: '🎸',
  interests: '💡',
  contact: '📬',
  footer: '✨',
} as const;

export const HOBBY_EMOJI_PALETTE = [
  '📸', '🎮', '🏃', '🚴', '🏊', '🧗', '🍳', '☕', '🎸', '🎹', '🎧', '🎵',
  '📚', '✍️', '✈️', '🥾', '🏕️', '🌱', '♟️', '🎨', '🎬', '🎙️', '🧁', '🧘',
  '🏄', '⚽', '🏀', '🎾', '🏸', '🏓', '💪', '🧩'
];

export const INTEREST_EMOJI_PALETTE = [
  '🤖', '🧠', '🚀', '⛓️', '☁️', '📊', '🕹️', '🌌', '🦾', '⚛️', '📡', '💡',
  '💰', '🏢', '📈', '💭', '🔄', '🔐', '🌱', '🏥', '🥽', '📣', '📖', '🏗️',
  '⚙️', '🎯', '✨', '⚡'
];

export const TECH_EMOJI_PALETTE = [
  '⚛️', '▲', '🎨', '🔷', '🟨', '🧡', '💚', '🟢', '🐍', '🦀', '☕', '🐹',
  '🐘', '🍃', '⚡', '🗄️', '🐳', '☸️', '☁️', '🚀', '🤖', '🧠', '🔥', '🟧',
  '🔒', '🛠️', '💻', '🌐', '📱'
];

export const SOCIAL_EMOJI_PALETTE = [
  '🐙', '💼', '📸', '🐦', '💬', '✉️', '🎥', '✈️', '✍️', '🎧', '🌐', '📱'
];

export const COMMON_EMOJI_PALETTE = [
  '⚡', '✨', '🚀', '🔥', '💡', '🌟', '🎯', '🛠️', '💻', '🌐', '📈', '🔒'
];
