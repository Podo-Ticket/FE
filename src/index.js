import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
=======

import AdminHome from './pages/AdminHome';
import RealTimeSeats from "./pages/RealTimeSeats";
import ListManagement from "./pages/ListManagement";
import OnSiteManagement from "./pages/OnSiteManagement";
import InsertList from './pages/InsertList';
import DeleteList from './pages/DeleteList';
import ModifyList from './pages/ModifyList';

import './styles/index.css'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
>>>>>>> 804a43b (feat: MVP 1.0.0 #2)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <App />
=======
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/seats" element={<RealTimeSeats />} />
        <Route path="/manage" element={<ListManagement />} />
        <Route path="/onsite" element={<OnSiteManagement />} />
        <Route path="/insert" element={<InsertList />} />
        <Route path="/delete" element={<DeleteList />} />
        <Route path="/modify" element={<ModifyList />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 804a43b (feat: MVP 1.0.0 #2)
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
