import React, { useState } from 'react';

function VideoUploader() {
    const [email, setEmail] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [message, setMessage] = useState('');
    const [videoId, setVideoId] = useState('');

    const handleUpload = async () => {
        try {
            const response = await fetch('http://localhost:8080/videos/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, videoLink })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Extraire l'ID de la vidéo de la réponse et l'afficher
                const videoId = extractVideoId(videoLink);
                setVideoId(videoId);
            } else {
                setMessage('Une erreur s\'est produite lors de l\'envoi de la vidéo.');
                console.error(data);
            }
        } catch (error) {
            setMessage('Une erreur s\'est produite lors de l\'envoi de la vidéo.');
            console.error(error);
        }
    };

    // Fonction pour extraire l'ID de la vidéo YouTube à partir du lien
    const extractVideoId = (videoLink) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = videoLink.match(regex);
        return match && match[1];
    };

    return (
        <div>
            <h1>Uploader une vidéo</h1>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>URL de la vidéo YouTube:</label>
                <input type="text" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
            </div>
            <button onClick={handleUpload}>Envoyer</button>
            <p>{message}</p>
        </div>
    );
}

export default VideoUploader;
