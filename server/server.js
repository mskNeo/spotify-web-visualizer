const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();
const creds = { 
    clientId: '5df20bbf39b1459d83e0182097b39224',
    clientSecret: '2bb8612bb373402db7eb1b2eb04b2b1e',
    redirectUri: 'http://localhost:3000',
};

const PORT = 3001;

const app = express();
app.use(cors())
    .use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: `${creds.redirectUri}`,
        clientId: `${creds.clientId}`,
        clientSecret: `${creds.clientSecret}`,
        refreshToken
    });

    spotifyApi
        .refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.post('/login', (req, res) => {
    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: `${creds.redirectUri}`,
        clientId: `${creds.clientId}`,
        clientSecret: `${creds.clientSecret}`,
    });

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.listen(PORT);