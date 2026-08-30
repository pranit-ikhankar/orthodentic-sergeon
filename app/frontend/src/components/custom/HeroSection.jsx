import React from 'react';
import { Calendar, Phone, CheckCircle, Award, ShieldCheck } from 'lucide-react';
import heroImage from '../../assets/HeroImage.png';

const HeroSection = ({ onBookClick }) => {
  return (
    <section id="hero" className="py-16 md:py-28 bg-white overflow-hidden" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Premier Orthopedic & Joint Care
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15]"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
              data-testid="hero-headline"
            >
              Regain Your Mobility.
              <br />
              <span className="text-blue-600">Live Pain-Free.</span>
            </h1>

            <p
              className="text-base sm:text-lg text-slate-600 leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              data-testid="hero-subheadline"
            >
              Specialized clinical care led by <strong>Dr. Pranit Ikhankar</strong>. Expert surgical and non-surgical treatments for joint replacement, sports injuries, arthroscopy, and complex bone trauma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onBookClick}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                data-testid="hero-book-button"
              >
                <Calendar className="h-5 w-5" />
                Book Consultation
              </button>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-semibold px-8 py-4 text-base rounded-xl transition-all hover:bg-blue-50/50"
                data-testid="hero-call-button"
              >
                <Phone className="h-5 w-5" />
                Call +91 98765 43210
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Same-Day Slots</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Minimally Invasive</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Post-Op Rehab</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src={heroImage}
                alt="Orthopedic and surgical clinic"
                className="w-full h-[450px] lg:h-[520px] object-cover"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-4" data-testid="hero-trust-badge">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-blue-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    1,200+
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Successful Surgeries
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-3.5 border border-white/50 text-xs text-slate-700 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Dr. Pranit Ikhankar, MS (Ortho)</span>
                </div>
                <span className="text-emerald-600 font-bold">100% Verified Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;