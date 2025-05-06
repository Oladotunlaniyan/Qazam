export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  albumArt: string;
  identifiedAt: string;
  genres?: string[];
  lyricsSnippet?: string;
  spotifyUrl?: string | null;
  appleUrl?: string | null;
}