import React from 'react';

export default function PlaylistCard({ playlist, onAddSong, onAddCollaborator, refreshPlaylists }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition relative">
      <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>

      <p className="mb-3 text-sm text-gray-600">
        Owned by: {playlist.owner}
      </p>

      <p className="mb-3 text-sm text-gray-600">
        Collaborators: {playlist.collaborators.length}
      </p>

      <div className="mb-3 max-h-48 overflow-auto">
        {playlist.songs.length === 0 && <p className="text-gray-500">No songs yet.</p>}
        <ul className="list-disc pl-5 space-y-1">
          {playlist.songs.map(song => (
            <li key={song.id}>{song.song}</li> // Adjust to show song title properly
          ))}
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onAddSong}
          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Add Song
        </button>
        <button
          onClick={onAddCollaborator}
          className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
        >
          Add Collaborator
        </button>
      </div>
    </div>
  );
}
