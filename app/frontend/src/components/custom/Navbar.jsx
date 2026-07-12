import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const Navbar = ({ onBookClick }) => {

  const [isOpen, setIsOpen] = useState(false);

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
    { label: 'Team', id: 'team' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold text-slate-900 px-4 py-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              [Clinic Name]
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-4 px-4"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+1234567890" className="text-slate-700 hover:text-blue-600 transition-colors">
              <Phone className="h-5 w-5" />
            </a>

            <button
              onClick={onBookClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700 text-2xl px-4"
          >
            ☰
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center py-4 space-y-4">

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-slate-700 hover:text-blue-600 font-medium"
              >
                {link.label}
              </button>
            ))}

            {/* Call Button */}
            <a href="tel:+1234567890" className="text-slate-700 hover:text-blue-600">
              <Phone className="h-5 w-5" />
            </a>

            <button
              onClick={onBookClick}
              className="bg-blue-600 text-white px-4 py-2"
            >
              Book Now
            </button>

          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;