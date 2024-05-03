import React from 'react';
import '../css/home.css';
import '../css/menu_home.css';

function App() {
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
                <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
              </div>
            </div>
          </div>
        </nav>
      </header>
      <body>
        <div className="wrapper">
          <nav id="sidebar">
            <div className="title">Side Menu</div>
            <ul className="list-items">
                <li><a href="#"><i className="fas fa-home">Home</i></a></li>
                <li><a href="#"><i className="fas fa-sliders-h">Clients</i></a></li>
                <li><a href="#"><i className="fas fa-address-book">Services</i></a></li>
                <li><a href="#"><i className="fas fa-cog">Settings</i></a></li>
                <li><a href="#"><i className="fas fa-stream">Features</i></a></li>
                <li><a href="#"><i className="fas fa-user">About us</i></a></li>
                <li><a href="#"><i className="fas fa-globe-asia">Languages</i></a></li>
                <li><a href="#"><i className="fas fa-envelope">Contact us</i></a></li>
            </ul>
          </nav>
        </div>
      </body>
    </div>
  );
}

export default App;
