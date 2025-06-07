import React, { useEffect, useState } from 'react';
import { fetchPlaylists, createPlaylist } from '../services/playlistService';
import PlaylistCard from '../components/PlaylistCard';
import AddSongModal from '../components/AddSongModal';
import AddCollaboratorModal from '../components/AddCollaboratorModal';

export default function CollaborativePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    setLoading(true);
    fetchPlaylists()
      .then(res => setPlaylists(res.data))
      .finally(() => setLoading(false));
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist({ name: newPlaylistName })
      .then(() => {
        setNewPlaylistName('');
        loadPlaylists();
      });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Collaborative Playlists</h1>

      <div className="mb-6 flex space-x-3">
        <input
          type="text"
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={e => setNewPlaylistName(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
        />
        <button
          onClick={handleCreatePlaylist}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      {loading ? (
        <p>Loading playlists...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playlists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onAddSong={() => {
                setSelectedPlaylist(pl);
                setShowAddSongModal(true);
              }}
              onAddCollaborator={() => {
                setSelectedPlaylist(pl);
                setShowAddCollaboratorModal(true);
              }}
              refreshPlaylists={loadPlaylists}
            />
          ))}
        </div>
      )}

      {showAddSongModal && selectedPlaylist && (
        <AddSongModal
          playlist={selectedPlaylist}
          onClose={() => {
            setShowAddSongModal(false);
            setSelectedPlaylist(null);
          }}
          onAdded={() => {
            setShowAddSongModal(false);
            setSelectedPlaylist(null);
            loadPlaylists();
          }}
        />
      )}

      {showAddCollaboratorModal && selectedPlaylist && (
        <AddCollaboratorModal
          playlist={selectedPlaylist}
          onClose={() => {
            setShowAddCollaboratorModal(false);
            setSelectedPlaylist(null);
          }}
          onAdded={() => {
            setShowAddCollaboratorModal(false);
            setSelectedPlaylist(null);
            loadPlaylists();
          }}
        />
      )}
    </div>
  );
}
