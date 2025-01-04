import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
export default function Artists() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate=useNavigate()

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await api.get('/artist/')
                setArtists(response.data)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchSong()
    }, [])

    const handleClick=(id)=>{
        navigate(`/artist/${id}/`)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>
    return (
        <>
        <div className="flex justify-between m-2">
            <div className="p-4 bg-orange-500 rounded-md hover:bg-orange-600 shadow-xl transition-colors duration-200 cursor-pointer">
                <p className="text-white font-semibold text-lg">Explore Artists</p>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900 w-full sm:w-auto">Artists</h1>
            <div className="p-4 bg-purple-500 rounded-md hover:bg-purple-600 shadow-xl transition-colors duration-200 cursor-pointer">
                <p className="text-white font-semibold text-lg">Discover Songs</p>
            </div>
        </div>
        <div className="flex flex-wrap justify-start gap-8 w-full p-4 mb-14">
            {artists.map(artist => (
                <div key={artist.id} onClick={()=>handleClick(artist.id)} className="flex flex-col items-center w-full bg-lime-600 hover:bg-lime-700 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <div className="bg-lime-100 hover:bg-lime-200 p-4 rounded-md shadow-md w-full flex-2">
                        <img className="w-32 h-32 object-cover rounded-full mx-auto mb-4" src={`http://127.0.0.1:8000${artist.image}`} alt={artist.name} />
                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-800">{artist.name}</p>
                            <p className="text-md text-gray-600">Born: {artist.birth_date}</p>
                            <p className="text-md text-gray-600">Nationality: {artist.nationality}</p>
                            <p className="text-md text-gray-600">Genre: {artist.genre}</p>
                            <p className="text-md text-gray-600">Years Active: {artist.biography}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}
