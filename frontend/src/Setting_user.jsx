import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/setting_user.css';
import '../css/home.css';
import '../css/menu_home.css';

function SettingUser() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`http://localhost:8080/user/setting?email=${email}`);
          setUserData(response.data.data);
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    try {
      const response = await axios.put('http://localhost:8080/user/edit', {
        email,
        oldPassword,
        newPassword,
      });
      console.log(response.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <header>
        <nav>
          <div className="app-container">
            <div className="container">
              <a href="javascript:void(0)" className="title">Spotiflyx</a>
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
              <div className="title">{userData ? userData.username : ''}</div>
              <ul className="list-items">
                <li><a href="/home"><i className="fas fa-home"></i>Home</a></li>
                <li><a href="/videos/upload"><i className="fas fa-video"></i>Mettre une video</a></li>
                <li><a href="/user/setting"><i className="fas fa-cog"></i>Paramètres</a></li>
                <li><a href="#"><i className="fas fa-user"></i>A propos</a></li>
                <li><a href="#"><i className="fas fa-envelope"></i>Contactez nous</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="page-content page-container" id="page-content">
        <div className="padding">
          <div className="row container_setting">
            <div className="col-xl-6 col-md-12">
              <div className="card user-card-full">
                <div className="row m-l-0 m-r-0">
                  <div className="col-sm-4 bg-c-lite-green user-profile">
                    <div className="card-block text-center text-white">
                      <div className="m-b-25">
                        <img src="https://img.icons8.com/bubbles/100/000000/user.png" className="img-radius" alt="User Profile Image" />
                      </div>
                      <h6 className="f-w-600">{userData ? userData.name : ''}</h6>
                      <p className='profil_username'>{userData ? userData.username : ''}</p>
                      <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card-block">
                      <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-600">Email</p>
                          <h6 className="text-muted f-w-400">{userData ? userData.email : ''}</h6>
                        </div>
                      </div>
                      <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Mot de Passe</h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-600">Changer le mot de passe</p>
                          <form onSubmit={handleSubmit}>
                            <div className="pass-bar">
                                <input
                                  type="password"
                                  placeholder="Ancien mot de passe"
                                  value={oldPassword}
                                  onChange={handleOldPasswordChange}
                                  required
                                />
                              </div>
                            <div className="pass-bar">
                              <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                required
                              />
                            </div>
                            <div class='button_pass'>
                              <button type="submit">Changer le mot de passe</button>
                            </div>
                            <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Connection</h6>
                            <div className="row">
                            <div className="col-sm-6">
                                <a href="/auth/login" className='lien_user'>Se déconnecter</a>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingUser;
