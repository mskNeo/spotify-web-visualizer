import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const code = useRef();
  const [ codeParams, setCodeParams ] = useState();

  useEffect(() => {
    setCodeParams(() => new URLSearchParams(window.location.search));
  }, []);

  if (codeParams) code.current = codeParams.get('code');

  return (
    code.current ? <Dashboard code={code.current} /> : <Login />
  );
}
