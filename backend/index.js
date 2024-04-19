const PORT = 8080;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

server.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cette adresse e-mail existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const token = jwt.sign({ userId: newUser._id }, 'votre-secret-jwt', { expiresIn: '24h' });

    res.status(201).json({
        ok: true,
        data: {
          token,
          user: {
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
          }
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

server.listen(PORT, function() {
    console.log(`working on http://localhost:${PORT}`)
});
