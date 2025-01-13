import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../layouts/Loading'



export default function Songs() {
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSong = async () => {
            const token = sessionStorage.getItem('token')
            if(!token){
                Navigate('/login');
                return;
            }
            try {
                const response = await api.get('/songs/',{
                    headers:{
                       Authorization: `Bearer ${token}`
                    }
                })
                setSongs(response.data)
                console.log(response.data)
                setLoading(false)
            } catch (error) {
                console.log(error.message);
                setError(error)
                setLoading(false)
            }
        }
        fetchSong()
    }, [navigate])

    const handleClick=(id)=>{
        navigate(`/songs/${id}`)
    }

    if (loading) return <div><Loading/></div>;

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
        <div className="flex w-full">
            <div className="flex justify-center align-middle rounded-lg">
                {songs.map(song => (
                    <div key={song.id} onClick={()=>handleClick(song.id)} className="bg-green-400 flex-col justify-center align-middle w-full h-auto p-10 ml-10 mt-4 mb-20 rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 transform hover:shadow-2xl hover:bg-slate-500">
                        <div className='flex justify-items-center'>
                            <img className="w-24 h-24 object-cover rounded-full justify-center" src={song.song_cover} alt={song.title} />
                        </div>
                        <div className=' flex-1 py-2'>
                            <p className="text-sm py-1 font-medium text-gray-800 tracking-normal">Title: {song.title}</p>
                            <p className="text-xl py-1 font-semibold text-gray-950 tracking-normal">Artist: {song.artist}</p>
                            <p className="text-lg py-1 text-gray-900 -tracking-4">Genre: {song.genre}</p>
                            <p className="text-lg py-1 text-gray-900 -tracking-4">Durantion: {song.duration}</p>
                        </div>
                        <div className="flex-1">
                            <audio className="w-full rounded-lg bg-gray-100 p-2" src={song.file} controls></audio>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
