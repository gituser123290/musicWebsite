import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import  { apiUrl } from '../services/api'
import Loading from '../layouts/Loading'
import moment from 'moment';
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope, FaPenSquare,FaSpotify } from 'react-icons/fa';
import { PiPlaylistFill } from "react-icons/pi";
import axios from 'axios';

export default function Profile() {
    const [user, setUser] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem('token')
            if (!token) return;
            try {
                const response = await axios.get(apiUrl+'/account/user/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                })
                setUser(response.data)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const browseSongs = async (e) => {
        e.preventDefault();
        navigate("/allsongs");
    }

    const browsePlaylist = async (e) => {
        e.preventDefault();
        navigate("/playlists");
      }

    if (loading) return <Loading />

    if (error) return <p>Error: {error}</p>

    return (
        <div className="max-w-sm mx-auto w-full h-auto bg-gray-200 hover:bg-gray-400 rounded-xl mt-10 shadow-md overflow-hidden md:max-w-2xl hover:scale-95 transition-transform duration-300 hover:shadow-xl">
            <div className="md:flex m-10">
                <div className="md:flex-shrink-0">
                    <img
                        className="w-24 h-24 rounded-full mx-auto mt-6"
                        src={user.user_picture} alt={user.username}
                    />
                </div>
                <div className="p-6 space-y-10">
                    <h2 className="text-xl font-semibold text-gray-800">{user?.username} joined {moment(user?.date_joined).fromNow()}</h2>
                    <h3 className="text-xl font-semibold text-gray-800">{user?.first_name} {user?.last_name} <span className='text-sm'>last login {moment(user?.last_login).fromNow()}</span></h3>
                    <p className="text-gray-600">{user?.bio || "No bio available"}</p>
                    <p className="text-sm font-semibold text-gray-800 cursor-pointer" onClick={browsePlaylist}>Playlist: {user?.playlists[0]?.name} have total {user?.playlists[0]?.songs.length} Songs</p>

                    <div className="mt-4 flex sm:flex-wrap space-x-10 profile">
                    <a href='/updateprofile' rel="noopener noreferrer">
                            <FaPenSquare
                                size={24}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                            />
                        </a>
                        <a href='https://open.spotify.com/collection/tracks' target="_blank" rel="noopener noreferrer">
                            <FaSpotify
                                size={24}
                                className="text-green-700 hover:text-green-500 transition-colors duration-300"
                            />
                        </a>
                        <a href='https://x.com/Naurangi23' target="_blank" rel="noopener noreferrer">
                            <FaTwitter
                                size={24}
                                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                            />
                        </a>
                        <a href='https://github.com/Naurangi123' target="_blank" rel="noopener noreferrer">
                            <FaGithub
                                size={24}
                                className="text-gray-500 hover:text-black transition-colors duration-300"
                            />
                        </a>
                        <a href='https://www.linkedin.com/in/naurangi-lal-aa3175228/' target="_blank" rel="noopener noreferrer">
                            <FaLinkedin
                                size={24}
                                className="text-blue-500 hover:text-blue-900 transition-colors duration-300"
                            />
                        </a>
                        <a href={`mailto:${user?.email}`} target="_blank" rel="noopener noreferrer">
                            <FaEnvelope
                                size={24}
                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                            />
                        </a>
                        <a href={browseSongs} target="_blank" rel="noopener noreferrer">
                            <PiPlaylistFill
                                onClick={browseSongs}
                                size={24}
                                className="text-red-500 hover:text-red-700 hover:cursor-pointer transition-colors duration-300"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
