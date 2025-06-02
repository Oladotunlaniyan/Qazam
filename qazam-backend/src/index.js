require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 7070;

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// In-memory history storage 
let songHistory = [];

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Qazam Socket.io Backend API is running!');
});

// Route to get recognition history
app.get('/api/history', (req, res) => {
  res.json({ success: true, data: songHistory });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send history to newly connected client
  socket.emit('history', songHistory);
  
  // Listen for song recognition requests
  socket.on('song', async (audioData) => {
    try {
      console.log('Received audio data for recognition');
      
      // Save the audio data to a temporary file
      const fileName = `recording-${Date.now()}.webm`;
      const filePath = path.join(tempDir, fileName);
      
      // Convert ArrayBuffer to Buffer and write to file
      fs.writeFileSync(filePath, Buffer.from(audioData));
      
      // Create form data for Shazam API
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      // Make request to Shazam API
      try {
        const response = await axios({
          method: 'POST',
          url: 'https://shazam.p.rapidapi.com/songs/detect',
          headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST,
            ...form.getHeaders()
          },
          data: form,
          maxBodyLength: Infinity
        });
        
        // Clean up temp file
        cleanupTempFile(filePath);
        
        // Check if we have a match
        const resultData = response.data;
        
        if (resultData && (resultData.matches?.length > 0 || resultData.track)) {
          // Send result back to client
          socket.emit('shazam-result', resultData);
          
          // Format and store in history
          const track = resultData.track || {};
          
          if (track) {
            const formattedSong = {
              id: resultData.matches?.[0]?.id || `temp-${Date.now()}`,
              title: track.title || 'Unknown Title',
              artist: track.subtitle || 'Unknown Artist',
              albumArt: track.images?.coverart || track.share?.image || '',
              album: track.sections?.[0]?.metadata?.find(m => m.title === 'Album')?.text || '',
              year: track.sections?.[0]?.metadata?.find(m => m.title === 'Released')?.text || '',
              identifiedAt: new Date().toISOString()
            };
            
            // Add to history
            songHistory.unshift(formattedSong);
            
            // Keep history limited to 10 items
            if (songHistory.length > 10) {
              songHistory = songHistory.slice(0, 10);
            }
            
            // Broadcast updated history to all clients
            io.emit('history-updated', songHistory);
          }
        } else {
          socket.emit('shazam-error', { 
            error: 'No matches found' 
          });
        }
      } catch (error) {
        console.error('Shazam API error:', error.message);
        
        // Clean up temp file
        cleanupTempFile(filePath);
        
        socket.emit('shazam-error', {
          error: 'Error recognizing song',
          details: error.message
        });
      }
    } catch (error) {
      console.error('Server error:', error);
      socket.emit('shazam-error', {
        error: 'Server error processing audio',
        details: error.message
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to clean up temporary files
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
};

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});