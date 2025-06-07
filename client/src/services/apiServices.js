import axios from 'axios';
import { apiUrl } from './api';


const API_BASE = `${apiUrl}`;  // Adjust to your backend base URL

const token=sessionStorage.getItem('token')

export const fetchPlaylists = () => axios.get(`${API_BASE}/playlists/`);
export const createPlaylist = (data) => axios.post(`${API_BASE}/playlists/`, data);
export const updatePlaylist = (id, data) => axios.put(`${API_BASE}/playlists/${id}/`, data);
export const deletePlaylist = (id) => axios.delete(`${API_BASE}/playlists/${id}/`);

export const fetchPlaylistSongs = (playlistId) => axios.get(`${API_BASE}/playlist-songs/?playlist=${playlistId}`);
export const addSongToPlaylist = (data) => axios.post(`${API_BASE}/playlist-songs/`, data);
export const removeSongFromPlaylist = (id) => axios.delete(`${API_BASE}/playlist-songs/${id}/`);

export const addCollaboratorToPlaylist = (playlistId, collaboratorId) => {
  return axios.get(`${API_BASE}/playlists/${playlistId}/`).then(({ data }) => {
    const newCollaborators = [...data.collaborators, collaboratorId];
    return updatePlaylist(playlistId, { collaborators: newCollaborators, name: data.name });
  });
};


export const searchMusic=(query)=>axios.get(`${API_BASE}/search/?q=${encodeURIComponent(query)}`,{
  headers:{
    Authorization: `Token ${token}`
  }
})

export const getUserPlaylists=()=>axios.get(`${API_BASE}/playlists/`,{
  headers:{
    Authorization: `Token ${token}`
  }
})

export const getLikedSongs=()=>axios.get(`${API_BASE}/liked/`,{
  headers:{
    Authorization: `Token ${token}`
  }
})