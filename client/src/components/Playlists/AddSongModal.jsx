import React, { useState, useEffect } from 'react';
import { addSongToPlaylist } from '../services/playlistService';
import axios from 'axios';

export default function AddSongModal({ playlist, onClose, onAdded }) {
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all songs from your backend song API
    axios.get('/api/songs/') // Adjust if needed
      .then(res => setSongs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    if (!selectedSongId) return;
    addSongToPlaylist({ playlist: playlist.id, song: selectedSongId })
      .then(() => onAdded())
      .catch(err => alert('Error adding song: ' + err.message));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Song to {playlist.name}</h3>

        {loading ? (
          <p>Loading songs...</p>
        ) : (
          <select
            className="border p-2 w-full mb-4"
            value={selectedSongId || ''}
            onChange={e => setSelectedSongId(e.target.value)}
          >
            <option value="">-- Select a song --</option>
            {songs.map(song => (
              <option key={song.id} value={song.id}>{song.title}</option>
            ))}
          </select>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!selectedSongId}
          >
            Add Song
          </button>
        </div>
      </div>
    </div>
  );
}
