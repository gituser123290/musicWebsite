import { useState,useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {BrowserRouter ,Routes,Route} from 'react-router-dom';
import './index.css';
import Navbar from './layouts/Navbar';
import Artists from './components/Artists';
import PopularSong from './components/PopularSong';
import Album from './components/Album';
import NotFound from './components/NotFound';
import Products from './components/Products';
import Users from './components/Users';
import SongDetail from './components/SongUpdateDelete';
import ArtistUpdateDelete from './components/ArtistUpdateDelete';
import ProductDetail from './components/ProductDetail';
import PlaySong from './components/PlaySong';
import SongPage from './pages/SongPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import ProtectedRoute from './AuthPage/ProtectedRoute'
import Songs from './components/Songs';
import Login from './AuthPage/Login';
import Register from './AuthPage/Register';
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

        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login loggedInUser={loggedInUser} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/loading' element={<Loading/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}
export default App;
