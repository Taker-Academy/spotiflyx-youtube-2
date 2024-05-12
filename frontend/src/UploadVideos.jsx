import React, { useState } from 'react';
// import Spotify from 'spotify-web-playback-sdk';

function VideoUploader() {
    const [videoName, setVideoName] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [message, setMessage] = useState('');
    const [isVideoChecked, setIsVideoChecked] = useState(false);
    const [isMusicChecked, setIsMusicChecked] = useState(false);
    const [spotifyLink, setSpotifyLink] = useState('');

    const handleUpload = async () => {
        if (isVideoChecked){
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
        } else if (isMusicChecked){
            playSpotifyMusic(videoLink);
        } else{
            setMessage("Veuillez sélectionner une Vidéo ou Musique.");
        }
    };

    const playSpotifyMusic = async (link) => {
        try {
            // Faites une requête GET pour récupérer le jeton d'accès depuis votre backend
            const response = await fetch('http://localhost:8080/spotify/token');
            const data = await response.json();
    
            if (response.ok) {
                const token = data.token;
    
                // Créez une nouvelle instance du lecteur Spotify Web Playback
                const player = new Spotify.Player({
                    name: 'Spotiflyx Player',
                    getOAuthToken: cb => { cb(token); }
                });
    
                // Connectez le lecteur à l'API Spotify
                player.connect().then(success => {
                    if (success) {
                        console.log('Connecté au lecteur Spotify');
    
                        // Chargez la musique à partir du lien Spotify
                        player
                            .play({
                                uris: [link]
                            })
                            .then(() => {
                                console.log('Lecture de la musique depuis Spotify');
                            })
                            .catch(error => {
                                console.error('Impossible de lire la musique:', error);
                            });
                    }
                }).catch(error => {
                    console.error('Impossible de se connecter au lecteur Spotify:', error);
                });
            } else {
                console.error('Erreur lors de la récupération du jeton Spotify:', data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du jeton Spotify:', error);
        }
    };

    return (
        <div>
            <h1>Uploader une vidéo</h1>
            <div>
                <label>Nom de la vidéo / musique : </label>
                <input type="text" value={videoName} onChange={(e) => setVideoName(e.target.value)} />
            </div>
            <div>
                <label>URL de la vidéo / musique: </label>
                <input type="text" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={isVideoChecked} onChange={() => setIsVideoChecked(!isVideoChecked)} />
                    Vidéo
                </label>
                <label>
                    <input type="checkbox" checked={isMusicChecked} onChange={() => setIsMusicChecked(!isMusicChecked)} />
                    Musique
                </label>
            </div>
            <button onClick={handleUpload}>Envoyer</button>
            <p>{message}</p>
        </div>
    );
}

export default VideoUploader;
