import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [code, setCode] = useState();

  useEffect(() => {
    setCode(code => window.location.href.split('code=')[1]);
  }, []);

  return (
    code ? <Dashboard code={code} /> : <Login />
  );
}
