import React, { useState, useEffect } from 'react';
import '../css/setting_user.css';


function setting() {

  return (
    <div>
    <header class='header_setting'>
        <h1 class='title_setting'>Profile</h1>
        <a href="#" className="title">Spotiflyx</a>
    </header>
    <body>
      <div class='block_profil'>
        <h2 class='title_user'>Comptes d'utilisateurs</h2>
        <div class='profil_user'>
          <div class='block_user'>
            <img src="../images/undraw_pic_profile_re_7g2h.svg" class="avatar" alt="Avatar" />
            <p></p>
            </div>
        </div>
      </div>
    </body>
    </div>
  );
}

export default setting;
