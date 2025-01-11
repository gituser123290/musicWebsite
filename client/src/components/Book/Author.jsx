import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Loading from "../../layouts/Loading";
import moment from "moment";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import {useNavigate } from "react-router-dom";

export default function Author() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate=useNavigate()

    const getAuthor = async () => {
        try {
            const response = await api.get("/book/author/");
            setAuthors(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        getAuthor();
    }, []);


    const handleClick=(id)=>{
        navigate(`/author/${id}/`)
    }

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {authors.map(author => {
                return (
                    <div key={author.id} onClick={()=>handleClick(author.id)} className=" flex flex-row w-full justify-center align-middle">
                        <div className="max-w-sm rounded overflow-hidden shadow-lg ml-4 mt-2 mb-2">
                            <img
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                                src={author.image}
                                alt="Sunset in the mountains"
                            />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{author.name}</div>
                                <p className="text-gray-700 text-base">
                                    {author.biography}.
                                </p>
                                <div className="text-sm">
                                <p className="text-gray-600">Birth: {moment(author.birth_date, "YYYYMMDD").fromNow()}</p>
                                <p className="text-gray-600">Death: {moment(author.death_date, "YYYYMMDD").fromNow()}</p>
                                <p className="text-gray-600"><a href={author.website} target="blank">Know More</a></p>
                            </div>
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer">
                                    <a href={author.website} target="blank">Read More</a>
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer">
                                    <FaTrash onClick={()=>handleClick(author.id)}/>
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer">
                                    <FaRegEdit onClick={() => alert('Edit functionality is not implemented yet!')}/>
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
}
