import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import axios from "axios";

export default function AlbumCreatePage() {
  const [error, setError] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [albumData, setAlbumData] = useState({
    name: "",
    artist_id: "",
    release_date: "",
    cover_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Redirect if no token (auth guard)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch artists list
  useEffect(() => {
    const fetchArtists = async () => {
      setLoadingArtists(true);
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(apiUrl + "artists/", {
          headers: { Authorization: `Token ${token}` },
        });
        setArtists(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load artists. Please try again."
        );
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setAlbumData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setAlbumData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(albumData).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      await axios.post(apiUrl + "albums/create/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Success: reset form and navigate to albums list
      setAlbumData({ name: "", artist_id: "", release_date: "", cover_image: null });
      setImagePreview(null);
      navigate("/albums");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create album. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Create New Album
        </h1>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="mb-2 block font-semibold text-gray-700">
              Album Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={albumData.name}
              onChange={handleInputChange}
              placeholder="Enter album name"
              required
              className="w-full rounded border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="artist_id"
              className="mb-2 block font-semibold text-gray-700"
            >
              Artist<span className="text-red-500">*</span>
            </label>
            {loadingArtists ? (
              <p className="text-gray-500">Loading artists...</p>
            ) : (
              <select
                id="artist_id"
                name="artist_id"
                value={albumData.artist_id}
                onChange={handleInputChange}
                required
                className="w-full rounded border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={submitting}
              >
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label
              htmlFor="release_date"
              className="mb-2 block font-semibold text-gray-700"
            >
              Release Date<span className="text-red-500">*</span>
            </label>
            <input
              id="release_date"
              name="release_date"
              type="date"
              value={albumData.release_date}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="cover_image"
              className="mb-2 block font-semibold text-gray-700"
            >
              Album Cover Image
            </label>
            <input
              ref={fileInputRef}
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full cursor-pointer rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={submitting}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Album cover preview"
                className="mt-4 h-48 w-full rounded object-cover shadow-md"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full rounded bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 ${
              submitting ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {submitting ? "Submitting..." : "Create Album"}
          </button>
        </form>
      </div>
    </div>
  );
}
