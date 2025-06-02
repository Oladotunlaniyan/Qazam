// src/controllers/shazamController.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');


let songHistory = [];

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

// Helper function to format song data
const formatSongData = (data) => {
  // Handle case where no matches are found
  if (!data.matches || data.matches.length === 0) {
    return null;
  }

  const track = data.track || {};
  const { title, subtitle: artist, images = {}, sections = [], share = {} } = track;

  // Extract album art
  const albumArt = images.coverart || 
                  (images.background) || 
                  'https://via.placeholder.com/300?text=No+Image';

  // Extract genres
  let genres = [];
  const genreSection = sections.find(section => section.type === 'GENRE');
  if (genreSection && genreSection.metadata) {
    genres = genreSection.metadata.map(item => item.text);
  }

  // Extract lyrics preview if available
  let lyricsSnippet = '';
  const lyricsSection = sections.find(section => section.type === 'LYRICS');
  if (lyricsSection && lyricsSection.text && lyricsSection.text.length > 0) {
    lyricsSnippet = lyricsSection.text.slice(0, 4).join('\n');
  }

  // Format the result
  return {
    id: data.matches[0]?.id || `temp-${Date.now()}`,
    title: title || 'Unknown Title',
    artist: artist || 'Unknown Artist',
    albumArt,
    genres: genres.length ? genres : ['Unknown'],
    releaseDate: track.releasedate || 'Unknown',
    lyricsSnippet,
    spotifyUrl: share?.href || null,
    appleUrl: share?.apple || null,
    shazamTime: new Date().toISOString(),
  };
};

// Controller to recognize a song from an audio file
exports.recognizeSong = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded',
      });
    }

    const audioFilePath = req.file.path;
    
    // Create a form data object to send to Shazam API
    const form = new FormData();
    form.append('file', fs.createReadStream(audioFilePath));
    
    // Make request to Shazam API
    const options = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST,
        ...form.getHeaders()
      }
    };
    
    try {
      const response = await fetch(
        'https://shazam.p.rapidapi.com/songs/detect',
        {
          ...options,
          body: form
        }
      );
      
      const data = await response.json();
      
      // Clean up the temporary audio file
      cleanupTempFile(audioFilePath);
      
      // Check if the song was recognized
      if (!data || !data.track) {
        return res.status(404).json({
          success: false,
          message: 'No song matches found',
        });
      }
      
      // Format the response data
      const formattedData = formatSongData(data);
      
      if (!formattedData) {
        return res.status(404).json({
          success: false,
          message: 'Could not extract song information',
        });
      }
      
      // Add to history
      songHistory.unshift(formattedData);
      
      // Keep history limited to 10 items
      if (songHistory.length > 10) {
        songHistory = songHistory.slice(0, 10);
      }
      
      return res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error('Shazam API error:', error);
      
      // Clean up the temporary audio file
      cleanupTempFile(audioFilePath);
      
      return res.status(500).json({
        success: false,
        message: 'Error recognizing song',
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller to get recent history
exports.getRecentHistory = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: songHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message,
    });
  }
};

// Controller to clear history
exports.clearHistory = (req, res) => {
  try {
    songHistory = [];
    res.status(200).json({
      success: true,
      message: 'History cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing history',
      error: error.message,
    });
  }
};