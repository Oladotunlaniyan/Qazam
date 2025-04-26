import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';

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
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isListening) {
      startRecording();
    } else if (mediaRecorder) {
      stopRecording();
    }
    
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };
      
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="relative w-full flex justify-center items-center">
      <button
        onClick={() => setIsListening(!isListening)}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
          ${isListening ? 
            'bg-red-500 hover:bg-red-600' : 
            'bg-blue-600 hover:bg-blue-700'}
        `}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <StopCircle size={36} className="text-white" />
        ) : (
          <Mic size={36} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;