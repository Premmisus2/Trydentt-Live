import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Residential', path: '/residential' },
    { name: 'Commercial', path: '/commercial' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-500">
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
          <div className="hidden md:flex items-center space-x-8">
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
            <Link
              to="/quote"
              className="btn-primary group"
            >
              <span className="relative z-10">Get a Free Quote</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
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
