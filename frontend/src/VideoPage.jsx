import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importez useParams

function VideoPage() {
  const { videoId } = useParams(); // Utilisez useParams pour obtenir les paramètres d'URL
  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videos/${videoId}`);
        const data = await response.json();
        setVideoDetails(data.video);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideoDetails();
  }, [videoId]);

  if (!videoDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{videoDetails.title}</h2>
      <iframe
        width="800"
        height="450"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {/* Ajoutez ici d'autres informations sur la vidéo */}
    </div>
  );
}

export default VideoPage;
