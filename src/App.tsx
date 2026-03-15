import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Eager load Home for fastest LCP
import Home from './pages/Home';

// Lazy load all other pages for smaller initial bundle
const Residential = lazy(() => import('./pages/Residential'));
const Commercial = lazy(() => import('./pages/Commercial'));
const About = lazy(() => import('./pages/About'));
const Quote = lazy(() => import('./pages/Quote'));
const Contact = lazy(() => import('./pages/Contact'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const LondonOntario = lazy(() => import('./pages/LondonOntario'));
const CityLanding = lazy(() => import('./pages/CityLanding'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-grow pt-20">
            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/residential" element={<Residential />} />
                <Route path="/commercial" element={<Commercial />} />
                <Route path="/about" element={<About />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/london-ontario-cleaning" element={<LondonOntario />} />
                <Route path="/st-thomas-cleaning" element={
                  <CityLanding city="St. Thomas" slug="st-thomas-cleaning" distance="30 minutes" population="42,000"
                    description="Trydentt Cleaning brings London-quality professional cleaning to St. Thomas, Ontario. Residential and commercial cleaning with eco-friendly products, full insurance, and our 100% satisfaction guarantee — no travel surcharges."
                    areas={['Central St. Thomas', 'North End', 'South End', 'East End', 'Talbot Village', 'Port Stanley', 'Belmont', 'Sparta']} />
                } />
                <Route path="/woodstock-cleaning" element={
                  <CityLanding city="Woodstock" slug="woodstock-cleaning" distance="45 minutes" population="46,000"
                    description="Professional residential and commercial cleaning services now available in Woodstock, Ontario. Eco-friendly, fully insured, satisfaction guaranteed — brought to you by Trydentt Cleaning."
                    areas={['Downtown Woodstock', 'North Woodstock', 'South Woodstock', 'East End', 'West End', 'Sweaburg', 'Innerkip', 'Drumbo']} />
                } />
                <Route path="/strathroy-cleaning" element={
                  <CityLanding city="Strathroy" slug="strathroy-cleaning" distance="35 minutes" population="22,000"
                    description="Strathroy's trusted cleaning service. Trydentt delivers meticulous residential and commercial cleaning with eco-friendly products, full insurance, and a 100% satisfaction guarantee."
                    areas={['Downtown Strathroy', 'North Strathroy', 'Caradoc', 'Mount Brydges', 'Adelaide', 'Kerwood', 'Appin']} />
                } />
                <Route path="/ingersoll-cleaning" element={
                  <CityLanding city="Ingersoll" slug="ingersoll-cleaning" distance="30 minutes" population="13,000"
                    description="Professional cleaning services now available in Ingersoll, Ontario. Trydentt brings eco-friendly residential and commercial cleaning with full insurance, flexible scheduling, and a 100% satisfaction guarantee."
                    areas={['Downtown Ingersoll', 'North Ingersoll', 'South Ingersoll', 'Salford', 'Verschoyle', 'Centreville']} />
                } />
                <Route path="/tillsonburg-cleaning" element={
                  <CityLanding city="Tillsonburg" slug="tillsonburg-cleaning" distance="50 minutes" population="18,000"
                    description="Tillsonburg's go-to cleaning team. Trydentt Cleaning provides thorough residential and commercial cleaning services with eco-friendly products, full insurance, and our 100% satisfaction guarantee."
                    areas={['Downtown Tillsonburg', 'North Tillsonburg', 'South Tillsonburg', 'Ostrander', 'Brownsville', 'Courtland', 'Straffordville']} />
                } />
                <Route path="/aylmer-cleaning" element={
                  <CityLanding city="Aylmer" slug="aylmer-cleaning" distance="45 minutes" population="8,000"
                    description="Reliable cleaning services for Aylmer, Ontario homes and businesses. Trydentt Cleaning offers eco-friendly products, fully insured team members, and a 100% satisfaction guarantee on every clean."
                    areas={['Downtown Aylmer', 'East Aylmer', 'West Aylmer', 'Springfield', 'Malahide', 'Vienna', 'Port Bruce']} />
                } />
                <Route path="/dorchester-cleaning" element={
                  <CityLanding city="Dorchester" slug="dorchester-cleaning" distance="15 minutes" population="4,000"
                    description="Just minutes from London, Dorchester gets the same top-tier cleaning service. Trydentt provides eco-friendly residential and commercial cleaning with no travel surcharges and a 100% satisfaction guarantee."
                    areas={['Dorchester', 'Belmont', 'Harrietsville', 'Nilestown', 'Putnam', 'Avon']} />
                } />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
