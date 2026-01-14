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
├── ios/
│   ├── Icon-20@2x.png       (40x40)
│   ├── Icon-20@3x.png       (60x60)
│   ├── Icon-29@2x.png       (58x58)
│   ├── Icon-29@3x.png       (87x87)
│   ├── Icon-40@2x.png       (80x80)
│   ├── Icon-40@3x.png       (120x120)
│   ├── Icon-60@2x.png       (120x120)
│   ├── Icon-60@3x.png       (180x180)
│   ├── Icon-76@1x.png       (76x76)
│   ├── Icon-76@2x.png       (152x152)
│   ├── Icon-83.5@2x.png     (167x167)
│   ├── Icon-1024@1x.png     (1024x1024)
│   └── Contents.json
└── android/
    ├── mipmap-ldpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-mdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-hdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-xhdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-xxhdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    └── mipmap-xxxhdpi/
        ├── ic_launcher.png
        └── ic_launcher_round.png
```

## iOS Icons Generated

| Size | Scales | Purpose |
|------|--------|---------|
| 20x20 | 2x, 3x | iPhone Notification |
| 29x29 | 2x, 3x | iPhone Settings |
| 40x40 | 2x, 3x | iPhone Spotlight |
| 60x60 | 2x, 3x | iPhone App |
| 20x20 | 1x, 2x | iPad Notification |
| 29x29 | 1x, 2x | iPad Settings |
| 40x40 | 1x, 2x | iPad Spotlight |
| 76x76 | 1x, 2x | iPad App |
| 83.5x83.5 | 2x | iPad Pro App |
| 1024x1024 | 1x | App Store |

## Android Icons Generated

| Density | Scale | Size | Purpose |
|---------|-------|------|---------|
| ldpi | 0.75x | 36x36 | Low density |
| mdpi | 1x | 48x48 | Medium density (baseline) |
| hdpi | 1.5x | 72x72 | High density |
| xhdpi | 2x | 96x96 | Extra high density |
| xxhdpi | 3x | 144x144 | Extra extra high density |
| xxxhdpi | 4x | 192x192 | Extra extra extra high density |

Both standard and round variants are generated for each density.

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
