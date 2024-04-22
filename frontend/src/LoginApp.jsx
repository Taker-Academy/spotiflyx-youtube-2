import React, { useEffect } from 'react';

function LoginPage() {
  useEffect(() => {
    const inputs = document.querySelectorAll('.input');

    function focusFunc() {
      let parent = this.parentNode.parentNode;
      parent.classList.add('focus');
    }

    function blurFunc() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove('focus');
      }
    }

    inputs.forEach(input => {
      input.addEventListener('focus', focusFunc);
      input.addEventListener('blur', blurFunc);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', focusFunc);
        input.removeEventListener('blur', blurFunc);
      });
    };
  }, []);

  return (
    <>
      <img className="wave" src="../images/wave.png" alt="Wave" />
      <div className="container">
        <div className="img">
          <img src="../images/undraw_youtube_tutorial_re_69qc.svg" alt="Illustration" />
        </div>
        <div className="login-container">
          <form action="login.html">
            <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
            <h2>Se connecter</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h5>E-Mail</h5>
                <input className="input" type="text" />
              </div>
            </div>
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Mot de passe</h5>
                <input className="input" type="password" />
              </div>
            </div>
            <a href="create_account.html">Pas de compte ?</a>
            <input type="submit" className="btn" value="Connexion" />
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
