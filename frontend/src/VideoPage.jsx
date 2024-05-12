import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import de Link pour les liens internes
import axios from 'axios'; // Importation d'Axios
import '../css/home.css';
import '../css/menu_home.css';
import '../css/video_page.css';

function VideoPage() {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null); // Déclaration du state userData

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videos/${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video details');
        }
        const data = await response.json();
        setVideoDetails(data.video);
      } catch (error) {
        console.error(error);
        // Gérer l'erreur de récupération des détails de la vidéo ici
      }
    };

    const fetchData = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`http://localhost:8080/user/setting?email=${email}`);
          setUserData(response.data.data); // Définition de userData
        } catch (error) {
          setError(error.response ? error.response.data.message : error.message); // Gestion de l'erreur Axios
        }
      }
    };

    fetchVideoDetails();
    fetchData(); // Appel à fetchData pour récupérer les données utilisateur
  }, [videoId]);


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (!videoDetails) {
    return <div>Loading...</div>;
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/videos/like/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like the video');
      }

      const data = await response.json();
      setVideoDetails(prevState => ({
        ...prevState,
        likes: data.likes
      }));
    } catch (error) {
      console.error(error);
      alert('An error occurred while liking the video');
    }
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
                <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar image" />
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
                <li><Link to="/videos/upload"><i className="fas fa-video"></i> Mettre une video</Link></li>
                <li><Link to="/user/setting"><i className="fas fa-cog"></i>Paramètres</Link></li>
                <li><Link to="#"><i className="fas fa-user"></i>A propos</Link></li>
                <li><Link to="#"><i className="fas fa-envelope"></i>Contactez nous</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div> {/* Remplacez <body> par <div> */}
        <div className="conteneur">
          <div className='fond_page'>
            <h2 className='title_video'>{videoDetails.title}</h2>
            <iframe className='size_video'
              src={`https://www.youtube.com/embed/${videoDetails.youtube_id}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className='espace_video'>
              <br />
              <div className='buton_video'>
                <button onClick={handleLike}>
                  <i className="far fa-thumbs-up"></i> J'aime {videoDetails.likes}
                </button>
              </div>
              <br />
              <div className='buton_video'>
                <button>
                  <i className="fa-solid fa-thumbs-up"></i>
                </button>
              </div>
              <br />
              <div className='buton_video'>
                <button>
                  <i className="fa-regular fa-bookmark"></i>
                </button>
              </div>
              <br /> {/* Ajoutez une balise <br /> manquante */}
              <div className='buton_video'>
                <button>
                  <i className="fa-solid fa-bookmark"></i>
                </button>
              </div>
              {/* Ajoutez ici d'autres informations sur la vidéo */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
