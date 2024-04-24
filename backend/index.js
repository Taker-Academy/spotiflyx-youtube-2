const PORT = 8080;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const { password, database } = require('pg/lib/defaults');
require('dotenv').config();

const client = new Client({
    host: "localhost",
    user: "pix_user",
    port: 5430,
    password: "pixservice123",
    database: "pix_reaction_db"
});

client.connect();

server.use(express.json());
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

server.post('/auth/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      const queryText = 'INSERT INTO userss (email, password, username) VALUES ($1, $2, $3) RETURNING *';
      const values = [email, hashedPassword, username];
      const result = await client.query(queryText, values);
      const newUser = result.rows[0];

      // Créer un token JWT
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Renvoyer la réponse avec le token et les informations utilisateur
      res.status(201).json({
          ok: true,
          data: {
              token,
              user: {
                  id: newUser.id,
                  email: newUser.email,
                  username: newUser.username,
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
