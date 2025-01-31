import React, { useState } from "react";
import  { apiUrl } from "../services/api";
import Loading from "../layouts/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreatePlayList() {
    const [name, setName] = useState("");
    const [is_public, setIsPublic] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createPlaylist = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        try {
            await axios.post(apiUrl+"/playlist/create/",
                { name: name, is_public: is_public },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            alert("Playlist create Successfully");
            navigate("/playlists")
        } catch (error) {
            setError(error.message);
            alert(`Error: ${error.message}`);
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex justify-center items-center w-full bg-slate-400 min-h-screen">
            <div className="w-full sm:w-1/2 lg:w-1/3 bg-green-500 mt-10 p-6 rounded-lg shadow-md">
                <form
                    onSubmit={createPlaylist}
                    className="flex flex-col items-center"
                    action=""
                >
                    <div className="mb-4">
                        <h2 className="text-3xl text-white">Create New Playlist</h2>
                    </div>
                    <div className="w-full mb-4">
                        <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
                            Playlist Name
                        </label>
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 w-full rounded-md focus:outline-none"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label
                            htmlFor="status"
                            className="block text-lg text-gray-700 mb-2"
                        >
                            Status
                        </label>
                        <input
                            type="text"
                            placeholder="is_public?true:false"
                            name="is_public"
                            value={is_public}
                            className="p-2 w-full rounded-md focus:outline-none"
                            onChange={(e) => setIsPublic(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-4 w-full rounded-md bg-blue-600 text-white hover:bg-green-300 focus:outline-none"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
