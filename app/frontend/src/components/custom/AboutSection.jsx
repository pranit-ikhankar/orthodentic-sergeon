import React from 'react';
import { UserCheck, Stethoscope, Cpu, ShieldCheck } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: UserCheck,
      title: 'Patient-Centered Recovery',
      description: 'Your individual lifestyle, pain relief, and mobility goals sit at the absolute core of our customized treatment plans.'
    },
    {
      icon: Stethoscope,
      title: 'Board-Certified Specialists',
      description: 'Highly trained orthopedic surgeons committed to excellence in joint reconstruction, trauma care, and sports medicine.'
    },
    {
      icon: Cpu,
      title: 'Advanced Technology',
      description: 'Utilizing state-of-the-art diagnostic imaging and minimally invasive surgical techniques for faster, safer healing.'
    },
    {
      icon: ShieldCheck,
      title: 'Comprehensive Rehab',
      description: 'Seamless integration of post-operative management and structural therapy to guide you back to full function.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-slate-50" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="about-heading"
          >
            About Our Practice
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="about-description"
          >
            We believe that world-class orthopedic care should be precise, effective, and tailored to your unique lifestyle goals. Our practice combines advanced surgical technology with a comprehensive, patient-centered rehabilitation framework to help you recover faster and restore your lifelong mobility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-slate-100 hover:shadow-md transition-shadow"
                data-testid={`about-value-${index}`}
              >
                <div className="bg-blue-50 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-slate-900 mb-3"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;