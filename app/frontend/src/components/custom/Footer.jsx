import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-slate-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
              data-testid="footer-logo"
            >
              [Clinic Name]
            </h3>
            <p className="text-slate-400 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Your trusted partner for advanced orthopedic solutions, advanced joint restoration, and lifelong structural mobility.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Quick Links</h4>
            <ul className="space-y-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                    data-testid={`footer-link-${index}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Contact Info</h4>
            <ul className="space-y-3 text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>[Street Address], [City, State]</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-teal-400 transition-colors">+1 (234) 567-8900</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <a href="mailto:info@dentalclinic.com" className="hover:text-teal-400 transition-colors">contact@orthosurgeon.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Office Hours</h4>
            <ul className="space-y-2 text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }} data-testid="footer-copyright">
            © {currentYear} [Clinic Name]. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;