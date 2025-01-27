import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { FaRegEdit, FaTrash } from "react-icons/fa";
import api from '../../services/api';
import Loading from '../../layouts/Loading';


const image_url = "https://path/to/default/image.jpg";


const ArtistUpdateDelete = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalUpdateOpen, setIsUpdateModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const [artistDetails, setartistDetails] = useState({
        name: '',
        genre: '',
        birth_date: '',
        nationality:'',
        biography:'',
        image:null,
        image_url:null,
    });

    useEffect(() => {
        const fetchartistDetail = async () => {
            try {
                const response = await api.get(`/artist/${id}/`);
                setArtist(response.data);
                setartistDetails({
                    name: response.data.name,
                    genre: response.data.genre,
                    birth_date: response.data.birth_date,
                    nationality: response.data.nationality,
                    biography: response.data.biography,
                    image: response.data.image,
                    image_url: response.data.image_url,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchartistDetail();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setartistDetails((prevDetails) => ({
                ...prevDetails,
                image: files[0],
            }));
        } else {
            setartistDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleUpdateartist = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', artistDetails.name);
            formData.append('genre', artistDetails.genre);
            formData.append('birth_date', artistDetails.birth_date);
            formData.append('nationality', artistDetails.nationality);
            formData.append('biography', artistDetails.biography);

            if (artistDetails.image) {
                formData.append('image', artistDetails.image); 
            }

            if (artistDetails.image_url) {
                formData.append('image_url', artistDetails.image_url); 
            }

            const response = await api.put(`/artist/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setArtist(response.data);
            alert('artist updated successfully')
            closeUpdateModal();
        } catch (error) {
            console.error('Error updating artist:', error);
            alert('Failed to update artist.');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/artist/${id}/`);
            setArtist(null);
            closeDeleteModal()
        } catch (error) {
            setError(error.message);
        }
    };

    const openUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    if (loading) return <div><Loading/></div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
        <div className="w-1/6 items-center pl-10 p-4 m-1 bg-orange-500 rounded-md hover:bg-orange-600 shadow-xl transition-colors duration-200 cursor-pointer">
            <button onClick={() => navigate(-1)} className="text-white">Back to Posts</button>
        </div>
        <div className="flex flex-col min-h-screen bg-gray-200">
            <div className="flex items-center justify-center w-full flex-1 bg-gray-200 pt-4 pb-16">
                <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-gray-800 p-2 rounded-md shadow-lg">
                    <h1 className="text-center text-cyan-600 text-2xl mb-2">artist Detail</h1>
                    {artist ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="mb-2">
                                <img
                                    className="w-full h-auto object-cover rounded-md"
                                    src={`http://localhost:8000${artist?.image ? artist.image : image_url}`}
                                    alt="artist cover"
                                />
                            </div>
                            <hr />
                            <div className="p-2 columns-2 gap-20">
                                <h2 className="text-white text-2xl">{artist.name}</h2>
                                <p className="text-white">Genre: {artist.genre}</p>
                                <p className="text-white">Birth Date: {artist.birth_date}</p>
                                <p className="text-white">Nationality: {artist.nationality}</p>
                                <p className='text-white'>Biogarphy: {artist.biography}</p>
                                <p></p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={openUpdateModal}
                                        className="mt-2 text-3xl text-white px-4 py-2 rounded-md hover:text-sky-400"
                                    >
                                        <FaRegEdit />
                                    </button>
                                    <button
                                        onClick={openDeleteModal}
                                        className="mt-2 text-3xl text-white px-4 py-2 rounded-md hover:text-red-600"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No artist found!</p>
                    )}
                </div>
            </div>
            {isModalUpdateOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3 columns-2">
                        <h2 className="text-xl mb-4">Update artist</h2>
                        <form onSubmit={handleUpdateartist}>
                            <div className="mb-2">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={artistDetails.name}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Genre</label>
                                <input
                                    type="text"
                                    name="genre"
                                    value={artistDetails.genre}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Birth Date</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={artistDetails.birth_date}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={artistDetails.nationality}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Biography</label>
                                <input
                                    type="text"
                                    name="biography"
                                    value={artistDetails.biography}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Artist Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Artist Image URL</label>
                                <input
                                    type="file"
                                    name="image_url"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded-md"
                            >
                                Submit
                            </button>
                        </form>
                        <button
                            onClick={closeUpdateModal}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
            {isModalDeleteOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3 columns-2">
                        <h2 className="text-xl mb-4">Delete</h2>
                            <button
                                type="submit"
                                onClick={handleDelete}
                                className="w-full p-2 bg-red-700 text-white rounded-md"
                            >
                                Delete
                            </button>
                        <button
                            onClick={closeDeleteModal}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};
export default ArtistUpdateDelete;
