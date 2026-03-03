import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import OathModal from './components/OathModal';
import Home from './pages/Home';
import About from './pages/About';
import Community from './pages/Community';
import Heritage from './pages/Heritage';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Membership from './pages/Membership';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import IDCardView from './pages/IDCardView';
import MemberProfile from './pages/MemberProfile';
import NonMembers from './pages/NonMembers';
import './App.css';

// Routes where the site Header/Footer should be hidden (e.g. QR-scanned member profiles)
const CLEAN_ROUTES = ['/member-profile/'];

function AppLayout() {
  const location = useLocation();
  const isCleanRoute = CLEAN_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <div className="App">
      {!isCleanRoute && <OathModal />}
      {!isCleanRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/non-members" element={<NonMembers />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/id-card/:userId" element={<IDCardView />} />
          <Route path="/member-profile/:userId" element={<MemberProfile />} />
        </Routes>
      </main>
      {!isCleanRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router basename="/">
          <AppLayout />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
