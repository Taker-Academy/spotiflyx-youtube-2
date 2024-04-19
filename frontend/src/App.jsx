import React from 'react';
import '../css/home.css'

function App() {
  return (
    <nav>
      <div className="container">
        <a href="#" className="title">Spotiflyx</a>
        <div className="search-bar">
          <i className="fas fa-search"></i> {/* Utilisez la classe FontAwesome appropriée */}
          <input type="search" placeholder="Rechercher" />
        </div>
        <div className="button">
          <a className="link" href="login.html">Connexion</a>
          <button className="btn" onClick={() => window.location.href='/frontend/html/login/create_account.html'}>
            Créer un compte
          </button>
        </div>
      </div>
    </nav>
  );
}

export default App;
