import React , { useState, useEffect, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './layouts/Navbar';
import Loading from './layouts/Loading';
// import Footer from './layouts/Footer';



// Lazy loading components
const Artists = React.lazy(() => import('./components/Artist/Artists'));
const AlbumUpdateDelete=React.lazy(() => import('./components/Album/AlbumUpdateDelete'));
const Album = React.lazy(() => import('./components/Album/Album'));
const NotFound = React.lazy(() => import('./layouts/NotFound'));
const Profile = React.lazy(() => import('./components/Profile'));
const AllSongs = React.lazy(() => import('./components/Song/AllSongs'));
const SongDetail = React.lazy(() => import('./components/Song/SongUpdateDelete'));
const ArtistUpdateDelete = React.lazy(() => import('./components/Artist/ArtistUpdateDelete'));
const ProductDetail = React.lazy(() => import('./components/Others/ProductDetail'));
const PlaySong = React.lazy(() => import('./components/Song/PlaySong'));
const SongPage = React.lazy(() => import('./pages/SongPage'));
const ArtistPage = React.lazy(() => import('./pages/ArtistPage'));
const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));
const ProtectedRoute = React.lazy(() => import('./AuthPage/ProtectedRoute'));
const Songs = React.lazy(() => import('./components/Song/Songs'));
const Login = React.lazy(() => import('./AuthPage/Login'));
const Register = React.lazy(() => import('./AuthPage/Register'));
const Author = React.lazy(() => import('./components/Book/Author'));
const AuthorDetail = React.lazy(() => import('./components/Book/AuthorDetail'));
const Book = React.lazy(() => import('./components/Book/Book'));
const Playlist = React.lazy(() => import('./components/Playlists/Playlist'));


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

  return (
    <>
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Songs />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile loggedInUser={loggedInUser} />
              </ProtectedRoute>
            } />

            <Route path="/songs/:id/" element={
              <ProtectedRoute>
                <SongDetail />
              </ProtectedRoute>
            } />

            <Route path="/all-songs" element={
              <ProtectedRoute>
                <AllSongs />
              </ProtectedRoute>
            } />

            <Route path="/song/:id/play/" element={
              <ProtectedRoute>
                <PlaySong />
              </ProtectedRoute>
            } />

            <Route path="/product/:id/" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />

            <Route path="/artist/" element={
              <ProtectedRoute>
                <Artists />
              </ProtectedRoute>
            } />

            <Route path="/artist/:id/" element={
              <ProtectedRoute>
                <ArtistUpdateDelete />
              </ProtectedRoute>
            } />


            <Route path="/createsong" element={
              <ProtectedRoute>
                <SongPage />
              </ProtectedRoute>
            } />

            <Route path="/createartist" element={
              <ProtectedRoute>
                <ArtistPage />
              </ProtectedRoute>
            } />

            <Route path="/createalbum" element={
              <ProtectedRoute>
                <AlbumPage loggedInUser={loggedInUser} />
              </ProtectedRoute>
            } />

            <Route path="/album/" element={
              <ProtectedRoute>
                <Album />
              </ProtectedRoute>
            } />
            <Route path="/albums/:id/" element={
              <ProtectedRoute>
                <AlbumUpdateDelete />
              </ProtectedRoute>
            } />

            <Route path="/playlist/" element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            } />
            <Route path="author">
              <Route path="authors" element={<Author />} />
              <Route path="books" element={<Book />} />
            </Route>

            <Route path="/author/:id" element={<AuthorDetail />} />

            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login loggedInUser={loggedInUser} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
}

export default App;
