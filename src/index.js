import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './component/App';
import reportWebVitals from './reportWebVitals';
import SeatSelection from './component/seatSelection';
import TicketScreen from './component/ticket';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/seat-selection" element={<SeatSelection />} />
    <Route path="/ticket" element={<TicketScreen />} />
  </Routes>
  </Router>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
