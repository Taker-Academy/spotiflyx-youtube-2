import React, { useState, useEffect } from 'react';
import '../css/create_account.css';

function CreateAcc() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du compte");
      }

      window.location.href = '/auth/login';
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

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
      <title>Créer mon compte - Spotiflyx</title>
      <img className="wave" src="../images/wave.png" alt="Wave" />
      <div className="container">
        <div className="img">
          <img src="../images/undraw_sign_up_n6im.svg" alt="Illustration" />
        </div>
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
            <h2>Créer un compte</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h5>Nom d'utilisateur</h5>
                <input className="input" type="text" name="username" value={formData.username} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h5>E-Mail</h5>
                <input className="input" type="text" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Mot de passe</h5>
                <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Confirmer le mot de passe</h5>
                <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <a href="/auth/login">Déjà un compte ?</a>
            <input type="submit" className="btn" value="Créer le compte" />
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateAcc;
