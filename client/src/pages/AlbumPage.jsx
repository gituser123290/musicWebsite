import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ArtistPage() {
    const [error, setError] = useState(null)
    const [songData, setSongData] = useState({
        name: "",
        nationality: "",
        birth_date: "",
        biography: "",
        image: null,
        genre: "",
    });

    const navigate=useNavigate()

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setSongData((prevDetails) => ({
                ...prevDetails,
                image: files[0],
            }));
        } else {
            setSongData((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleArtist = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", songData.name);
            formData.append("genre", songData.genre);
            formData.append("birth_date", songData.birth_date);
            formData.append("nationality", songData.nationality);
            formData.append("biography", songData.biography);

            if (songData.image) {
                formData.append("image", songData.image);
            } else {
                formData.append("image", null);
            }
            const response = await api.post('/artist/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSongData(response.data);
            navigate('/artist')
            console.log(response.data);
            
        } catch (error) {
            setError(error);
            alert(error.message);
        }
    };

    if(error){
        return <p>Error: {error}</p>
    }

    return (
        <div className="flex w-full min-h-screen justify-center items-center p-4 bg-slate-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mb-20">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Album Information
                </h2>
                <form onSubmit={handleArtist}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
                                Album Name
                            </label>
                            <input
                                type="text"
                                name="name" 
                                id="name"
                                onChange={handleInputChange}
                                placeholder="Enter Artist name"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="genre" className="block text-lg text-gray-700 mb-2">
                                Genre
                            </label>
                            <input
                                type="text"
                                name="genre"
                                id="genre"
                                onChange={handleInputChange}
                                placeholder="Enter genre"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birth_date" className="block text-lg text-gray-700 mb-2">
                                Birth Date
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                id="birth_date"
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-lg text-gray-700 mb-2">
                                Nationality
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                id="nationality"
                                onChange={handleInputChange}
                                placeholder="Enter nationality"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="biography" className="block text-lg text-gray-700 mb-2">
                                Biography
                            </label>
                            <textarea
                                name="biography"
                                id="biography"
                                placeholder="Write a short biography"
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-lg text-gray-700 mb-2">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:outline-none"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
