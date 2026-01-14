/**
 * iOS and Android icon size configurations
 */

export const IOS_SIZES = [
  // iPhone
  { size: 20, scales: [2, 3], idiom: 'iphone', name: 'Icon-20' },
  { size: 29, scales: [2, 3], idiom: 'iphone', name: 'Icon-29' },
  { size: 40, scales: [2, 3], idiom: 'iphone', name: 'Icon-40' },
  { size: 60, scales: [2, 3], idiom: 'iphone', name: 'Icon-60' },

  // iPad
  { size: 20, scales: [1, 2], idiom: 'ipad', name: 'Icon-20' },
  { size: 29, scales: [1, 2], idiom: 'ipad', name: 'Icon-29' },
  { size: 40, scales: [1, 2], idiom: 'ipad', name: 'Icon-40' },
  { size: 76, scales: [1, 2], idiom: 'ipad', name: 'Icon-76' },
  { size: 83.5, scales: [2], idiom: 'ipad', name: 'Icon-83.5' },

  // App Store
  { size: 1024, scales: [1], idiom: 'ios-marketing', name: 'Icon-1024' }
];

export const ANDROID_DENSITIES = [
  { density: 'ldpi', scale: 0.75, folder: 'mipmap-ldpi' },
  { density: 'mdpi', scale: 1, folder: 'mipmap-mdpi' },
  { density: 'hdpi', scale: 1.5, folder: 'mipmap-hdpi' },
  { density: 'xhdpi', scale: 2, folder: 'mipmap-xhdpi' },
  { density: 'xxhdpi', scale: 3, folder: 'mipmap-xxhdpi' },
  { density: 'xxxhdpi', scale: 4, folder: 'mipmap-xxxhdpi' }
];

// Base size for Android icons (mdpi baseline)
export const ANDROID_BASE_SIZE = 48;
