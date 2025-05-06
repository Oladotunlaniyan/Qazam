# Qazam Socket.io Backend

WebSocket-based backend server for the Qazam music recognition application, integrating with the Shazam API.

## Features

- Real-time communication with frontend via Socket.io
- Audio blob processing
- Song recognition via Shazam API
- History tracking of recognized songs
- Broadcasts updates to all connected clients

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- RapidAPI account with subscription to Shazam API

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```bash
   cd qazam-socket-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   PORT=7070
   RAPID_API_KEY=your_rapidapi_key_here
   RAPID_API_HOST=shazam.p.rapidapi.com
   ```
   Replace `your_rapidapi_key_here` with your actual RapidAPI key.

## Running the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The socket server will start on port 7070 by default (or the port specified in your `.env` file).

## Socket.io Events

### Client → Server

- `song` - Audio data sent as ArrayBuffer for recognition

### Server → Client

- `shazam-result` - Recognized song data
- `shazam-error` - Error information if recognition fails
- `history` - Initial history list sent on connection
- `history-updated` - Updated history list after a new recognition

## REST API Endpoints

### History Management

**GET** `/api/history`
- Returns list of recently recognized songs

## Connection with Your React Frontend

The Socket.io backend is designed to work with your React frontend using the provided WebSocket implementation in your `useSongRecognition.ts` hook.

Your frontend should:
1. Connect to the Socket.io server at `http://localhost:7070`
2. Send audio data using the `song` event
3. Listen for `shazam-result` and `shazam-error` events

## Error Handling

The Socket.io server emits appropriate error events with details:
- Connection errors
- Audio processing errors
- Shazam API errors
- No matches found scenarios

## License

ISC