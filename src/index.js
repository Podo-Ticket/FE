import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScheduleProvider } from './hook/ScheduleContext';

import UserHome from './pages/user/UserHome';
import OnSiteReserve from './pages/user/OnSiteReserve';
import SelectSeats from './pages/user/SelectSeats';
import TicketConfirmation from './pages/user/TicketConfirmation';
import TicketScreen from './pages/user/Ticket';

import AdminHome from './pages/admin/AdminHome';
import RealTimeSeats from "./pages/admin/RealTimeSeats";
import ListManagement from "./pages/admin/ListManagement";
import OnSiteManagement from "./pages/admin/OnSiteManagement";
import InsertList from './pages/admin/InsertList';
import DeleteList from './pages/admin/DeleteList';
import ModifyList from './pages/admin/ModifyList';
import TheaterInfo from './pages/admin/TheaterInfo';

import './styles/index.css'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScheduleProvider>
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
          <Route path="/theater" element={<TheaterInfo />} />
        </Routes>
      </ScheduleProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
