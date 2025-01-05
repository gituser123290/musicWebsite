import Songs from './components/Songs';
import './index.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
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
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Songs />} />
          <Route path="/song/:id/" element={<SongDetail />} />
          <Route path="/song/:id/play/" element={<PlaySong />} />
          <Route path="/products/" element={<Products />} />
          <Route path="/product/:id/" element={<ProductDetail />} />
          <Route path="/artist/" element={<Artists />} />
          <Route path="/artist/:id/" element={<ArtistUpdateDelete />} />
          <Route path="/users/" element={<Users />} />
          <Route path="/createsong" element={<SongPage />} />
          <Route path="/createartist" element={<ArtistPage />} />
          <Route path="/createalbum" element={<AlbumPage />} />
          <Route path="/album/" element={<Album />} />
          <Route path="/popular_song/" element={<PopularSong />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
