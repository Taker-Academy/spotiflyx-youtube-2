-- Create the pix_user database
CREATE DATABASE pix_user;

-- Connect to the pix_user database
\c pix_user

-- Create the videos table
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    youtube_id VARCHAR(255) NOT NULL
);

-- Create the user_favorites table
CREATE TABLE user_favorites (
    user_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES userss(id),
    FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Create the userss table
CREATE TABLE userss (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
