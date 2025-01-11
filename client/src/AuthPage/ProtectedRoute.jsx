import React from 'react'
import {Navigate} from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const isAuthenticated=sessionStorage.getItem('token');
    if(!isAuthenticated){
        return <Navigate to='/login'/>;
    }
  return children;
}
