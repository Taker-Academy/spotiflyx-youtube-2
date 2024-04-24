const PORT = 8080;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { password, database } = require('pg/lib/defaults');
const path = require('path');

require('dotenv').config({
    override: true,
    path: path.join(__dirname, '.env')
});

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

(async () => {
    const client = await pool.connect();
    try{
        const {rows} = await client.query('SELECT current_user');
        const currentUser = rows[0]['current_user']
        console.log(currentUser);
    } catch(err) {
        console.error(err);
    } finally {
        client.release();
    }
})();

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
        // Vérifier si l'utilisateur existe déjà avec la même adresse e-mail ou le même nom d'utilisateur
        const userExistsQuery = 'SELECT * FROM userss WHERE email = $1 OR username = $2';
        const userExistsValues = [email, username];
        const userExistsResult = await pool.query(userExistsQuery, userExistsValues);
        
        if (userExistsResult.rows.length > 0) {
            // Utilisateur existe déjà avec la même adresse e-mail ou le même nom d'utilisateur
            return res.status(400).json({ ok: false, message: 'Adresse e-mail ou nom d\'utilisateur déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données
        const insertUserQuery = 'INSERT INTO userss (email, password, username) VALUES ($1, $2, $3) RETURNING *';
        const insertUserValues = [email, hashedPassword, username];
        const insertUserResult = await pool.query(insertUserQuery, insertUserValues);
        const newUser = insertUserResult.rows[0];

        // Créer un token JWT
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

server.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Rechercher l'utilisateur dans la base de données par adresse e-mail
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        // Vérifier si l'utilisateur existe
        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        const user = userResult.rows[0];
        
        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Renvoyer la réponse avec le token et les informations utilisateur
        res.status(200).json({
            ok: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la connexion de l\'utilisateur' });
    }
});


server.listen(PORT, function() {
    console.log(`working on http://localhost:${PORT}`)
});
