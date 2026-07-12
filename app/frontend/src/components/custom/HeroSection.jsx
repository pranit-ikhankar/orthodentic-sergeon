import React from 'react';
import { Calendar, Phone, CheckCircle } from 'lucide-react';

import heroImage from '../../assets/HeroImage.png';

const HeroSection = ({ onBookClick }) => {
  return (
    <section id="hero" className="py-24 md:py-32 bg-white" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
              data-testid="hero-headline"
            >
              Regain Your Mobility.
              <br />
              <span className="text-blue-600">Live Pain-Free.</span>
            </h1>
            <p
              className="text-lg text-slate-600 leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              data-testid="hero-subheadline"
            >
              Advanced Orthopedic Care for an Active Life. Expert surgical and non-surgical solutions for joint, bone, and muscle conditions. Helping you get back on your feet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookClick}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                data-testid="hero-book-button"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </button>
              <button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-8 py-6 text-lg"
                asChild
                data-testid="hero-call-button"
              >
                <a href="tel:+1234567890">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>Same-Day Appointments</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>Insurance Accepted</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={heroImage}
                alt="Modern dental clinic interior"
                className="w-full h-[500px] object-cover"
                data-testid="hero-image"
              />
              <div className="absolute top-6 right-6 bg-white rounded-lg shadow-md p-4" data-testid="hero-trust-badge">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600" style={{ fontFamily: 'Manrope, sans-serif' }}>500+</div>
                  <div className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>Happy Patients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;