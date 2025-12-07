import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Community from './pages/Community';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Membership from './pages/Membership';
import './App.css';

function App() {
  return (
    <Router basename="/maunas-parivar">
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/membership" element={<Membership />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
