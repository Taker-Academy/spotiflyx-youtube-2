import React, { useState, useEffect } from 'react';
import '../css/login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/home';
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <title>Connexion - Spotiflyx</title>
      <img className="wave" src="../images/wave.png" alt="Wave" />
      <div className="container">
        <div className="img">
          <img src="../images/undraw_youtube_tutorial_re_69qc.svg" alt="Illustration" />
        </div>
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <img src="../images/undraw_pic_profile_re_7g2h.svg" className="avatar" alt="Avatar" />
            <h2>Se connecter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h5>E-Mail</h5>
                <input className="input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-div two">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Mot de passe</h5>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <a href="/auth/register">Pas de compte ?</a>
            <input type="submit" className="btn" value="Connexion" />
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
