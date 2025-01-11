import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';


export default function AuthorDetail() {
    const { id } = useParams()
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await api.get(`/book/author/${id}/detail/`);
                setAuthor(response.data);
            } catch (err) {
                    setError(err?.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthor();
    }, [id, navigate]);
    // 

    const handleDelete = async () => {
        try {
            await api.delete(`/book/author/${id}/detail/`)
            setAuthor(null);
            navigate('/author/authors')
        } catch (error) {
            setError(error?.response?.data?.message);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if(!author) return <p>No Author Found</p>

    return (
        <div>
            <h2>{author.name}</h2>
            <p>{author.bio}</p>
            <button onClick={() => handleDelete(author.id)} >
                delete
            </button>
        </div>
    );
}


