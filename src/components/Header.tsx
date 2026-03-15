import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Residential', path: '/residential' },
    { name: 'Commercial', path: '/commercial' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceAreas = [
    { name: 'London, ON', path: '/london-ontario-cleaning' },
    { name: 'St. Thomas', path: '/st-thomas-cleaning' },
    { name: 'Woodstock', path: '/woodstock-cleaning' },
    { name: 'Strathroy', path: '/strathroy-cleaning' },
    { name: 'Ingersoll', path: '/ingersoll-cleaning' },
    { name: 'Tillsonburg', path: '/tillsonburg-cleaning' },
    { name: 'Aylmer', path: '/aylmer-cleaning' },
    { name: 'Dorchester', path: '/dorchester-cleaning' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-500" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Logo className="w-10 h-10 transition-transform group-hover:scale-110 duration-500 relative z-10" />
              <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase font-display">Trydentt</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all duration-300 hover:text-indigo-600 relative group/link ${
                  isActive(link.path) ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
              </Link>
            ))}

            {/* Service Areas Dropdown */}
            <div className="relative group/areas">
              <button
                className="text-sm font-bold tracking-wide text-slate-600 hover:text-indigo-600 transition-all duration-300 flex items-center space-x-1"
                onClick={() => setAreasOpen(!areasOpen)}
                onMouseEnter={() => setAreasOpen(true)}
                aria-expanded={areasOpen}
                aria-haspopup="true"
              >
                <span>Areas</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {areasOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  onMouseLeave={() => setAreasOpen(false)}
                >
                  {serviceAreas.map((area) => (
                    <Link
                      key={area.path}
                      to={area.path}
                      onClick={() => setAreasOpen(false)}
                      className={`block px-4 py-2 text-sm font-medium transition-colors ${
                        isActive(area.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <a
              href="tel:+15198713368"
              className="hidden lg:flex items-center space-x-1.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              aria-label="Call Trydentt Cleaning at 519-871-3368"
            >
              <Phone className="w-4 h-4" />
              <span>(519) 871-3368</span>
            </a>

            <Link
              to="/quote"
              className="btn-primary group"
            >
              <span className="relative z-10">Get a Free Quote</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <a
              href="tel:+15198713368"
              className="text-indigo-600 hover:text-indigo-700"
              aria-label="Call Trydentt Cleaning"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-medium ${
                isActive(link.path) ? 'text-indigo-600' : 'text-slate-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service Areas</p>
            {serviceAreas.map((area) => (
              <Link
                key={area.path}
                to={area.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium py-1 ${
                  isActive(area.path) ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {area.name}
              </Link>
            ))}
          </div>
          <Link
            to="/quote"
            onClick={() => setIsOpen(false)}
            className="block text-center bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Get a Free Quote
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
