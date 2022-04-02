import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [code, setCode] = useState();

  useEffect(() => {
    setCode(() => new URLSearchParams(window.location.search).get('code'));
  }, []);

  return (
    code ? <Dashboard code={code} /> : <Login />
  );
}
