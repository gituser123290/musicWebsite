import React from 'react'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom';
import { MdReadMore } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";



export default function Products() {
    const [products, setProducts] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/product/')
                setProducts(response.data)
                setCount(response.data.length);
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleClick = (id) =>{
        navigate(`/product/${id}`)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>
    return (
        <div className="m-1 rounded-sm">
            <h1 className="text-3xl font-bold text-center">total {count} result</h1>
            <div className="flex flex-wrap justify-center m-0 rounded-md">
                {products.map(product => (
                    <div key={product.id} className="flex justify-center items-start flex-col w-1/4 bg-[orange] hover:bg-green-300 p-8 mx-6 my-2 rounded-md shadow-lg">
                        <div>
                            <img className="w-24 h-24 object-cover rounded-full" src={product.images} alt={product.title} />
                            <p className="text-sm font-bold">Title: {product.title}</p>
                            <p className="text-sm font-semibold">Price: {product.price}</p>
                            <p className="text-sm font-semibold">Description:</p>
                            <p className="text-sm font-semibold rounded-md bg-gray-400 h-20 overflow-y-scroll scrollbar-none cursor-pointer">{product.description}</p>
                            <p className="text-sm font-semibold">Category: {product.category.name}</p>
                        </div>
                        <div className="flex w-full px-10 pt-4 m-2 text-center justify-center">
                            <button className="mt-2 text-2xl text-white px-4 py-2 rounded-md hover:text-blue-900">
                                <FaRegEdit/>
                            </button>
                            <button onClick={()=>handleClick(product.id)} className="mt-2 text-3xl text-white px-4 py-2 rounded-md hover:text-orange-900">
                                <MdReadMore/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
