import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './api/client';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import BookingPage from './pages/BookingPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PrescriptionsPage from './pages/PrescriptionsPage';
import AdminDashboard from './pages/AdminDashboard';
import HldArchitecturePage from './pages/HldArchitecturePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function MainApp() {
  const { user, role, isAuthenticated } = useAuth();
  
  // Navigation State
  const [currentTab, setCurrentTab] = useState('landing');
  const [initialSearchFilter, setInitialSearchFilter] = useState({});
  
  // Booking Workflow State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Doctors Directory Cache
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    // Load top doctors for landing page and quick access
    api.doctors.getAll({ limit: 6 })
      .then(res => setDoctorsList(res.data?.doctors || []))
      .catch(err => console.error('Failed to load initial doctors:', err));
  }, []);

  // Navigation Handler
  const handleNavigate = (tab, params = {}) => {
    setCurrentTab(tab);
    if (params) setInitialSearchFilter(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Workflow Handlers
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentTab('doctor-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookDirect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentTab('doctor-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToBooking = (doctor, date, slot) => {
    setSelectedDoctor(doctor);
    setSelectedDate(date);
    setSelectedSlot(slot);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navigation Header */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            doctors={doctorsList}
            onSelectDoctor={handleSelectDoctor}
            onBookDirect={handleBookDirect}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'doctors' && (
          <DoctorSearchPage
            initialFilter={initialSearchFilter}
            onSelectDoctor={handleSelectDoctor}
            onBookDirect={handleBookDirect}
          />
        )}

        {currentTab === 'doctor-profile' && selectedDoctor && (
          <DoctorProfilePage
            doctor={selectedDoctor}
            onBack={() => handleNavigate('doctors')}
            onBookSlot={handleProceedToBooking}
          />
        )}

        {currentTab === 'booking' && selectedDoctor && (
          <BookingPage
            doctor={selectedDoctor}
            date={selectedDate}
            timeSlot={selectedSlot}
            onBack={() => handleNavigate('doctor-profile')}
            onSuccessNavigate={handleNavigate}
          />
        )}

        {currentTab === 'patient-dashboard' && (
          <PatientDashboard onNavigate={handleNavigate} />
        )}

        {currentTab === 'doctor-dashboard' && (
          <DoctorDashboard onNavigate={handleNavigate} />
        )}

        {currentTab === 'prescriptions' && (
          <PrescriptionsPage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentTab === 'hld' && (
          <HldArchitecturePage />
        )}

        {currentTab === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
