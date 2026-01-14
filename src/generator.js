import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { IOS_SIZES, ANDROID_DENSITIES } from './config.js';

/**
 * Core icon generator class - matches appicon.co output
 */
export class IconGenerator {
  constructor(inputPath, outputDir) {
    this.inputPath = inputPath;
    this.outputDir = outputDir;
  }

  /**
   * Generate all icons for specified platforms
   */
  async generate(platforms = ['ios', 'android']) {
    console.log(`\nGenerating app icons from: ${this.inputPath}`);
    console.log(`Output directory: ${this.outputDir}\n`);

    // Validate input image
    await this.validateInput();

    const results = {
      ios: null,
      android: null
    };

    if (platforms.includes('ios')) {
      results.ios = await this.generateIOS();
    }

    if (platforms.includes('android')) {
      results.android = await this.generateAndroid();
    }

    return results;
  }

  /**
   * Validate input image exists and has sufficient resolution
   */
  async validateInput() {
    try {
      const metadata = await sharp(this.inputPath).metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Unable to read image dimensions');
      }

      const minSize = Math.min(metadata.width, metadata.height);
      if (minSize < 1024) {
        console.warn(`⚠️  Warning: Input image is ${minSize}x${minSize}. Recommended minimum is 1024x1024 for best quality.`);
      }

      console.log(`✓ Input image validated: ${metadata.width}x${metadata.height} ${metadata.format}`);
    } catch (error) {
      throw new Error(`Failed to validate input image: ${error.message}`);
    }
  }

  /**
   * Generate iOS icons in Assets.xcassets/AppIcon.appiconset/ structure
   */
  async generateIOS() {
    console.log('📱 Generating iOS icons...');

    // Create Xcode asset catalog structure
    const assetDir = path.join(this.outputDir, 'Assets.xcassets', 'AppIcon.appiconset');
    await fs.mkdir(assetDir, { recursive: true });

    const generatedIcons = [];
    const seenSizes = new Set();

    // Generate all icon sizes (de-duplicate by size)
    for (const config of IOS_SIZES) {
      if (seenSizes.has(config.size)) {
        continue; // Skip duplicate sizes
      }
      seenSizes.add(config.size);

      const outputPath = path.join(assetDir, config.filename);

      await sharp(this.inputPath)
        .resize(config.size, config.size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      generatedIcons.push({
        filename: config.filename,
        size: config.size
      });

      console.log(`  ✓ ${config.filename} (${config.size}x${config.size})`);
    }

    // Generate Contents.json matching appicon.co format
    await this.generateContentsJson(assetDir);

    // Generate appstore.png in root
    const appstorePath = path.join(this.outputDir, 'appstore.png');
    await sharp(this.inputPath)
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(appstorePath);

    console.log(`  ✓ appstore.png (1024x1024)`);

    console.log(`\n✓ Generated ${generatedIcons.length} iOS icons + appstore.png`);
    return generatedIcons;
  }

  /**
   * Generate Contents.json matching appicon.co format
   */
  async generateContentsJson(assetDir) {
    const folderPath = 'Assets.xcassets/AppIcon.appiconset/';

    // Helper function to create entry with expected-size key
    const entry = (data) => {
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        result[key === 'expectedSize' ? 'expected-size' : key] = value;
      }
      return result;
    };

    const contents = {
      images: [
        // iPhone icons
        entry({ size: '60x60', expectedSize: '180', filename: '180.png', folder: folderPath, idiom: 'iphone', scale: '3x' }),
        entry({ size: '40x40', expectedSize: '80', filename: '80.png', folder: folderPath, idiom: 'iphone', scale: '2x' }),
        entry({ size: '40x40', expectedSize: '120', filename: '120.png', folder: folderPath, idiom: 'iphone', scale: '3x' }),
        entry({ size: '60x60', expectedSize: '120', filename: '120.png', folder: folderPath, idiom: 'iphone', scale: '2x' }),
        entry({ size: '57x57', expectedSize: '57', filename: '57.png', folder: folderPath, idiom: 'iphone', scale: '1x' }),
        entry({ size: '29x29', expectedSize: '58', filename: '58.png', folder: folderPath, idiom: 'iphone', scale: '2x' }),
        entry({ size: '29x29', expectedSize: '29', filename: '29.png', folder: folderPath, idiom: 'iphone', scale: '1x' }),
        entry({ size: '29x29', expectedSize: '87', filename: '87.png', folder: folderPath, idiom: 'iphone', scale: '3x' }),
        entry({ size: '57x57', expectedSize: '114', filename: '114.png', folder: folderPath, idiom: 'iphone', scale: '2x' }),
        entry({ size: '20x20', expectedSize: '40', filename: '40.png', folder: folderPath, idiom: 'iphone', scale: '2x' }),
        entry({ size: '20x20', expectedSize: '60', filename: '60.png', folder: folderPath, idiom: 'iphone', scale: '3x' }),
        entry({ size: '1024x1024', filename: '1024.png', expectedSize: '1024', idiom: 'ios-marketing', folder: folderPath, scale: '1x' }),

        // iPad icons
        entry({ size: '40x40', expectedSize: '80', filename: '80.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '72x72', expectedSize: '72', filename: '72.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '76x76', expectedSize: '152', filename: '152.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '50x50', expectedSize: '100', filename: '100.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '29x29', expectedSize: '58', filename: '58.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '76x76', expectedSize: '76', filename: '76.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '29x29', expectedSize: '29', filename: '29.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '50x50', expectedSize: '50', filename: '50.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '72x72', expectedSize: '144', filename: '144.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '40x40', expectedSize: '40', filename: '40.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '83.5x83.5', expectedSize: '167', filename: '167.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),
        entry({ size: '20x20', expectedSize: '20', filename: '20.png', folder: folderPath, idiom: 'ipad', scale: '1x' }),
        entry({ size: '20x20', expectedSize: '40', filename: '40.png', folder: folderPath, idiom: 'ipad', scale: '2x' }),

        // Apple Watch icons
        entry({ idiom: 'watch', filename: '172.png', folder: folderPath, subtype: '38mm', scale: '2x', size: '86x86', expectedSize: '172', role: 'quickLook' }),
        entry({ idiom: 'watch', filename: '80.png', folder: folderPath, subtype: '38mm', scale: '2x', size: '40x40', expectedSize: '80', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '88.png', folder: folderPath, subtype: '40mm', scale: '2x', size: '44x44', expectedSize: '88', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '102.png', folder: folderPath, subtype: '45mm', scale: '2x', size: '51x51', expectedSize: '102', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '108.png', folder: folderPath, subtype: '49mm', scale: '2x', size: '54x54', expectedSize: '108', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '92.png', folder: folderPath, subtype: '41mm', scale: '2x', size: '46x46', expectedSize: '92', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '100.png', folder: folderPath, subtype: '44mm', scale: '2x', size: '50x50', expectedSize: '100', role: 'appLauncher' }),
        entry({ idiom: 'watch', filename: '196.png', folder: folderPath, subtype: '42mm', scale: '2x', size: '98x98', expectedSize: '196', role: 'quickLook' }),
        entry({ idiom: 'watch', filename: '216.png', folder: folderPath, subtype: '44mm', scale: '2x', size: '108x108', expectedSize: '216', role: 'quickLook' }),
        entry({ idiom: 'watch', filename: '234.png', folder: folderPath, subtype: '45mm', scale: '2x', size: '117x117', expectedSize: '234', role: 'quickLook' }),
        entry({ idiom: 'watch', filename: '258.png', folder: folderPath, subtype: '49mm', scale: '2x', size: '129x129', expectedSize: '258', role: 'quickLook' }),
        entry({ idiom: 'watch', filename: '48.png', folder: folderPath, subtype: '38mm', scale: '2x', size: '24x24', expectedSize: '48', role: 'notificationCenter' }),
        entry({ idiom: 'watch', filename: '55.png', folder: folderPath, subtype: '42mm', scale: '2x', size: '27.5x27.5', expectedSize: '55', role: 'notificationCenter' }),
        entry({ idiom: 'watch', filename: '66.png', folder: folderPath, subtype: '45mm', scale: '2x', size: '33x33', expectedSize: '66', role: 'notificationCenter' }),
        entry({ size: '29x29', expectedSize: '87', filename: '87.png', folder: folderPath, idiom: 'watch', role: 'companionSettings', scale: '3x' }),
        entry({ size: '29x29', expectedSize: '58', filename: '58.png', folder: folderPath, idiom: 'watch', role: 'companionSettings', scale: '2x' }),
        entry({ size: '1024x1024', expectedSize: '1024', filename: '1024.png', folder: folderPath, idiom: 'watch-marketing', scale: '1x' }),

        // macOS icons
        entry({ size: '128x128', expectedSize: '128', filename: '128.png', folder: folderPath, idiom: 'mac', scale: '1x' }),
        entry({ size: '256x256', expectedSize: '256', filename: '256.png', folder: folderPath, idiom: 'mac', scale: '1x' }),
        entry({ size: '128x128', expectedSize: '256', filename: '256.png', folder: folderPath, idiom: 'mac', scale: '2x' }),
        entry({ size: '256x256', expectedSize: '512', filename: '512.png', folder: folderPath, idiom: 'mac', scale: '2x' }),
        entry({ size: '32x32', expectedSize: '32', filename: '32.png', folder: folderPath, idiom: 'mac', scale: '1x' }),
        entry({ size: '512x512', expectedSize: '512', filename: '512.png', folder: folderPath, idiom: 'mac', scale: '1x' }),
        entry({ size: '16x16', expectedSize: '16', filename: '16.png', folder: folderPath, idiom: 'mac', scale: '1x' }),
        entry({ size: '16x16', expectedSize: '32', filename: '32.png', folder: folderPath, idiom: 'mac', scale: '2x' }),
        entry({ size: '32x32', expectedSize: '64', filename: '64.png', folder: folderPath, idiom: 'mac', scale: '2x' }),
        entry({ size: '512x512', expectedSize: '1024', filename: '1024.png', folder: folderPath, idiom: 'mac', scale: '2x' })
      ]
    };

    await fs.writeFile(
      path.join(assetDir, 'Contents.json'),
      JSON.stringify(contents, null, 2)
    );
  }

  /**
   * Generate Android icons - single test.png per density
   */
  async generateAndroid() {
    console.log('\n🤖 Generating Android icons...');

    const androidDir = path.join(this.outputDir, 'android');
    await fs.mkdir(androidDir, { recursive: true });

    const generatedIcons = [];

    for (const config of ANDROID_DENSITIES) {
      const densityDir = path.join(androidDir, config.folder);
      await fs.mkdir(densityDir, { recursive: true });

      const filename = 'test.png';
      const outputPath = path.join(densityDir, filename);

      await sharp(this.inputPath)
        .resize(config.size, config.size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      generatedIcons.push({
        density: config.density,
        filename: `${config.folder}/${filename}`,
        size: config.size
      });

      console.log(`  ✓ ${config.folder}/test.png (${config.size}x${config.size})`);
    }

    // Generate playstore.png in root
    const playstorePath = path.join(this.outputDir, 'playstore.png');
    await sharp(this.inputPath)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(playstorePath);

    console.log(`  ✓ playstore.png (512x512)`);

    console.log(`\n✓ Generated ${generatedIcons.length} Android icons + playstore.png`);
    return generatedIcons;
  }
}
