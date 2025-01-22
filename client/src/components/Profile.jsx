import React, { useState, useEffect } from 'react'
import api from '../services/api'
import Loading from '../layouts/Loading'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)  // Set loading to true initially

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem('token')
            if (!token) return
            try {
                const response = await api.get('/account/user/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                })
                setUser(response.data)
                setLoading(false) 
                console.log(response.data);
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (loading) return <Loading />
    
    if (error) return <p>Error: {error}</p>

    return (
        <div className="w-full m-0 p-0 bg-gray-400">
            <div className="w-full max-w-6xl mx-auto h-screen flex justify-center items-center">
                <div className="bg-white shadow-md rounded-md p-12">
                    <img src={user.profile_picture || "/default-image.jpg"} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-center">{user.username || 'User'}</h1>
                    <p className="text-gray-600 text-center">{user.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
                    <div>
                        <ul className="flex flex-wrap justify-center gap-4">
                            <li className="text-gray-600 hover:text-gray-800">
                                <a href="//">About</a>
                            </li>
                            <li className="text-gray-600 hover:text-gray-800">
                                <a href="//">Services</a>
                            </li>
                            <li className="text-gray-600 hover:text-gray-800">
                                <a href="//">Contact</a>
                            </li>
                            <li className="text-gray-600 hover:text-gray-800">
                                <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">Spotify</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
