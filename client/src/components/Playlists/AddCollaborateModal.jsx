import React, { useState, useEffect } from 'react';
import { addCollaboratorToPlaylist } from '../services/playlistService';
import axios from 'axios';

export default function AddCollaboratorModal({ playlist, onClose, onAdded }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users from backend API (make sure to exclude current user and existing collaborators)
    axios.get('/api/users/') // Adjust accordingly
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    if (!selectedUserId) return;
    addCollaboratorToPlaylist(playlist.id, selectedUserId)
      .then(() => onAdded())
      .catch(err => alert('Error adding collaborator: ' + err.message));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Collaborator to {playlist.name}</h3>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <select
            className="border p-2 w-full mb-4"
            value={selectedUserId || ''}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select a user --</option>
            {users
              .filter(u => u.id !== playlist.owner && !playlist.collaborators.includes(u.id))
              .map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
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
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            disabled={!selectedUserId}
          >
            Add Collaborator
          </button>
        </div>
      </div>
    </div>
  );
}
