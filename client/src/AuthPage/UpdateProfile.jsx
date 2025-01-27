import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProfileUpdate() {
  const [profileData, setProfileData] = useState({
    bio: "",
    phone_number: "",
    profile_picture: null,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const response = await api.get("/account/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", profileData.bio);
    formData.append("phone_number", profileData.phone_number);
    if (profileData.profile_picture) {
      formData.append("profile_picture", profileData.profile_picture);
    }

    const token = sessionStorage.getItem("token");
    if (!token) return;
    api.put("/account/user/update/", formData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        navigate("/profile");
      })
      .catch((error) => {
        alert("Profile update failed");
        console.log(error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;
  return (
    <form onSubmit={handleSubmit} class="max-w-lg mx-auto my-3 p-6 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg shadow-lg space-y-4">
      <div class="space-y-2">
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="space-y-2">
        <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={profileData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="space-y-2">
        <label for="profile_picture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          type="file"
          name="profile_picture"
          onChange={handleChange}
          class="w-full text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Update Profile
      </button>
    </form>
  );
}
