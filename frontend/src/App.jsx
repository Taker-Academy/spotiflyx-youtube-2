import React, { useState } from 'react';
import '../css/home.css';
import '../css/menu_home.css';

function App() {
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