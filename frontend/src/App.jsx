import React from 'react';
import '../css/home.css'

function App() {
  return (
    <nav>
      <div className="app-container">
        <div className="container">
          <a href="#" className="title">Spotiflyx</a>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="search" placeholder="Rechercher" />
          </div>
          <div className="button">
            <a className="link" href="login.html">Connexion</a>
            <button className="btn" onClick={() => window.location.href='../html/create_account.html'}>
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default App;
