# Quick Start Guide

## Web Interface (Easiest)

1. **Start the server:**
   ```bash
   cd app-icon-generator
   npm run server
   ```

2. **Open your browser:**
   Navigate to http://localhost:3000

3. **Generate icons:**
   - Drag & drop your icon image (or click to browse)
   - Select platforms (iOS, Android, or both)
   - Click "Generate Icons"
   - Download the ZIP file with all icons

4. **Stop the server:**
   Press `Ctrl+C` in the terminal

## CLI (For Automation)

```bash
# Generate all icons
node src/cli.js path/to/icon.png

# Custom output directory
node src/cli.js path/to/icon.png -o ./my-icons

# Only iOS
node src/cli.js path/to/icon.png -p ios

# Only Android
node src/cli.js path/to/icon.png -p android
```

## Programmatic (For Integration)

```javascript
import { IconGenerator } from './app-icon-generator/src/index.js';

const generator = new IconGenerator('input.png', './output');
await generator.generate(['ios', 'android']);
```

## Output Structure

```
app-icons/
├── ios/
│   ├── Icon-20@2x.png
│   ├── Icon-20@3x.png
│   ├── Icon-60@3x.png
│   ├── Icon-1024@1x.png
│   └── Contents.json
└── android/
    ├── mipmap-mdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-hdpi/
    ├── mipmap-xhdpi/
    ├── mipmap-xxhdpi/
    └── mipmap-xxxhdpi/
```

## Tips

- Use a 1024x1024 PNG or larger for best quality
- Keep important content in the center 80% of the image
- The web interface automatically cleans up temporary files
- All processing is local - no data leaves your machine
