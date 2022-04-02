const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

const creds = { 
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
};

const PORT = 3001;

const app = express();
app.use(cors())
    .use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "./client/build")));


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