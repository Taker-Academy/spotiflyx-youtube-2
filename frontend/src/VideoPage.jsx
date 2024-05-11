import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function VideoPage() {
  const { videoId } = useParams();
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
      <h2>{videoDetails.title}</h2>
      <iframe
        width="800"
        height="450"
        src={`https://www.youtube.com/embed/${videoDetails.youtube_id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <br></br>
      <i className="fa-regular fa-thumbs-up"></i>
      <button onClick={handleLike}>J'aime ({videoDetails.likes})</button> {/* Afficher le nombre de likes */}
      <br></br>
      <i className="fa-solid fa-thumbs-up"></i>
      <br></br>
      <i className="fa-regular fa-bookmark"></i>
      <br></br>
      <i className="fa-solid fa-bookmark"></i>
      {/* Ajoutez ici d'autres informations sur la vidéo */}
    </div>
  );
}

export default VideoPage;
