import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../services/api";
import {
  FaArrowAltCircleRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaSpotify,
  FaSoundcloud,
  FaGlobe,
} from "react-icons/fa";
import axios from "axios";

const socialIconMap = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  website: FaGlobe,
};

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-gradient-to-tr from-gray-300 via-gray-200 to-gray-300 p-6 shadow-lg">
      <div className="mx-auto h-36 w-36 rounded-full bg-gray-400 mb-4" />
      <div className="h-6 w-32 bg-gray-400 rounded mb-2 mx-auto"></div>
      <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
      <div className="h-3 w-full bg-gray-300 rounded mt-3 line-clamp-3"></div>
    </div>
  );
}

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async (pageNum = 1) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(apiUrl + `/artists/?page=${pageNum}`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (pageNum === 1) setArtists(response.data);
        else setArtists((prev) => [...prev, ...response.data]);
        setHasMore(Boolean(response.data.next));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchArtists(page);
  }, [navigate, page]);

  const handleClick = (id) => {
    navigate(`/artists/${id}`);
  };

  if (error)
    return (
      <p className="text-center text-red-600 mt-6">
        Error: {error.message || "Failed to load artists"}
      </p>
    );

  return (
    <>
      <div className="flex justify-center mt-8 mb-6 px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Artists</h1>
      </div>

      {loading && page === 1 ? (
        <div className="grid gap-8 px-4 sm:px-6 max-w-7xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-8 px-4 sm:px-6 max-w-7xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
            {artists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => handleClick(artist.id)}
                className="relative cursor-pointer rounded-xl bg-gradient-to-tr from-purple-300 via-pink-300 to-pink-400 p-6 shadow-lg transition-transform duration-300 hover:scale-[0.97] hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-20 rounded-xl transition-opacity duration-300 pointer-events-none" />
                <img
                  src={artist?.image_url}
                  alt={artist.name}
                  className="mx-auto h-36 w-36 rounded-full object-cover shadow-md"
                  loading="lazy"
                />
                <div className="mt-4 text-center">
                  <h2 className="truncate text-2xl font-semibold text-gray-900">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-gray-700 italic text-sm">
                    {artist.nationality || "Nationality: N/A"}
                  </p>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                    {artist.bio || "Biography not available."}
                  </p>

                  <div className="mt-4 flex justify-center space-x-4 text-gray-700">
                    {artist.social_media &&
                      Object.entries(artist.social_media).map(([platform, url]) => {
                        if (!url) return null;
                        const Icon =
                          socialIconMap[platform.toLowerCase()] || FaGlobe;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={platform}
                            className="transform hover:scale-110 hover:text-green-600 transition"
                          >
                            <Icon size={24} />
                          </a>
                        );
                      })}

                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Website"
                        className="transform hover:scale-110 hover:text-green-600 transition"
                      >
                        <FaGlobe size={24} />
                      </a>
                    )}
                  </div>

                  <p className="mt-4 flex items-center justify-center text-green-600 font-medium text-sm hover:text-green-800">
                    Read More <FaArrowAltCircleRight className="ml-2" />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="flex justify-center my-8">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
