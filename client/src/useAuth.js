import { useState, useEffect } from 'react'
import axios from 'axios';

export default function useAuth(code) {
    const [ accessToken, setAccessToken ] = useState()
    const [ refreshToken, setRefreshToken ] = useState()
    const [ expiresIn, setExpiresIn ] = useState()

    useEffect(() => {
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            window.history.pushState({}, null, '/');
        }).catch(() => {
            window.location = '/';
        });
    }, [code]);

    useEffect(() => {
        if(!refreshToken || !expiresIn) return

        // get new access token 1 minute before token expires
        const interval = setInterval(() => {
            axios.post('http://localhost:3001/refresh', {
                refreshToken,
            }).then(res => {
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            }).catch(() => {
                window.location = '/';
            });
        }, (expiresIn - 60) * 1000);

        // make sure to clear timeout in case something changes before timeout
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}
