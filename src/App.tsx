import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Residential from './pages/Residential';
import Commercial from './pages/Commercial';
import About from './pages/About';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import LondonOntario from './pages/LondonOntario';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/residential" element={<Residential />} />
              <Route path="/commercial" element={<Commercial />} />
              <Route path="/about" element={<About />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/london-ontario-cleaning" element={<LondonOntario />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
