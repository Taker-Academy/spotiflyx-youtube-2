import React, { useState, useRef } from 'react';
import '../css/home.css';
import '../css/menu_home.css';

function App() {
  const [image, setImage] = useState('../images/undraw_pic_profile_re_7g2h.svg');
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
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
              <div className="button">
                <form action="/user/profilePicture" method="post" encType="multipart/form-data">
                  <input ref={inputRef} type="file" name="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </form>
                <img src={image} className="avatar" alt="Avatar" onClick={handleImageClick} />
              </div>
            </div>
          </div>
        </nav>
        <div className="menu">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="title">Side Menu</div>
              <ul className="list-items">
                  <li><a href="#"><i className="fas fa-home">Home</i></a></li>
                  <li><a href="#"><i className="fas fa-cog">Parametres</i></a></li>
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
