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
    <form onSubmit={handleSubmit}>
      <textarea
        name="bio"
        value={profileData.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input
        type="text"
        name="phone_number"
        value={profileData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input type="file" name="profile_picture" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
}
