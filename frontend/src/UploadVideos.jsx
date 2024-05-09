import React, { useState } from 'react';

function VideoUploader() {
    const [videoName, setVideoName] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
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
    };

    return (
        <div>
            <h1>Uploader une vidéo</h1>
            <div>
                <label>Nom de la vidéo:</label>
                <input type="text" value={videoName} onChange={(e) => setVideoName(e.target.value)} />
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
