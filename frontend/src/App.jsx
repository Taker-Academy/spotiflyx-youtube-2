import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';
import '../css/menu_home.css';

function App() {

  const [videos, setVideos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:8080/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.videos);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div>
      <header>
        <nav>
          <div className="app-container">
            <div className="container">
              <Link to="/" className="title">Spotiflyx</Link>
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input type="search" placeholder="Rechercher" />
              </div>
              <div className="button" onClick={toggleMenu}>
                <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
              </div>
            </div>
          </div>
        </nav>
        <div className={`menu ${menuVisible ? 'visible' : ''}`}>
          <div className="wrapper">
            <nav id="sidebar">
              <div className="title">Side Menu</div>
              <ul className="list-items">
                <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
                <li><Link to="/user/setting"><i className="fas fa-cog"></i> Parametres</Link></li>
                <li><Link to="/about"><i className="fas fa-user"></i> A propos</Link></li>
                <li><Link to="/contact"><i className="fas fa-envelope"></i> Contactez nous</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div>
        <div className='conteneur_home '>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <>
              <h1 className='list_video'>Liste des vidéos</h1>
              <div className='fond_container'>
                <div>
                  {videos.map(video => (
                    <div key={video.id}>
                      <h2 className='size_mini_title'>{video.title}</h2>
                      {video.thumbnail_url ? (
                        <img className='size_mini' src={video.thumbnail_url} alt="Miniature" />
                      ) : (
                        <p>Thumbnail not available</p>
                      )}
                      <p className='utilisateur_vidéo'>Mis en ligne par {video.uploaded_by}</p>
                      <Link to={`/videos/${video.id}`} className='title_reg button_pass_home'>Regarder</Link>
                      <div class="ligne-grise"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
