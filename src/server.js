import express from 'express';
import multer from 'multer';
import archiver from 'archiver';
import { IconGenerator } from './generator.js';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG files are allowed'));
    }
  }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Upload and generate icons endpoint
app.post('/api/generate', upload.single('icon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const platforms = req.body.platforms ? req.body.platforms.split(',') : ['ios', 'android'];
    const inputPath = req.file.path;
    const outputDir = path.join('outputs', `icons-${Date.now()}`);

    // Generate icons
    const generator = new IconGenerator(inputPath, outputDir);
    await generator.generate(platforms);

    // Create a zip file
    const zipPath = `${outputDir}.zip`;
    await createZipArchive(outputDir, zipPath);

    // Clean up
    await fs.unlink(inputPath);

    // Send download link
    res.json({
      success: true,
      downloadUrl: `/api/download/${path.basename(zipPath)}`,
      message: 'Icons generated successfully'
    });

  } catch (error) {
    console.error('Error generating icons:', error);

    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
    }

    res.status(500).json({
      error: 'Failed to generate icons',
      message: error.message
    });
  }
});

// Download generated icons
app.get('/api/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('outputs', filename);

    // Security check: ensure the file exists and is within outputs directory
    const realPath = await fs.realpath(filePath);
    const outputsPath = await fs.realpath('outputs');

    if (!realPath.startsWith(outputsPath)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Send file
    res.download(filePath, 'app-icons.zip', async (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }

      // Clean up after download
      try {
        await fs.unlink(filePath);
        // Also remove the unzipped directory
        const dirPath = filePath.replace('.zip', '');
        await fs.rm(dirPath, { recursive: true, force: true });
      } catch (e) {
        console.error('Error cleaning up files:', e);
      }
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Helper function to create zip archive
function createZipArchive(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

// Create necessary directories
async function init() {
  await fs.mkdir('uploads', { recursive: true });
  await fs.mkdir('outputs', { recursive: true });
  await fs.mkdir(path.join(__dirname, '../public'), { recursive: true });
}

// Start server
init().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 App Icon Generator Server`);
    console.log(`📍 Running at: http://localhost:${PORT}`);
    console.log(`\n✨ Open your browser and start generating icons!\n`);
  });
}).catch(err => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
