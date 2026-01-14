# App Icon Generator

A local, offline tool to generate iOS and Android app icons from a single source image. Perfect for integrating into mobile app development workflows or products.

## Features

- **Web Interface** - Beautiful drag-and-drop UI for easy icon generation
- **100% Local Processing** - All image processing happens on your machine, no external uploads
- **iOS Icon Generation** - Creates all required iPhone and iPad icon sizes with proper naming
- **Android Icon Generation** - Generates all density variants (ldpi to xxxhdpi) including round icons
- **Xcode Ready** - Includes Contents.json for seamless Xcode integration
- **Simple CLI** - Easy command-line interface
- **Programmatic API** - Can be imported and used as a library in your Node.js projects

## Installation

```bash
cd app-icon-generator
npm install
```

## Usage

### Web Interface (Recommended)

Start the web server:

```bash
npm run server
```

Then open your browser to: **http://localhost:3000**

Features:
- Drag and drop your icon image
- Live preview with dimensions
- Select iOS and/or Android platforms
- One-click download of all generated icons in a ZIP file

### Command Line

```bash
# Generate icons for both iOS and Android
node src/cli.js path/to/your/icon.png

# Specify output directory
node src/cli.js path/to/your/icon.png -o ./my-icons

# Generate only iOS icons
node src/cli.js path/to/your/icon.png -p ios

# Generate only Android icons
node src/cli.js path/to/your/icon.png -p android

# Show help
node src/cli.js --help
```

### Programmatic Usage

```javascript
import { IconGenerator } from './src/index.js';

const generator = new IconGenerator(
  '/path/to/source-icon.png',
  './output-directory'
);

// Generate icons for both platforms
await generator.generate(['ios', 'android']);

// Generate only iOS icons
await generator.generate(['ios']);
```

## Input Requirements

- **Format:** PNG, JPG, or any format supported by Sharp
- **Recommended Size:** 1024x1024 pixels or larger
- **Minimum Size:** 1024x1024 (you'll get a warning if smaller)
- **Aspect Ratio:** Square (1:1)

## Output Structure

```
app-icons/
├── Assets.xcassets/
│   └── AppIcon.appiconset/
│       ├── 16.png, 20.png, 29.png, 32.png, 40.png
│       ├── 48.png, 50.png, 55.png, 57.png, 58.png
│       ├── 60.png, 64.png, 66.png, 72.png, 76.png
│       ├── 80.png, 87.png, 88.png, 92.png, 100.png
│       ├── 102.png, 108.png, 114.png, 120.png, 128.png
│       ├── 144.png, 152.png, 167.png, 172.png, 180.png
│       ├── 196.png, 216.png, 234.png, 256.png, 258.png
│       ├── 512.png, 1024.png
│       └── Contents.json
├── android/
│   ├── mipmap-mdpi/test.png       (48x48)
│   ├── mipmap-hdpi/test.png       (72x72)
│   ├── mipmap-xhdpi/test.png      (96x96)
│   ├── mipmap-xxhdpi/test.png     (144x144)
│   └── mipmap-xxxhdpi/test.png    (192x192)
├── appstore.png                    (1024x1024)
└── playstore.png                   (512x512)
```

## iOS Icons Generated

**Total: 37 icons** covering iPhone, iPad, Apple Watch, macOS, and App Store

| Platform | Sizes Generated | Count |
|----------|-----------------|-------|
| **iPhone** | 20, 29, 40, 57, 58, 60, 80, 87, 114, 120, 180 | 11 icons |
| **iPad** | 20, 29, 40, 50, 72, 76, 100, 144, 152, 167 | 10 icons |
| **Apple Watch** | 48, 55, 66, 80, 88, 92, 100, 102, 108, 172, 196, 216, 234, 258 | 14 icons |
| **macOS** | 16, 32, 64, 128, 256, 512 | 6 icons |
| **App Store** | 1024 | 1 icon |

All icons are named by their pixel size (e.g., `20.png`, `180.png`, `1024.png`) and include a proper `Contents.json` for Xcode integration.

## Android Icons Generated

**Total: 5 icons** (one per density)

| Density | Size | Filename | Purpose |
|---------|------|----------|---------|
| mdpi | 48x48 | test.png | Medium density (baseline) |
| hdpi | 72x72 | test.png | High density |
| xhdpi | 96x96 | test.png | Extra high density |
| xxhdpi | 144x144 | test.png | Extra extra high density |
| xxxhdpi | 192x192 | test.png | Extra extra extra high density |

All Android icons are named `test.png` and organized in their respective `mipmap-*` folders.

## Store Icons

In addition to platform-specific icons, two store-ready icons are generated in the root:

- **appstore.png** - 1024x1024px for iOS App Store
- **playstore.png** - 512x512px for Google Play Store

## Integration into Your Product

This tool is designed to be easily integrated into larger products:

1. **As a Module:**
   ```javascript
   import { IconGenerator } from './app-icon-generator/src/index.js';
   ```

2. **Customization:**
   - Modify [src/config.js](src/config.js) to add custom sizes
   - Extend [src/generator.js](src/generator.js) for additional platforms or formats
   - Add custom image processing (rounded corners, padding, etc.)

3. **API Integration:**
   - The `IconGenerator` class is promise-based and easy to integrate
   - Returns structured data about generated icons
   - Handles errors gracefully with detailed messages

## Dependencies

- **sharp:** Fast image processing library
- **commander:** CLI framework

## License

MIT

## Tips

1. **Best Quality:** Start with a 1024x1024 PNG with transparency
2. **Safe Zone:** Keep important content in the center 80% of the image (Android may crop edges for round icons)
3. **Test:** Always preview generated icons on actual devices
4. **Automation:** Integrate into your build pipeline for automatic icon generation

## Future Enhancements

Potential features to add:
- Web app icon generation (PWA)
- macOS icon generation (.icns)
- Windows icon generation (.ico)
- Automatic padding/margins
- Background color options
- Batch processing multiple icons
- Preview generation
