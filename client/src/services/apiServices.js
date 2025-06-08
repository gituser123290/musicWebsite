import axiosInstance from './api';

export const getData = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

export const putData = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};


// Playlist APIs
export const fetchPlaylists = async () => {
  try {
    const response = await getData('/playlists/');
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const createPlaylists = async (data) => {
  try {
    const response = await postData('/playlists/create/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const updatePlaylist = async (id, data) => {
  try {
    const response = await putData(`/playlists/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

export const deletePlaylist = async (id) => {
  try {
    const response = await deleteData(`/playlists/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

// Playlist Songs APIs
export const fetchPlaylistSongs = async (playlistId) => {
  try {
    const response = await getData(`/playlist-songs/?playlist=${playlistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    throw error;
  }
};

export const addSongToPlaylist = async (data) => {
  try {
    const response = await postData('/playlist-songs/', data);
    return response.data;
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};

export const removeSongFromPlaylist = async (id) => {
  try {
    const response = await deleteData(`/playlist-songs/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    throw error;
  }
};

// Add Collaborator
export const addCollaboratorToPlaylist = async (playlistId, collaboratorId) => {
  try {
    const { data } = await getData(`/playlists/${playlistId}/`);
    const newCollaborators = [...data.collaborators, collaboratorId];
    return await updatePlaylist(playlistId, {
      collaborators: newCollaborators,
      name: data.name
    });
  } catch (error) {
    console.error('Error adding collaborator to playlist:', error);
    throw error;
  }
};

// Search Music
export const searchMusic = async (query) => {
  try {
    const response = await getData(`/search/?q=${encodeURIComponent(query)}`);
    return response;
  } catch (error) {
    console.error('Error searching music:', error);
    throw error;
  }
};

// Get User Playlists
export const getUserPlaylists = async () => {
  try {
    const response = await getData('/playlists/');
    return response;
  } catch (error) {
    console.error('Error getting user playlists:', error);
    throw error;
  }
};

// Get Liked Songs
export const getLikedSongs = async () => {
  try {
    const response = await getData('/liked/');
    return response;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};


export const addArtist = async (data) => {
  try {
    const response = await postData(`/artist/create/`, data);
    return response;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};


export const recentPlayed = async () => {
  try {
    const response = await getData(`/recently-played/`);
    return response;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};

export const featuredPlaylist = async () => {
  try {
    const response = await getData(`/playlists/featured/`);
    return response;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};

export const getTopAlbum = async () => {
  try {
    const response = await getData(`/top-album/`);
    return response;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};
