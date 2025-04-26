import React, { useState, useEffect } from 'react';
import AudioRecorder from './components/AudioRecorder';
import WaveAnimation from './components/WaveAnimation';
import ListeningAnimation from './components/ListeningAnimation';
import SongResult from './components/SongResult';
import HistoryList from './components/HistoryList';
import Header from './components/Header';
import useSongRecognition from './hooks/useSongRecognition';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showHistory, setShowHistory] = useState(false);
  
  const { 
    isRecognizing, 
    result, 
    history, 
    recognizeSong, 
    clearResult, 
    selectFromHistory 
  } = useSongRecognition();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    recognizeSong(audioBlob);
  };

  const handleTapToListen = () => {
    setIsListening(true);
    setShowHistory(false);
    clearResult();
  };

  const handleNewRecording = () => {
    clearResult();
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-start">
        <div className="w-full max-w-md flex flex-col items-center">
          {!isListening && !result && !isRecognizing && (
            <div className="text-center mb-8 mt-8">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Qazam
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tap the button to identify what's playing
              </p>
            </div>
          )}
          
          {(isListening || isRecognizing) && (
            <div className="text-center mb-4 mt-8 animate-fade-in">
              <h2 className="text-xl font-semibold">
                {isRecognizing ? 'Identifying song...' : 'Listening...'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isRecognizing ? 'Almost there!' : 'Play music near your device'}
              </p>
            </div>
          )}
          
          <ListeningAnimation isListening={isListening && !isRecognizing} />
          
          <WaveAnimation isAnimating={isListening || isRecognizing} />
          
          {!result && (
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete} 
              isListening={isListening}
              setIsListening={setIsListening}
            />
          )}
          
          <SongResult 
            song={result || {id: '', title: '', artist: '', album: '', year: '', albumArt: '', identifiedAt: ''}} 
            isVisible={!!result} 
          />
          
          {result && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleNewRecording}
                className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Identify Another Song
              </button>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="py-2 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
          )}
          
          <div className="mt-8 w-full">
            <HistoryList 
              songs={history} 
              onSelect={selectFromHistory} 
              isVisible={showHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;