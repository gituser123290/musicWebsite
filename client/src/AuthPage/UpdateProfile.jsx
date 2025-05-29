import React, { useState, useEffect } from "react";
import { apiUrl } from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfileUpdate() {
  const [profileData, setProfileData] = useState({
    bio: "",
    phone_number: "",
    profile_picture: null,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${apiUrl}/account/user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setProfileData({ ...profileData, profile_picture: files[0] });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", profileData.bio);
    formData.append("phone_number", profileData.phone_number);
    if (profileData.profile_picture) {
      formData.append("profile_picture", profileData.profile_picture);
    }

    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(`${apiUrl}/account/user/update/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate("/profile");
    } catch (error) {
      setError("Profile update failed");
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return <div className="text-center text-white">User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-zinc-800/70 backdrop-blur-md border border-zinc-700 p-8 rounded-xl shadow-2xl space-y-6 text-white"
      >
        <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight">Edit Your Profile</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full p-3 rounded-lg bg-zinc-700 border border-zinc-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleChange}
            placeholder="Your contact number"
            className="w-full p-3 rounded-lg bg-zinc-700 border border-zinc-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
