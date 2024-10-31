import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/NfcHome';
import reportWebVitals from './reportWebVitals';
import SelectSeats from './pages/SelectSeats';
import TicketConfirmation from './pages/TicketConfirmation';
import TicketScreen from './pages/Ticket';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/select" element={<SelectSeats />} />
    <Route path="/confirm" element={<TicketConfirmation />} />
    <Route path="/ticket" element={<TicketScreen />} />
  </Routes>
  </Router>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
