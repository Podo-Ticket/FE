import React from 'react';
import ReactDOM from 'react-dom/client';
import { BookingProvider } from './context/BookingContext';

import UserHome from './pages/UserHome';
import OnSiteReserve from './pages/OnSiteReserve';
import SelectSeats from './pages/SelectSeats';
import TicketConfirmation from './pages/TicketConfirmation';
import TicketScreen from './pages/Ticket';

import AdminHome from './pages/AdminHome';
import RealTimeSeats from "./pages/RealTimeSeats";
import ListManagement from "./pages/ListManagement";
import OnSiteManagement from "./pages/OnSiteManagement";
import InsertList from './pages/InsertList';
import DeleteList from './pages/DeleteList';
import ModifyList from './pages/ModifyList';

import './styles/index.css'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/reserve" element={<OnSiteReserve />} />
          <Route path="/select" element={<SelectSeats />} />
          <Route path="/confirm" element={<TicketConfirmation />} />
          <Route path="/ticket" element={<TicketScreen />} />

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/seats" element={<RealTimeSeats />} />
          <Route path="/manage" element={<ListManagement />} />
          <Route path="/onsite" element={<OnSiteManagement />} />
          <Route path="/insert" element={<InsertList />} />
          <Route path="/delete" element={<DeleteList />} />
          <Route path="/modify" element={<ModifyList />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
