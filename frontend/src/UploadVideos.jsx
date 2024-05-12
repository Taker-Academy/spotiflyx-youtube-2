import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/uploadvideo.css';

function VideoUploader() {
    const [videoName, setVideoName] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [message, setMessage] = useState('');
    const [isVideoChecked, setIsVideoChecked] = useState(false);
    const [isMusicChecked, setIsMusicChecked] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:8080/user/setting?email=${email}`);
                    setUserData(response.data.data);
                } catch (error) {
                    setError(error.response ? error.response.data.message : error.message);
                }
            }
        };

        fetchData();
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleUpload = async () => {
        if (isVideoChecked) {
            const email = localStorage.getItem('email');
            try {
                const response = await fetch('http://localhost:8080/videos/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: videoName, videoLink, email })
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message);
                } else {
                    setMessage('Une erreur s\'est produite lors de l\'envoi de la vidéo.');
                    console.error(data);
                }
            } catch (error) {
                setMessage('Une erreur s\'est produite lors de l\'envoi de la vidéo.');
                console.error(error);
            }
        } else if (isMusicChecked) {
            playSpotifyMusic(videoLink);
        } else {
            setMessage("Veuillez sélectionner une Vidéo ou Musique.");
        }
    };

    const playSpotifyMusic = async (link) => {
        // Implémentez la fonction de lecture de la musique Spotify si nécessaire
    };

    return (
        <div>
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
                                <li><Link to="/videos/upload"><i className="fas fa-video"></i> Mettre une video</Link></li>
                                <li><Link to="/user/setting"><i className="fas fa-cog"></i> Paramètres</Link></li>
                                <li><Link to="/about"><i className="fas fa-user"></i> À propos</Link></li>
                                <li><Link to="/contact"><i className="fas fa-envelope"></i> Contactez nous</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            <div className='conteneur_upload'>
                <h1 className='text_upload'>Uploader une vidéo</h1>
                <div className='fond_video'>
                    <p className='text_upload'>Nom de la vidéo / musique</p>
                    <input type="text" className='nav_video' value={videoName} onChange={(e) => setVideoName(e.target.value)} />
                    <p className='text_upload'>URL de la vidéo / musique</p>
                    <input type="text" className='nav_video' value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
                    <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" checked={isVideoChecked} onChange={() => setIsVideoChecked(!isVideoChecked)} />
                        <span className="checkbox-custom"></span>
                        <span>Vidéo</span>
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" checked={isMusicChecked} onChange={() => setIsMusicChecked(!isMusicChecked)} />
                        <span className="checkbox-custom"></span>
                        <span>Musique</span>
                    </label>
                    <button className='title_reg button_pass_home' onClick={handleUpload}>Envoyer</button>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoUploader;
