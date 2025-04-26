import React from 'react';
import { Music, Clock } from 'lucide-react';
import { Song } from '../types/Song';

interface SongResultProps {
  song: Song;
  isVisible: boolean;
}

const SongResult: React.FC<SongResultProps> = ({ song, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform translate-y-0 opacity-100">
      <div className="relative">
        <img 
          src={song.albumArt} 
          alt={`${song.title} album art`} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div className="text-white">
            <p className="text-sm font-medium">IDENTIFIED</p>
            <p className="text-lg font-bold truncate">{song.title}</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{song.title}</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <Music className="w-5 h-5 text-indigo-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-300">{song.artist}</p>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-indigo-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-300">{song.album} ({song.year})</p>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-2">
          <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
            Listen
          </button>
          <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongResult;