import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}/`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <h1>Error: {error}</h1>;

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-10 mb-10 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Product Details
          </h1>
        </div>

        <div className="flex justify-center mb-8">
          <img
            className="w-32 h-32 object-cover rounded-full shadow-md"
            src={product.images[0]}
            alt={product.title}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Product Images
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className="w-24 h-24 object-cover rounded-md shadow-sm"
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800">
              Product Information
            </h3>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              Title: <span className="text-gray-800">{product.title}</span>
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              Price: <span className="text-gray-800">{product.price}</span>
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              Description:
            </p>
            <p className="text-sm text-gray-700 mt-1">{product.description}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-gray-700">
            Category: {product.category.name}
          </p>
          <img
            className="w-28 h-28 object-cover rounded-md mt-4 shadow-sm"
            src={product.category.image}
            alt={product.category.name}
          />
        </div>
      </div>
    </div>
  );
}
