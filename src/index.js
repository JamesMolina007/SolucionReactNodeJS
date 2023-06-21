import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './codigo/App';
import CrearDb from './codigo/CrearDb';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <BrowserRouter>
    <Routes> 
      <Route path="/" element={<App />} />
      <Route path="/creardb" element={<CrearDb />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
