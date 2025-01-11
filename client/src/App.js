import { useState,useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {BrowserRouter ,Routes,Route} from 'react-router-dom';
import './index.css';
import Navbar from './layouts/Navbar';
import Artists from './components/Artist/Artists';
import PopularSong from './components/Song/PopularSong';
import Album from './components/Album/Album';
import NotFound from './layouts/NotFound';
import Products from './components/Others/Products';
import Users from './components/Others/Users';
import SongDetail from './components/Song/SongUpdateDelete';
import ArtistUpdateDelete from './components/Artist/ArtistUpdateDelete';
import ProductDetail from './components/Others/ProductDetail';
import PlaySong from './components/Song/PlaySong';
import SongPage from './pages/SongPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import ProtectedRoute from './AuthPage/ProtectedRoute'
import Songs from './components/Song/Songs';
import Login from './AuthPage/Login';
import Register from './AuthPage/Register';
import Author from './components/Book/Author';
import AuthorDetail from './components/Book/AuthorDetail';
import Book from './components/Book/Book'

import Loading from './layouts/Loading';

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
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout}  />
      <Routes>
          <Route path="/"
            element={
              <ProtectedRoute>
                <Songs />
              </ProtectedRoute>
            }
        />

        {/* <Route path="/createpost"
          element={
            <ProtectedRoute>
              <CreatePost loggedInUser={loggedInUser} />
            </ProtectedRoute>
          }
        /> */}
          <Route path="/song/:id/" element={
            <ProtectedRoute>
              <SongDetail />
            </ProtectedRoute>
          }
          />
          <Route path="/song/:id/play/" element={
           <ProtectedRoute>
              <PlaySong />
           </ProtectedRoute>
          } />
          <Route path="/products/" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/product/:id/" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } 
            />
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
          <Route path="/users/" element={
            <ProtectedRoute>
            <Users />
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
            <AlbumPage />
          </ProtectedRoute>
          } />
          <Route path="/album/" element={
            <ProtectedRoute>
            <Album />
          </ProtectedRoute>
          } />
          <Route path="/popular_song/" element={
            <ProtectedRoute>
            <PopularSong />
          </ProtectedRoute>
          } />

          <Route path="author">
            <Route path="authors" element={
                <Author />
              } />
            <Route path="books" element={<Book/>} /> 
          </Route>
          <Route path="/author/:id" element={
                <AuthorDetail />
              } /> 
          <Route path='/loading' element={<Loading/>}/>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login loggedInUser={loggedInUser} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
export default App;
