import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white uppercase font-display">Trydentt</span>
            </Link>
            <p className="text-sm leading-relaxed mb-8">
              Pristine spaces, peace of mind. Trydentt offers premium cleaning services for residential and commercial clients across the region.
            </p>

            {/* Social Media Icons */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <ul className="flex flex-wrap gap-3">
                {/* Facebook */}
                <li className="group relative bg-white rounded-full w-10 h-10 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-[#1877F2] hover:text-white text-slate-900">
                  <span className="absolute -top-10 bg-[#1877F2] text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] pointer-events-none whitespace-nowrap">
                    Facebook
                    <span className="absolute w-2 h-2 bg-[#1877F2] -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></span>
                  </span>
                  <Facebook className="w-5 h-5" />
                </li>
                {/* Instagram */}
                <li className="group relative bg-white rounded-full w-10 h-10 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-[#E4405F] hover:text-white text-slate-900">
                  <span className="absolute -top-10 bg-[#E4405F] text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] pointer-events-none whitespace-nowrap">
                    Instagram
                    <span className="absolute w-2 h-2 bg-[#E4405F] -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></span>
                  </span>
                  <Instagram className="w-5 h-5" />
                </li>
                {/* LinkedIn */}
                <li className="group relative bg-white rounded-full w-10 h-10 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-[#0077B5] hover:text-white text-slate-900">
                  <span className="absolute -top-10 bg-[#0077B5] text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] pointer-events-none whitespace-nowrap">
                    LinkedIn
                    <span className="absolute w-2 h-2 bg-[#0077B5] -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></span>
                  </span>
                  <Linkedin className="w-5 h-5" />
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/residential#services" className="hover:text-white transition-colors">Residential Cleaning</Link></li>
              <li><Link to="/commercial#services" className="hover:text-white transition-colors">Commercial Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/quote" className="hover:text-white transition-colors">Book Online</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>+1 519-871-3368</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>homes@trydenttbuildingservices.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs">© {new Date().getFullYear()} Trydentt Cleaning Services. All rights reserved.</p>
          <div className="flex space-x-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
