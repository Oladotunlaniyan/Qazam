import React from 'react';
import { Song } from '../types/Song';
import { Clock } from 'lucide-react';

interface HistoryListProps {
  songs: Song[];
  onSelect: (song: Song) => void;
  isVisible: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({ songs, onSelect, isVisible }) => {
  if (!isVisible || songs.length === 0) return null;

  return (
    <div className={`w-full max-w-md transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-indigo-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">History</h2>
      </div>
      
      <div className="space-y-2">
        {songs.map((song, index) => (
          <div 
            key={`${song.id}-${index}`}
            onClick={() => onSelect(song)}
            className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
          >
            <img 
              src={song.albumArt} 
              alt={song.title} 
              className="w-12 h-12 rounded-md object-cover mr-3" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {song.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {song.artist}
              </p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {new Date(song.identifiedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;