import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowRight, Phone } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <Helmet>
        <title>Page Not Found | Trydentt Cleaning Services</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-center px-4 max-w-lg">
        <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link to="/quote" className="inline-flex items-center space-x-2 text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
            <span>Get a Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Looking for one of these?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/residential" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Residential Cleaning</Link>
            <Link to="/commercial" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Commercial Cleaning</Link>
            <Link to="/london-ontario-cleaning" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">London, Ontario</Link>
            <Link to="/contact" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
