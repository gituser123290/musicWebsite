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
            <div className="flex flex-wrap justify-center align-middle gap-1 rounded-lg">
                {songs.map(song => (
                    <div key={song.id} onClick={()=>handleClick(song.id)} className="bg-red-600 flex-col justify-center align-middle w-[230px] gap-1 p-4 m-2 rounded-lg shadow-2xl">
                        <div className='flex-1 ml-12'>
                            <img className="w-24 h-24 object-cover rounded-full" src={`http://127.0.0.1:8000${song.artist_detail.image}`} alt={ song.artist.name } />
                        </div>
                        <div className='flex-1'>
                            <p className="text-sm font-medium text-gray-800 tracking-normal">Album: {song.album_detail.title}</p>
                            <p className="text-xl font-semibold text-gray-950 tracking-tighter">Title: {song.title}</p>
                            <p className="text-lg text-gray-900">Artist: {song.artist_detail.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
