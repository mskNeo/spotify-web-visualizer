import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const code = new URLSearchParams(window.location.search).get('code');

  return (
    code ? <Dashboard code={code} /> : <Login />
  );
}
