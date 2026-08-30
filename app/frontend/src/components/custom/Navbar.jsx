import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Menu, X, Calendar, Activity } from 'lucide-react';

const Navbar = ({ onBookClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Our Team', id: 'team' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                +
              </div>
              <div>
                <span
                  className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight block leading-tight group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Dr. Ikhankar's
                </span>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                  Orthopedic & Joint Institute
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-slate-600 hover:text-blue-600 font-medium py-2 px-3 lg:px-4 text-sm transition-colors rounded-lg hover:bg-slate-50"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="tel:+919876543210"
              className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Call Clinic Emergency Hotline"
            >
              <Phone className="h-4 w-4" />
            </a>

            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 py-2.5 px-3.5 rounded-xl transition-all border border-slate-200/60"
              title="Access Doctor Admin Portal"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              Doctor Portal
            </button>

            <button
              onClick={onBookClick}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-sm shadow-blue-600/30 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Lock className="h-3.5 w-3.5" /> Portal
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-slate-700 hover:text-blue-600 font-medium py-2 text-base transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <Phone className="h-4 w-4 text-blue-600" /> +91 98765 43210
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/admin');
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <Lock className="h-4 w-4 text-blue-600" /> Doctor & Staff Portal
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onBookClick();
              }}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md text-sm transition-all"
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;