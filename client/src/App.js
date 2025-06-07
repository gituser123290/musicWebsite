import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { Navigate, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';
import Loading from './layouts/Loading';
import SidebarLayout from './layouts/Sidebar';
import NotFound from './layouts/NotFound';
import PlayerBar from './components/PlayerBar';
import Library from './pages/Library';

const HomePage = React.lazy(() => import('./pages/Home'));
const ServicesPage = React.lazy(() => import('./pages/Services'));
const AboutPage = React.lazy(() => import('./pages/About'));
const CreatePlayList = React.lazy(() => import('./pages/CreatePlayList'));
const ProfileUpdate = React.lazy(() => import('./AuthPage/UpdateProfile'));
const Songs = React.lazy(() => import('./components/Song/Songs'));
const AllSongs = React.lazy(() => import('./components/Song/AllSongs'));
const SongDetail = React.lazy(() => import('./components/Song/SongUpdateDelete'));
const PlaySong = React.lazy(() => import('./components/Song/PlaySong'));
const Artists = React.lazy(() => import('./components/Artist/Artists'));
const ArtistUpdateDelete = React.lazy(() => import('./components/Artist/ArtistUpdateDelete'));
const SongPage = React.lazy(() => import('./pages/SongPage'));
const ArtistPage = React.lazy(() => import('./pages/ArtistPage'));
const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));
const Album = React.lazy(() => import('./components/Album/Album'));
const AlbumUpdateDelete = React.lazy(() => import('./components/Album/AlbumUpdateDelete'));
const Profile = React.lazy(() => import('./components/Profile'));
const Playlist = React.lazy(() => import('./components/Playlists/Playlist'));
const Setting = React.lazy(() => import('./pages/Setting'));
const Login = React.lazy(() => import('./AuthPage/Login'));
const Register = React.lazy(() => import('./AuthPage/Register'));
const Search = React.lazy(() => import('./components/Search'));

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role'); // 'admin', 'user', etc.

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const loggedInUser = useCallback((status) => {
    setIsAuthenticated(status);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setIsAuthenticated(false);
  };


  const protectedRoutes = useMemo(() => [
    { path: '/', element: <HomePage /> },
    { path: '/songs', element: <Songs /> },
    { path: '/allsongs', element: <AllSongs /> },
    { path: '/songs/:id', element: <SongDetail /> },
    { path: '/song/:id/play', element: <PlaySong /> },
    { path: '/artists', element: <Artists /> },
    { path: '/artists/:id', element: <ArtistUpdateDelete /> },
    { path: '/createsong', element: <SongPage /> },
    { path: '/createartist', element: <ArtistPage /> },
    { path: '/createalbum', element: <AlbumPage /> },
    { path: '/albums', element: <Album /> },
    { path: '/albums/:id', element: <AlbumUpdateDelete /> },
    { path: '/profile', element: <Profile loggedInUser={loggedInUser} /> },
    { path: '/search', element: <Search /> },
    { path: '/library', element: <Library /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/services', element: <ServicesPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/setting', element: <Setting /> },
    { path: '/updateprofile', element: <ProfileUpdate /> },
    { path: '/createplaylist', element: <CreatePlayList /> },
    { path: '/playlists', element: <Playlist /> },
    { path: '/playlists/:id', element: <Playlist /> },
  ], [loggedInUser]);


  return (
    <>
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={!isAuthenticated ? <Login loggedInUser={loggedInUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

            <Route element={<SidebarLayout isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}>
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <PageWrapper>{element}</PageWrapper>
                    </ProtectedRoute>
                  }
                />
              ))}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    <PlayerBar />
    </>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
