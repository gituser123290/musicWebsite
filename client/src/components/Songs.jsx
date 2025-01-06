import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
export default function Songs() {
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await api.get('/song/')
                setSongs(response.data)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchSong()
    }, [])

    const handleClick=(id)=>{
        navigate(`/song/${id}`)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <>
        <div className='flex justify-center align-middle h-auto w-full p-4'>
            <h1 className="text-xl text-black font-semibold text-center mt-0">My Music Library</h1>
        </div>
        <div className="flex text-justify w-full mb-14">
            <div className="flex flex-wrap justify-center align-middle rounded-lg">
                {songs.map(song => (
                    <div key={song.id} onClick={()=>handleClick(song.id)} className="bg-green-400 flex-col justify-center align-middle w-[295px] h-[300px] p-4 m-2 rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 transform hover:shadow-2xl hover:bg-slate-500">
                        <div className='flex-1 ml-12'>
                            <img className="w-24 h-24 object-cover rounded-full" src={`http://127.0.0.1:8000${song.artists.image}`} alt={song.artist.name} />
                        </div>
                        <div className='py-8'>
                            <p className="text-sm py-2 font-medium text-gray-800 tracking-normal">Album: {song.albums.title}</p>
                            <p className="text-xl py-2 font-semibold text-gray-950 tracking-normal">Title: {song.name}</p>
                            <p className="text-lg py-2 text-gray-900 -tracking-4">Artist: {song.artists.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
