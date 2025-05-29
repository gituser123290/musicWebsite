/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import axios from "axios";
import { FaTwitter, FaInstagram, FaFacebook, FaCheckCircle } from "react-icons/fa";

export default function ArtistPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [artistData, setArtistData] = useState({
    name: "",
    bio: "",
    imageFile: null,   // file instead of URL
    imagePreview: null, // preview URL
    website: "",
    socialMedia: {
      twitter: "",
      instagram: "",
      facebook: "",
    },
    nationality: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setArtistData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtistData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleArtist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError(new Error("User not authenticated"));
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", artistData.name);
      formData.append("bio", artistData.bio);
      formData.append("website", artistData.website);
      formData.append("nationality", artistData.nationality);

      // Append social media as JSON string
      formData.append("social_media", JSON.stringify(artistData.socialMedia));

      // Append image file if available
      if (artistData.imageFile) {
        formData.append("image", artistData.imageFile);
      }

      const response = await axios.post(apiUrl + "/artist/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate("/artists");
      }, 1500);

    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center p-6 bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Artist Information
        </h2>

        <form onSubmit={handleArtist} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
              Artist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Artist name"
              value={artistData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-lg text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Enter artist bio"
              value={artistData.bio}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-lg text-gray-700 mb-2">
              Upload Artist Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-700"
            />
            {artistData.imagePreview && (
              <img
                src={artistData.imagePreview}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md mx-auto"
              />
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-lg text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              placeholder="Enter Website URL"
              value={artistData.website}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Social Media URLs */}
          <div>
            <label className="block text-lg text-gray-700 mb-2">Social Media</label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaTwitter className="text-blue-400 w-6 h-6" />
                <input
                  type="url"
                  name="twitter"
                  placeholder="Twitter URL"
                  value={artistData.socialMedia.twitter}
                  onChange={handleSocialChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <FaInstagram className="text-pink-500 w-6 h-6" />
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram URL"
                  value={artistData.socialMedia.instagram}
                  onChange={handleSocialChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <FaFacebook className="text-blue-700 w-6 h-6" />
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook URL"
                  value={artistData.socialMedia.facebook}
                  onChange={handleSocialChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-lg text-gray-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              placeholder="Enter Nationality"
              value={artistData.nationality}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button with loading and success animation */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-md text-white font-semibold focus:outline-none 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-6 w-6 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : success ? (
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-300 w-6 h-6" />
                  <span>Success!</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-4 text-red-600 font-semibold text-center">
              Error: {error.message || "Something went wrong."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
