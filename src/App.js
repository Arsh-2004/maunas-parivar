import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Community from './pages/Community';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Membership from './pages/Membership';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MembershipCards from './pages/MembershipCards';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router basename="/">
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } />
                <Route path="/gallery" element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/members" element={<MembershipCards />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
