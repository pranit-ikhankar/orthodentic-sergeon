import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Lock, Calendar } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'About Our Practice', href: '#about' },
    { label: 'Orthopedic Services', href: '#services' },
    { label: 'Lead Surgeon & Team', href: '#team' },
    { label: 'Patient Recovery Gallery', href: '#contact' },
    { label: 'Book Appointment', href: '#contact' }
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Clinic Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                +
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-white leading-tight"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                  data-testid="footer-logo"
                >
                  Dr. Ikhankar's Clinic
                </h3>
                <p className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                  Orthopedic & Joint Institute
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Specialized Center for Advanced Joint Replacement, Arthroscopic Surgery, Sports Medicine, and Restorative Orthopedic Rehabilitation.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Board Certified Orthopedic Surgeon</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Explore Care
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                    data-testid={`footer-link-${index}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Clinic Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2.5 text-blue-400 flex-shrink-0 mt-1" />
                <span>Orthopedic Excellence Wing, Medical Enclave, City Hospital Road</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2.5 text-blue-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-blue-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2.5 text-blue-400 flex-shrink-0" />
                <a href="mailto:appointments@dr-ikhankar.com" className="hover:text-blue-400 transition-colors">appointments@dr-ikhankar.com</a>
              </li>
            </ul>
          </div>

          {/* Office Hours & Staff Portal */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Consultation Hours
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
              <li className="pl-6">Saturday: 9:00 AM - 2:00 PM</li>
              <li className="pl-6 text-amber-400/90 text-xs">Sunday: Emergency Trauma Only</li>
            </ul>

            {/* Doctor Access Portal Links */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors text-left"
              >
                <Lock className="h-3.5 w-3.5 text-blue-400" />
                <span>Doctor Portal Login</span>
              </button>
              <button
                onClick={() => navigate('/schedule')}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors text-left"
              >
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>Direct Clinical Scheduler</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} data-testid="footer-copyright">
            © {currentYear} Dr. Ikhankar's Orthopedic & Joint Institute. All rights reserved.
          </p>
          <p>
            Emergency Trauma Line Available 24/7
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;