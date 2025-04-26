import { useState, useEffect } from 'react';
import { Song } from '../types/Song';
import { getMockSongs } from '../utils/mockData';

const useSongRecognition = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [result, setResult] = useState<Song | null>(null);
  const [history, setHistory] = useState<Song[]>([]);
  
  useEffect(() => {
    // Load history from localStorage if available
    const savedHistory = localStorage.getItem('songHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save history to localStorage when it changes
    if (history.length > 0) {
      localStorage.setItem('songHistory', JSON.stringify(history));
    }
  }, [history]);

  const recognizeSong = async (audioBlob: Blob) => {
    setIsRecognizing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, we would send the audio data to an API
    // For this demo, we'll use mock data
    const mockSongs = getMockSongs();
    const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
    
    // Add timestamp for when the song was identified
    const identifiedSong = {
      ...randomSong,
      identifiedAt: new Date().toISOString()
    };
    
    setResult(identifiedSong);
    
    // Add to history (avoid duplicates based on time)
    setHistory(prev => {
      const updatedHistory = [identifiedSong, ...prev];
      // Limit history to last 10 items
      return updatedHistory.slice(0, 10);
    });
    
    setIsRecognizing(false);
    
    return identifiedSong;
  };

  const clearResult = () => {
    setResult(null);
  };

  const selectFromHistory = (song: Song) => {
    setResult(song);
  };

  return {
    isRecognizing,
    result,
    history,
    recognizeSong,
    clearResult,
    selectFromHistory
  };
};

export default useSongRecognition;