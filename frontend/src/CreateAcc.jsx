import React, { useEffect } from 'react';

function CreateAcc() {
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
          <img src="../images/undraw_sign_up_n6im.svg" alt="Illustration" />
        </div>
        <div className="login-container">
          <form action="login.html">
            <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
            <h2>Créer un compte</h2>
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h5>Nom d'utilisateur</h5>
                <input className="input" type="text" />
              </div>
            </div>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-envelope"></i>
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
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Confirmer le mot de passe</h5>
                <input className="input" type="password" />
              </div>
            </div>
            <a href="login.html">Déjà un compte ?</a>
            <input type="submit" className="btn" value="Créer le compte" />
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateAcc;
