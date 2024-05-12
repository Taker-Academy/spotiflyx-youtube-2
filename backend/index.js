const PORT = 8080;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { password, database } = require('pg/lib/defaults');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyDKmLO7lPCyJLKxZK8ulB0V6nBo-nl0hbw'
});

//Emails
const htmlContent = fs.readFileSync('CreateAccEmail.html', 'utf8');
const htmlDelAccEmail = fs.readFileSync('DeleteAccEmail.html', 'utf8');
const htmlChangePassEmail = fs.readFileSync('ChangePasswordEmail.html', 'utf8');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "spotiflyx.taker@gmail.com",
    pass: "jorg smvj laod lvha",
  },
});

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
        const userExistsQuery = 'SELECT * FROM userss WHERE email = $1 OR username = $2';
        const userExistsValues = [email, username];
        const userExistsResult = await pool.query(userExistsQuery, userExistsValues);

        if (userExistsResult.rows.length > 0) {
            return res.status(400).json({ ok: false, message: 'Adresse e-mail ou nom d\'utilisateur déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = 'INSERT INTO userss (email, password, username) VALUES ($1, $2, $3) RETURNING *';
        const insertUserValues = [email, hashedPassword, username];
        const insertUserResult = await pool.query(insertUserQuery, insertUserValues);
        const newUser = insertUserResult.rows[0];

        const info = await transporter.sendMail({
          from: '"Spotiflyx" <spotiflyx.taker@gmail.com>',
          to: email,
          subject: `Bienvenue sur notre plateforme ${username}!`,
          text: `Bonjour ${username},\n\nVotre compte a été créé avec succès.`,
          html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);

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
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        const user = userResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

server.delete('/user/remove', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Assurez-vous que l'utilisateur existe
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        const user = userResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail ou mot de passe incorrect' });
        }

        // Supprimez l'utilisateur de la base de données
        const deleteUserQuery = 'DELETE FROM userss WHERE email = $1';
        await pool.query(deleteUserQuery, [email]);

        const info = await transporter.sendMail({
            from: '"Spotiflyx" <spotiflyx.taker@gmail.com>',
            to: email,
            subject: "Confirmation de suppression de compte Spotiflyx",
            text: `Votre compte a été supprimé avec succès.`,
            html: htmlDelAccEmail,
        });

        console.log("Message sent: %s", info.messageId);

        res.status(200).json({
            ok: true,
            message: 'Utilisateur supprimé avec succès',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
});

server.put('/user/edit', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        // Recherche de l'utilisateur dans la base de données
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail incorrecte' });
        }

        const user = userResult.rows[0];

        // Vérification si l'ancien mot de passe correspond
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, message: 'Ancien mot de passe incorrect' });
        }

        // Mise à jour du mot de passe dans la base de données
        const updatePasswordQuery = 'UPDATE userss SET password = $1 WHERE email = $2';
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(updatePasswordQuery, [hashedNewPassword, email]);

        const info = await transporter.sendMail({
            from: '"Spotiflyx" <spotiflyx.taker@gmail.com>',
            to: email,
            subject: "Confirmation du changement de votre mot de passe Spotiflyx",
            text: `Votre mot de passe a était modifié avec succès.`,
            html: htmlChangePassEmail,
        });

        console.log("Message sent: %s", info.messageId);

        res.status(200).json({
            ok: true,
            message: 'Mot de passe modifié avec succès',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la modification du mot de passe' });
    }
});

server.get('/user/setting', async (req, res) => {
    const { email } = req.query;

    try {
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail incorrecte' });
        }

        const user = userResult.rows[0];

        res.status(200).json({
            ok: true,
            data: {
              email: user.email,
              username: user.username
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la récupération des informations utilisateur' });
    }
});
const multer = require('multer');

// Configuration de Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Endpoint pour enregistrer l'image de profil de l'utilisateur
server.post('/user/profilePicture', upload.single('file'), async (req, res) => {
    const { email } = req.body;
    try {
        // Mettre à jour le chemin de l'image dans la base de données pour l'utilisateur correspondant à l'email
        const updateQuery = 'UPDATE userss SET profile_picture = $1 WHERE email = $2';
        await pool.query(updateQuery, [req.file.path, email]);

        res.status(200).json({ ok: true, message: 'Image de profil mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la mise à jour de l\'image de profil' });
    }
});

// Endpoint pour récupérer l'image de profil de l'utilisateur
server.get('/user/profilePicture', async (req, res) => {
    const { email } = req.body;
    try {
        const selectQuery = 'SELECT profile_picture FROM userss WHERE email = $1';
        const result = await pool.query(selectQuery, [email]);

        if (result.rows.length === 0 || !result.rows[0].profile_picture) {
            return res.status(404).json({ ok: false, message: 'Image de profil non trouvée' });
        }

        res.sendFile(result.rows[0].profile_picture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la récupération de l\'image de profil' });
    }
});

server.post('/videos/upload', async (req, res) => {
    const { title, videoLink, email } = req.body;

    try {
        const userQuery = 'SELECT * FROM userss WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ ok: false, message: 'Adresse e-mail incorrecte' });
        }

        const user = userResult.rows[0];

        const videoId = extractVideoId(videoLink);
        const videoDetails = await getVideoDetails(videoId);

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const insertVideoQuery = `
            INSERT INTO videos (title, description, thumbnail_url, video_url, uploaded_by, youtube_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const insertVideoValues = [
            title,
            videoDetails.description,
            thumbnailUrl,
            `https://www.youtube.com/watch?v=${videoId}`,
            user.username,
            videoId
        ];
        const insertVideoResult = await pool.query(insertVideoQuery, insertVideoValues);

        res.status(200).json({ ok: true, message: 'Vidéo ajoutée avec succès', videoDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de l\'ajout de la vidéo' });
    }
});

function extractVideoId(videoLink) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoLink.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error('Lien YouTube invalide');
    }
}

async function getVideoDetails(videoId) {
    const response = await youtube.videos.list({
        part: 'snippet',
        id: videoId
    });
    
    const videoDetails = response.data.items[0].snippet;
    return videoDetails;
}

server.get('/videos', async (req, res) => {
    try {
        const selectVideosQuery = 'SELECT * FROM videos';
        const videosResult = await pool.query(selectVideosQuery);

        res.status(200).json({ ok: true, videos: videosResult.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la récupération des vidéos' });
    }
});

server.get('/videos/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const selectVideoQuery = 'SELECT * FROM videos WHERE id = $1';
        const videoResult = await pool.query(selectVideoQuery, [videoId]);

        if (videoResult.rows.length === 0) {
            return res.status(404).json({ ok: false, message: 'Vidéo introuvable' });
        }

        // Si une vidéo est trouvée, renvoyer les détails de la vidéo
        res.status(200).json({ ok: true, video: videoResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la récupération de la vidéo' });
    }
});

server.post('/videos/like/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const selectVideoQuery = 'SELECT * FROM videos WHERE id = $1';
        const videoResult = await pool.query(selectVideoQuery, [videoId]);
        const selectLikesCountQuery = 'SELECT likes FROM videos WHERE id = $1';

        if (videoResult.rows.length === 0) {
            return res.status(404).json({ ok: false, message: 'Vidéo introuvable' });
        }
        // Incrémente le nombre de likes pour la vidéo
        const incrementLikesQuery = 'UPDATE videos SET likes = likes + 1 WHERE id = $1';
        await pool.query(incrementLikesQuery, [videoId]);

        // Récupère le nouveau nombre de likes pour la vidéo
        const updatedVideoResult = await pool.query(selectVideoQuery, [videoId]);
        const newLikesCount = updatedVideoResult.rows[0].likes;

        res.status(200).json({ ok: true, likes: newLikesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: `Erreur lors de l'incrémentation du nombre de likes` });
    }
});

server.get('/spotify/token', async (req, res) => {
    try {
        const token = await _getToken();
        res.status(200).json({ ok: true, token });
    } catch (error) {
        console.error('Erreur lors de la récupération du jeton Spotify:', error);
        res.status(500).json({ ok: false, message: 'Erreur lors de la récupération du jeton Spotify' });
    }
});

const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
};

server.listen(PORT, function() {
    console.log(`working on http://localhost:${PORT}`)
});
