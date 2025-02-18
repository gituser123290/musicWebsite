import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Loading from '../../layouts/Loading'
import {apiUrl} from '../../services/api';
import '../../styles/custom.css';
import axios from 'axios';

export default function Songs() {
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSong = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                Navigate('/login');
                return;
            }
            try {
                const response = await axios.get(apiUrl+'/songs', {
                    headers: {
                        Authorization:`Token ${token}`
                    }
                })
                setSongs(response.data)
                setLoading(false)
            } catch (error) {
                console.log(error.message);
                setError(error)
                setLoading(false)
            }
        }
        fetchSong()
    }, [navigate])

    const handleClick = (id) => {
        navigate(`/songs/${id}`)
    }

    if (loading) return <div><Loading /></div>;

    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="flex flex-wrap p-0 m-0 h-auto gap-3 w-full">
            {songs.map(song => (
                <div
                    key={song.id}
                    onClick={() => handleClick(song.id)}
                    className="bg-orange-500 flex-col justify-center songs items-center w-1/5 p-4 m-2 rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 transform hover:shadow-2xl hover:bg-gradient-to-r from-purple-500 to-indigo-600">

                    {/* Song Image */}
                    <div className='flex justify-center mb-4'>
                        <img
                            className="w-24 h-24 object-cover rounded-full"
                            src={song.song_cover_url.startsWith("http") ? song.song_cover_url : `${song.song_cover_url}`}
                            alt={song.title} />
                    </div>

                    {/* Song Details */}
                    <div className='flex-1 py-2 text-center'>
                        <p className="text-md py-1 font-semibold text-gray-800 tracking-normal truncate">Title: {song.title}</p>
                        <p className="text-sm py-1 font-medium text-gray-950 tracking-normal truncate">Artist: {song.artist.name}</p>
                        <p className="text-sm py-1 text-gray-900 -tracking-4 truncate">Genre: {song.genre}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
