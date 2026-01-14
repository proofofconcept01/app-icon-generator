#!/usr/bin/env node

import { Command } from 'commander';
import { IconGenerator } from './generator.js';
import path from 'path';
import fs from 'fs';

const program = new Command();

program
  .name('app-icon-generator')
  .description('Generate iOS and Android app icons from a single source image')
  .version('1.0.0')
  .argument('<input>', 'Path to source image (recommended: 1024x1024 or larger)')
  .option('-o, --output <dir>', 'Output directory', './app-icons')
  .option('-p, --platform <platforms...>', 'Platforms to generate icons for (ios, android)', ['ios', 'android'])
  .action(async (input, options) => {
    try {
      // Validate input file exists
      if (!fs.existsSync(input)) {
        console.error(`❌ Error: Input file not found: ${input}`);
        process.exit(1);
      }

      // Resolve paths
      const inputPath = path.resolve(input);
      const outputDir = path.resolve(options.output);

      // Validate platforms
      const validPlatforms = ['ios', 'android'];
      const platforms = options.platform.filter(p => validPlatforms.includes(p.toLowerCase()));

      if (platforms.length === 0) {
        console.error('❌ Error: No valid platforms specified. Use "ios" and/or "android"');
        process.exit(1);
      }

      // Generate icons
      const generator = new IconGenerator(inputPath, outputDir);
      await generator.generate(platforms.map(p => p.toLowerCase()));

      console.log('\n✅ All icons generated successfully!');
      console.log(`📁 Output location: ${outputDir}\n`);

    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
