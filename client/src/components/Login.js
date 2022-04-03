import React from 'react';
import { Container } from 'react-bootstrap';

const { REACT_APP_CLIENT_ID, REACT_APP_REDIRECT_URI } = process.env;

const scope = [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-read-playback-state'
];

// let AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=5df20bbf39b1459d83e0182097b39224&response_type=code&redirect_uri=https://spotify-web-visualizer.herokuapp.com/&show_dialog=true&scope=streaming';
let AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${REACT_APP_REDIRECT_URI}&show_dialog=true&scope=streaming`;

export default function Login() {

    for (let i = 0; i < scope.length; i++) {
        AUTH_URL = AUTH_URL + `%20${scope[i]}`;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh"}}>
            <a className="btn btn-success btn-lg" href={AUTH_URL}>Login With Spotify</a>
        </Container>
    )
}
