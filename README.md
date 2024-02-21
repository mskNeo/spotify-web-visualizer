# Spotify Web Visualizer

My senior thesis project. This is a web application developed with React and NodeJS. `node` and `npm` are needed to run the project.

## Client
Frontend React application. This is where the visualizer lives.

## Server
NodeJS application. This is how the application can connect to the Spotify API and get the data necessary for the visualizer.

## Setup
Run `npm install` in the `client` and server folders separately to get all of the dependencies necessary to run the project.
Need two `.env` files in the root directory and the client directory.

Root directory `.env`
```
CLIENT_ID={Client ID from Spotify Dev}
CLIENT_SECRET={Client Secret from Spotify Dev}
REDIRECT_URI=http://localhost:3000
```

Client directory `.env`
```
REACT_APP_CLIENT_ID={Client ID from Spotify Dev}
REACT_APP_REDIRECT_URI=http://localhost:3000
```

## Running Server
Run `npm run dev` in the `server` folder in a terminal window/tab to establish the connection with the Spotify API. This needs to happen before running the frontend client.

## Running Frontend Client
Run `npm start` inside the client folder in a separate terminal window/tab to run the frontend project. Do this while running the server. You will need to log in with a Spotify Account. You can simply use mine. The email is `mahdeen.s.khan@yale.edu` and the password is `shahdat99`. *Please don't share with others.*