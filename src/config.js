/**
 * iOS and Android icon size configurations
 * Matches appicon.co output structure
 */

export const IOS_SIZES = [
  // iPhone (current + legacy) - sorted by size
  { size: 180, filename: '180.png' }, // iPhone @3x 60pt
  { size: 120, filename: '120.png' }, // iPhone @2x 60pt & @3x 40pt
  { size: 114, filename: '114.png' }, // iPhone @2x 57pt (legacy)
  { size: 87, filename: '87.png' },   // iPhone @3x 29pt
  { size: 80, filename: '80.png' },   // iPhone @2x 40pt & Watch 38mm launcher
  { size: 60, filename: '60.png' },   // iPhone @3x 20pt
  { size: 58, filename: '58.png' },   // iPhone @2x 29pt
  { size: 57, filename: '57.png' },   // iPhone @1x 57pt (legacy)
  { size: 40, filename: '40.png' },   // iPhone @2x 20pt & iPad @1x 40pt
  { size: 29, filename: '29.png' },   // iPhone @1x 29pt

  // iPad
  { size: 167, filename: '167.png' }, // iPad Pro @2x 83.5pt
  { size: 152, filename: '152.png' }, // iPad @2x 76pt
  { size: 144, filename: '144.png' }, // iPad @2x 72pt (legacy)
  { size: 100, filename: '100.png' }, // iPad @2x 50pt (legacy) & Watch 44mm launcher
  { size: 76, filename: '76.png' },   // iPad @1x 76pt
  { size: 72, filename: '72.png' },   // iPad @1x 72pt (legacy)
  { size: 50, filename: '50.png' },   // iPad @1x 50pt (legacy)
  { size: 20, filename: '20.png' },   // iPad @1x 20pt

  // Apple Watch
  { size: 258, filename: '258.png' }, // Watch 49mm Quick Look
  { size: 234, filename: '234.png' }, // Watch 45mm Quick Look
  { size: 216, filename: '216.png' }, // Watch 44mm Quick Look
  { size: 196, filename: '196.png' }, // Watch 42mm Quick Look
  { size: 172, filename: '172.png' }, // Watch 38mm Quick Look
  { size: 108, filename: '108.png' }, // Watch 49mm launcher
  { size: 102, filename: '102.png' }, // Watch 45mm launcher
  { size: 92, filename: '92.png' },   // Watch 41mm launcher
  { size: 88, filename: '88.png' },   // Watch 40mm launcher
  { size: 66, filename: '66.png' },   // Watch 45mm notification
  { size: 55, filename: '55.png' },   // Watch 42mm notification
  { size: 48, filename: '48.png' },   // Watch 38mm notification

  // macOS
  { size: 512, filename: '512.png' },
  { size: 256, filename: '256.png' },
  { size: 128, filename: '128.png' },
  { size: 64, filename: '64.png' },
  { size: 32, filename: '32.png' },
  { size: 16, filename: '16.png' },

  // Marketing
  { size: 1024, filename: '1024.png' }
];

export const ANDROID_DENSITIES = [
  { density: 'mdpi', size: 48, folder: 'mipmap-mdpi' },
  { density: 'hdpi', size: 72, folder: 'mipmap-hdpi' },
  { density: 'xhdpi', size: 96, folder: 'mipmap-xhdpi' },
  { density: 'xxhdpi', size: 144, folder: 'mipmap-xxhdpi' },
  { density: 'xxxhdpi', size: 192, folder: 'mipmap-xxxhdpi' }
];
