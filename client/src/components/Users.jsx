import React, { useState,useEffect } from 'react'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import moment from "moment";
import api from '../services/api'

export default function Users() {
    const [users,setUsers]=useState([])
    const [isLoading, setIsLoading]=useState(true)
    const [error, setError]=useState(null)

    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const response=await api.get('/users')
                setUsers(response.data)
            }
            catch(err){
                setError(err.message)
            }finally{
                setIsLoading(false)
            }
        }
        fetchUser()
    },[])

    const handleDeleteUser=async(id)=>{
        try{
            await api.delete(`/users/${id}`)
            setUsers(users.filter(user=>user.id!==id))
        }
        catch(err){
            setError(err.message)
        }
    }

    if(isLoading){
        return <div>Loading...</div>
    }

    if(error){
        return <div>{error}</div>
    }


    return (
        <div class="flex w-full h-auto justify-center items-center flex-wrap gap-2 bg-gray-300 p-2">
            {users.map(user => (
            <div key={user.id} class="flex w-[300px] h-auto flex-col flex-wrap max-w-4xl mt-0 p-2 justify-center mb-20 items-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <div class="flex-1 pt-2 m-2 w-48 text-center">
                    <img src={user.avatar} alt={user.name} class="rounded-full mx-auto mb-4 w-32 h-32 object-cover"/>
                        <p class="text-lg font-semibold text-gray-800">Username: <span class="font-normal">{user.name.substring(0,8)}</span></p>
                        <p class="text-lg font-semibold text-gray-800"><span class="font-normal">{moment(user.creationAt).fromNow()}</span></p>
                </div>
                <div class="flex-1 pt-4 m-4 text-center">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">{user.role}</h1>
                    <p class="text-md text-gray-600">{user.email}</p>
                </div>
                <div class="flex-1 pt-4 mx-4 m-2 text-center justify-end">
                    <button onClick={()=>handleDeleteUser(user.id)} class="mt-2 text-xl text-white px-4 py-2 rounded-md hover:text-red-700">
                        <FaTrash/>
                    </button>
                    <button class="mt-2 text-xl text-white px-4 py-2 rounded-md hover:text-green-900">
                        <FaRegEdit/>
                    </button>
                </div>
            </div>
            ))}
        </div>
    )
}
