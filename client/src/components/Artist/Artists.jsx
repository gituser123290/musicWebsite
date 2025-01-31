import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  { apiUrl } from '../../services/api'
import Loading from '../../layouts/Loading'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import axios from 'axios'

export default function Artists() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate=useNavigate()

    useEffect(() => {
        const fetchSong = async () => {
            const token =sessionStorage.getItem('token')
            if(!token){
                navigate('/login')
                return
            }
            try {
                const response = await axios.get(apiUrl+'/artists/',{
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
                setArtists(response.data)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchSong()
    }, [navigate])

    const handleClick=(id)=>{
        navigate(`/artists/${id}/`)
    }

    if (loading) return <div><Loading/></div>;
    if (error) return <p>Error: {error.message}</p>
    return (
        <>
        <div className="flex justify-between items-center w-full h-auto mt-8 px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 w-full sm:w-auto">Artists</h1>
        </div>
        <div className="flex justify-center flex-wrap w-full mt-6 mb-20 px-2 sm:px-4">
            {artists.map(artist => (
                <div 
                    key={artist.id} 
                    onClick={() => handleClick(artist.id)} 
                    className="flex flex-col items-center bg-gradient-to-r from-purple-200 to-pink-200 p-4 gap-2 m-2 rounded-xl shadow-xl sm:w-[290px] hover:scale-95 transition-all duration-300 transform hover:shadow-2xl"
                >
                    <img 
                        className="w-32 h-32 object-cover rounded-full shadow-md mb-4" 
                        src={artist?.image_url} 
                        alt={artist.name} 
                    />
                    <div className="text-center space-y-2">
                        <p className="text-2xl font-semibold text-zinc-500">{artist.name}</p>
                        <p className="text-md text-zinc-500 text-justify">{Object.entries(artist.social_media).map((plateform)=>{return(<p>Social Media: {plateform[1]}</p>)})}</p>
                        <p className="text-md text-zinc-500 text-justify">{artist.nationality ? `Nationality: ${artist.nationality}` : 'Nationality: N/A'}</p>
                        <p className="text-sm text-zinc-500 text-justify">{artist.bio ? `BioGraphy: ${artist.bio.slice(0, 50)}...` : 'Biography: N/A'}</p>
                        <p className="text-md text-zinc-500 text-justify flex hover:text-green-500">{artist.website ? (<>Read More: <a href={artist.website} target="_blank" rel="noopener noreferrer"><FaArrowAltCircleRight size={20}/></a></>
                        ) : (
                            'Read More: N/A'
                        )}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
    )
}
