import { Song } from '../types/Song';

export const getMockSongs = (): Song[] => {
  return [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      year: '1975',
      albumArt: 'https://via.placeholder.com/300/92c952?text=Queen',
      identifiedAt: ''
    },
    {
      id: '2',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      year: '1982',
      albumArt: 'https://via.placeholder.com/300/771796?text=MJ',
      identifiedAt: ''
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      year: '1976',
      albumArt: 'https://via.placeholder.com/300/24f355?text=Eagles',
      identifiedAt: ''
    },
    {
      id: '4',
      title: 'Hey Jude',
      artist: 'The Beatles',
      album: 'The Beatles Again',
      year: '1968',
      albumArt: 'https://via.placeholder.com/300/d32776?text=Beatles',
      identifiedAt: ''
    },
    {
      id: '5',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      year: '2017',
      albumArt: 'https://via.placeholder.com/300/f66b97?text=Ed',
      identifiedAt: ''
    }
  ];
};