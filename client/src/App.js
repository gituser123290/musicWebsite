import React, { useState, useEffect, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Layouts and Components
import Navbar from './layouts/Navbar'
import Loading from './layouts/Loading';

// Pages
import ServicesPage from './pages/Services';
import ProfileUpdate from './AuthPage/UpdateProfile';
import AboutPage from './pages/About';
import HomePage from './pages/Home';
import NotFound from './layouts/NotFound';
import CreatePlayList from './pages/CreatePlayList';

// Lazy-loaded components
const Artists = React.lazy(() => import('./components/Artist/Artists'));
const AlbumUpdateDelete = React.lazy(() => import('./components/Album/AlbumUpdateDelete'));
const Album = React.lazy(() => import('./components/Album/Album'));
const Profile = React.lazy(() => import('./components/Profile'));
const AllSongs = React.lazy(() => import('./components/Song/AllSongs'));
const SongDetail = React.lazy(() => import('./components/Song/SongUpdateDelete'));
const ArtistUpdateDelete = React.lazy(() => import('./components/Artist/ArtistUpdateDelete'));
const PlaySong = React.lazy(() => import('./components/Song/PlaySong'));
const SongPage = React.lazy(() => import('./pages/SongPage'));
const ArtistPage = React.lazy(() => import('./pages/ArtistPage'));
const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));
const ProtectedRoute = React.lazy(() => import('./AuthPage/ProtectedRoute'));
const Songs = React.lazy(() => import('./components/Song/Songs'));
const Login = React.lazy(() => import('./AuthPage/Login'));
const Register = React.lazy(() => import('./AuthPage/Register'));
const Playlist = React.lazy(() => import('./components/Playlists/Playlist'));
const Setting= React.lazy(() => import('./pages/Setting'))

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const loggedInUser = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const protectedRoutes = [
    { path: '/songs', element: <Songs /> },
    { path: '/profile', element: <Profile loggedInUser={loggedInUser} /> },
    { path: '/songs/:id', element: <SongDetail /> },
    { path: '/allsongs', element: <AllSongs /> },
    { path: '/song/:id/play', element: <PlaySong /> },
    { path: '/artists', element: <Artists /> },
    { path: '/artists/:id/', element: <ArtistUpdateDelete /> },
    { path: '/createsong', element: <SongPage /> },
    { path: '/createartist', element: <ArtistPage /> },
    { path: '/createalbum', element: <AlbumPage /> },
    { path: '/albums', element: <Album /> },
    { path: '/albums/:id', element: <AlbumUpdateDelete /> },
    { path: '/playlists', element: <Playlist /> },
    { path: '/services', element: <ServicesPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/updateprofile', element: <ProfileUpdate /> },
    { path: '/setting', element: <Setting /> },
    { path: '/createplaylist', element: <CreatePlayList /> },
  ];

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes */}
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
          ))}

          {/* Auth Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login loggedInUser={loggedInUser} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
