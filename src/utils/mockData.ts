import { Song } from '../types/Song';

export const getMockSongs = (): Song[] => {
  return [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      year: '2020',
      albumArt: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      identifiedAt: ''
    },
    {
      id: '2',
      title: 'As It Was',
      artist: 'Harry Styles',
      album: 'Harry\'s House',
      year: '2022',
      albumArt: 'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      identifiedAt: ''
    },
    {
      id: '3',
      title: 'Heat Waves',
      artist: 'Glass Animals',
      album: 'Dreamland',
      year: '2020',
      albumArt: 'https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      identifiedAt: ''
    },
    {
      id: '4',
      title: 'Flowers',
      artist: 'Miley Cyrus',
      album: 'Endless Summer Vacation',
      year: '2023',
      albumArt: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      identifiedAt: ''
    },
    {
      id: '5',
      title: 'Unstoppable',
      artist: 'Sia',
      album: 'This Is Acting',
      year: '2016',
      albumArt: 'https://images.pexels.com/photos/8108217/pexels-photo-8108217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      identifiedAt: ''
    }
  ];
};