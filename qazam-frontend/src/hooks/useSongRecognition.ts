import { useState, useEffect, useRef } from 'react';
import { Song } from '../types/Song';
import { getMockSongs } from '../utils/mockData'; // Keep for fallback
import io, { Socket } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000'; 

const useSongRecognition = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [result, setResult] = useState<Song | null>(null);
  const [history, setHistory] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [useRealApi, setUseRealApi] = useState(true); // Toggle between real API and mock

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

    // Initialize socket connection
    if (useRealApi) {
      try {
        socketRef.current = io(BACKEND_URL);
        
        socketRef.current.on('connect', () => {
          console.log('Connected to server');
        });
        
        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from server');
        });
        
        socketRef.current.on('connect_error', (err) => {
          console.error('Connection error:', err);
          setError('Failed to connect to the server. Falling back to mock data.');
          setUseRealApi(false);
        });
        
        // Listen for Shazam API results
        socketRef.current.on('shazam-result', (data) => {
          setIsRecognizing(false);
          
          if (data && data.matches && data.matches.length > 0) {
            const match = data.matches[0]; // Best match
            const track = match.track;
            
            const identifiedSong: Song = {
              id: track.key || String(Date.now()),
              title: track.title || 'Unknown Title',
              artist: track.subtitle || 'Unknown Artist',
              album: track.sections?.[0]?.metadata?.find((m: any) => m.title === 'Album')?.text || '',
              year: track.sections?.[0]?.metadata?.find((m: any) => m.title === 'Released')?.text || '',
              albumArt: track.images?.coverart || track.share?.image || '',
              identifiedAt: new Date().toISOString()
            };
            
            setResult(identifiedSong);
            
            // Add to history
            addToHistory(identifiedSong);
          } else {
            setError('No matches found. Try again with clearer audio.');
          }
        });
        
        socketRef.current.on('shazam-error', (err) => {
          console.error('Shazam API error:', err);
          setIsRecognizing(false);
          setError(err.error || 'Failed to identify song');
        });
      } catch (err) {
        console.error('Socket initialization error:', err);
        setUseRealApi(false);
        setError('Failed to initialize connection. Using mock data instead.');
      }
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [useRealApi]);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('songHistory', JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = (song: Song) => {
    setHistory(prev => {
      // Check if song already exists to avoid duplicates
      const exists = prev.some(s => s.id === song.id);
      
      if (!exists) {
        const updatedHistory = [song, ...prev];
        // Limit history to last 10 items
        return updatedHistory.slice(0, 10);
      }
      
      return prev;
    });
  };

  const recognizeSong = async (audioBlob: Blob) => {
    setIsRecognizing(true);
    setError(null);
    
    if (useRealApi && socketRef.current?.connected) {
      try {
        // Convert blob to ArrayBuffer for transmitting over socket
        const arrayBuffer = await audioBlob.arrayBuffer();
        socketRef.current.emit('song', arrayBuffer);
      } catch (err) {
        console.error('Error sending audio data:', err);
        setIsRecognizing(false);
        setError('Failed to send audio data to server');
      }
    } else {
      // Fallback to mock data
      console.log('Using mock data (real API disabled or not connected)');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSongs = getMockSongs();
      const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
      
      const identifiedSong = {
        ...randomSong,
        identifiedAt: new Date().toISOString()
      };
      
      setResult(identifiedSong);
      addToHistory(identifiedSong);
      setIsRecognizing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  const selectFromHistory = (song: Song) => {
    setResult(song);
  };

  return {
    isRecognizing,
    result,
    history,
    error,
    recognizeSong,
    clearResult,
    selectFromHistory
  };
};

export default useSongRecognition;