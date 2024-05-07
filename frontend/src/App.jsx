import React, { useState, useEffect } from 'react';
import '../css/home.css';
import '../css/menu_home.css';

function VideoPlayer({ videoId }) {
  return (
      <div>
          <h2>Lecture de la vidéo</h2>
          <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
          ></iframe>
      </div>
  );
}

function App() {

  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
      fetchVideos();
  }, []);
  const fetchVideos = async () => {
      try {
          const response = await fetch('http://localhost:8080/videos');
          const data = await response.json();
          setVideos(data.videos);
      } catch (error) {
          console.error(error);
      }
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div>
      <header>
        <nav>
          <div className="app-container">
            <div className="container">
              <a href="#" className="title">Spotiflyx</a>
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
        <div>
            <h1>Liste des vidéos</h1>
            <div>
                {videos.map(video => (
                    <div key={video.id}>
                        <h2>{video.title}</h2>
                        <p>Ajoutée par : {video.uploaded_by}</p>
                        <button onClick={() => setSelectedVideoId(video.id)}>Regarder</button>
                    </div>
                ))}
                {selectedVideoId && <VideoPlayer videoId={selectedVideoId} />}
            </div>
        </div>
        <div className={`menu ${menuVisible ? 'visible' : ''}`}>
          <div className="wrapper">
            <nav id="sidebar">
              <div className="title">Side Menu</div>
              <ul className="list-items">
                  <li><a href="#"><i className="fas fa-home">Home</i></a></li>
                  <li><a href="/user/setting"><i className="fas fa-cog">Parametres</i></a></li>
                  <li><a href="#"><i className="fas fa-user">A propos</i></a></li>
                  <li><a href="#"><i className="fas fa-envelope">Contactez nous</i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
