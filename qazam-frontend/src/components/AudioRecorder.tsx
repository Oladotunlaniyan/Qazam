// Frontend: src/components/AudioRecorder.tsx
import { useState, useRef } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  isListening, 
  setIsListening 
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const startRecording = async () => {
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        
        // Stop all audio tracks
        stopAllTracks();
      };
      
      mediaRecorder.start();
      setIsListening(true);
      
      // Automatically stop recording after 12 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 12000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };
  
  const stopAllTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  return (
    <div className="mt-8 w-full flex justify-center">
      {!isListening ? (
        <button
          onClick={startRecording}
          className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Start listening"
        >
          <span className="text-3xl">🎵</span>
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          aria-label="Stop listening"
        >
          <span className="text-3xl">■</span>
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;