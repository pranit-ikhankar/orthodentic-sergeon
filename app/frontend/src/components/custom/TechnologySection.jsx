import React from 'react';
import { Microscope, Shield, Zap, TrendingUp } from 'lucide-react';

const TechnologySection = () => {
  const features = [
    {
      icon: Microscope,
      title: 'Advanced Technology',
      description: 'Utilizing computer-assisted navigation and modern robotic tools for extreme precision during joint reconstructions.'
    },
    {
      icon: Shield,
      title: 'Clinical Excellence',
      description: 'Operating in ultra-clean, state-of-the-art surgical suites adhering to the highest global safety and orthopedic protocols.'
    },
    {
      icon: Zap,
      title: 'Minimally Invasive',
      description: 'Advanced arthroscopic techniques designed to reduce post-operative pain, minimize scarring, and speed up your recovery.'
    },
    {
      icon: TrendingUp,
      title: 'Comprehensive Care',
      description: 'A single, seamless pathway combining expert diagnostics, advanced surgical intervention, and custom post-op physical therapy.'
    }
  ];

  return (
    <section className="py-24 bg-white" data-testid="technology-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="technology-heading"
          >
            Why Choose Us
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="technology-description"
          >
            We combine surgical precision with state-of-the-art medical technology to deliver exceptional orthopedic outcomes and restore your quality of life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center"
                data-testid={`technology-feature-${index}`}
              >
                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3
                  className="text-xl font-bold text-slate-900 mb-3"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;