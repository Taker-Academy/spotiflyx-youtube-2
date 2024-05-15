import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserFavorite() {
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchFavoriteVideos = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`http://localhost:8080/user/favorites?email=${email}`);
          setFavoriteVideos(response.data.videos);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchFavoriteVideos();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <title>Favoris - Spotiflyx</title>
      <header>
        <nav>
          <div className="app-container">
            <div className="container">
              <Link to="/home" className="title">Spotiflyx</Link>
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
              <div className="title">{userData ? userData.username : ''}</div>
              <ul className="list-items">
                <li><Link to="/home"><i className="fas fa-home"></i> Accueil</Link></li>
                <li><Link to="/videos/upload"><i className="fas fa-video"></i>Mettre du contenue</Link></li>
                <li><Link to="/user/setting"><i className="fas fa-cog"></i>Mon compte</Link></li>
                <li><Link to="/user/favorite"><i className="fa-solid fa-bookmark"></i>Mes favoris</Link></li>
                <li><Link to="#"><i className="fas fa-user"></i>A propos</Link></li>
                <li><Link to="/contact"><i className="fas fa-envelope"></i>Contactez nous</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div>
        <h1>Mes vidéos favorites</h1>
        <ul>
          {favoriteVideos.map(video => (
            <li key={video.id}>
              <p>{video.title}</p>
              <img src={video.thumbnail_url} alt={video.title} width={500}/>
              <p>{video.uploaded_by}</p>
              <Link to={`/videos/${video.id}`} className='title_reg button_pass_home'>Regarder</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default UserFavorite;
