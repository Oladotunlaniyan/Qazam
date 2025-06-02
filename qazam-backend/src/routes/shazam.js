const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { recognizeSong, getRecentHistory, clearHistory } = require('../controllers/shazamController');

// Configure multer for handling audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../../temp');
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `recording-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filter to only accept audio files  
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

// Route to recognize a song from uploaded audio
router.post('/recognize', upload.single('audio'), recognizeSong);

// Route to get recognition history
router.get('/history', getRecentHistory);

// Route to clear history
router.delete('/history', clearHistory);

module.exports = router;