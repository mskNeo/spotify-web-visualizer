import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from '../useAuth';
import TrackSearchResult from './TrackSearchResult';
import VisualDomain from './Visualizer/VisualDomain';
import '../styles/Dashboard.css';

// const { REACT_APP_CLIENT_ID } = process.env;

const spotifyApi = new SpotifyWebApi({
    clientId: '5df20bbf39b1459d83e0182097b39224',
});

export default function Dashboard({ code }) {
    const accessToken = useAuth('AQBzhMrChU-6u0tkff7omLL1vmKA0u2PZT033byaXzQn5cfl6KS29boPh6p3bI2GOK1Q_74VH0ZXSP5uAs6z-bcjfsIA4ckbT4Iq2dL5yNxjHJ5BQ1E1_t-J1fjJPxLitxLo1ffLmrlFTaZmsAYJCPhVsl5AihpEEyoMw51dUvHn-Z-KR2NBkBCKhIUvkCQc8PS_7zyO22r9E48QHp6Zj0Kls8YE_uWHGl3Zv5dfNkJMpRNR93YTPG0c0aer_0BET4QFqAz4rogOLJXNjdKcIApGhC5t');
    const [ search, setSearch ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);
    const [ playingTrack, setPlayingTrack ] = useState();
    const [ trackAnalysis, setTrackAnalysis ] = useState();
    const [ trackFeatures, setTrackFeatures ] = useState();
    const [ timings, setTimings ] = useState([]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    function getAnalysis(track) {
        const uri = track.uri.split("spotify:track:")[1];
        spotifyApi.getAudioAnalysisForTrack(uri)
            .then((data) => {
                setTrackAnalysis(data.body);
            }).catch((err) => {
                console.error(err);
            })
    }

    function getFeatures(track) {
        const uri = track.uri.split("spotify:track:")[1];
        spotifyApi.getAudioFeaturesForTrack(uri)
            .then((data) => {
                setTrackFeatures(data.body);
            }).catch((err) => {
                console.error(err);
            })
    }

    function chooseTrack(track) {
        setPlayingTrack(track);
        getAnalysis(track);
        getFeatures(track);
        setSearch('');
    }

    function deselectTrack() {
        setPlayingTrack(null);
        setTrackAnalysis(null);
        setTrackFeatures(null);
        timings.forEach(timing => clearTimeout(timing));
    }

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return;

            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImg = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image;
                            return smallest;
                        }, track.album.images[0]);

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImg.url
                    }
                })
            )
        })

        return () => cancel = true
    }, [search, accessToken]);

    return (
        <div className="dashboard">
            {playingTrack ? 
                <VisualDomain 
                    accessToken={accessToken} 
                    playingTrack={playingTrack} 
                    trackAnalysis={trackAnalysis} 
                    trackFeatures={trackFeatures} 
                    deselectTrack={deselectTrack} 
                    setTimings={setTimings}
                    />
            :
            <div>
                <Form.Control 
                    type="search" 
                    placeholder="Search Songs/Artists" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} />
                <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                    {searchResults.map(track => (
                        <TrackSearchResult 
                            track={track} 
                            key={track.uri} 
                            chooseTrack={chooseTrack}
                        />
                    ))}
                </div>
            </div>
            }   
        </div>
    )
}
