import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { IOS_SIZES, ANDROID_DENSITIES, ANDROID_BASE_SIZE } from './config.js';

/**
 * Core icon generator class
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
   * Generate iOS icons
   */
  async generateIOS() {
    console.log('📱 Generating iOS icons...');

    const iosDir = path.join(this.outputDir, 'ios');
    await fs.mkdir(iosDir, { recursive: true });

    const generatedIcons = [];
    const contentJson = {
      images: [],
      info: {
        author: 'app-icon-generator',
        version: 1
      }
    };

    for (const config of IOS_SIZES) {
      for (const scale of config.scales) {
        const finalSize = Math.round(config.size * scale);
        const filename = `${config.name}@${scale}x.png`;
        const outputPath = path.join(iosDir, filename);

        await sharp(this.inputPath)
          .resize(finalSize, finalSize, {
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toFile(outputPath);

        generatedIcons.push({
          filename,
          size: finalSize
        });

        // Add to Contents.json format
        contentJson.images.push({
          filename,
          idiom: config.idiom,
          scale: `${scale}x`,
          size: `${config.size}x${config.size}`
        });

        console.log(`  ✓ ${filename} (${finalSize}x${finalSize})`);
      }
    }

    // Write Contents.json for Xcode
    await fs.writeFile(
      path.join(iosDir, 'Contents.json'),
      JSON.stringify(contentJson, null, 2)
    );

    console.log(`\n✓ Generated ${generatedIcons.length} iOS icons`);
    return generatedIcons;
  }

  /**
   * Generate Android icons
   */
  async generateAndroid() {
    console.log('\n🤖 Generating Android icons...');

    const androidDir = path.join(this.outputDir, 'android');
    await fs.mkdir(androidDir, { recursive: true });

    const generatedIcons = [];

    for (const config of ANDROID_DENSITIES) {
      const densityDir = path.join(androidDir, config.folder);
      await fs.mkdir(densityDir, { recursive: true });

      const iconSize = Math.round(ANDROID_BASE_SIZE * config.scale);
      const filename = 'ic_launcher.png';
      const outputPath = path.join(densityDir, filename);

      await sharp(this.inputPath)
        .resize(iconSize, iconSize, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      generatedIcons.push({
        density: config.density,
        filename: `${config.folder}/${filename}`,
        size: iconSize
      });

      console.log(`  ✓ ${config.folder}/ic_launcher.png (${iconSize}x${iconSize})`);
    }

    // Also generate round icons for Android
    console.log('\n  Generating round icons...');
    for (const config of ANDROID_DENSITIES) {
      const densityDir = path.join(androidDir, config.folder);
      const iconSize = Math.round(ANDROID_BASE_SIZE * config.scale);
      const filename = 'ic_launcher_round.png';
      const outputPath = path.join(densityDir, filename);

      await sharp(this.inputPath)
        .resize(iconSize, iconSize, {
          fit: 'cover',
          position: 'center'
        })
        .composite([{
          input: Buffer.from(
            `<svg><circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize/2}" fill="white"/></svg>`
          ),
          blend: 'dest-in'
        }])
        .png()
        .toFile(outputPath);

      console.log(`  ✓ ${config.folder}/ic_launcher_round.png (${iconSize}x${iconSize})`);
    }

    console.log(`\n✓ Generated ${generatedIcons.length * 2} Android icons (regular + round)`);
    return generatedIcons;
  }
}
