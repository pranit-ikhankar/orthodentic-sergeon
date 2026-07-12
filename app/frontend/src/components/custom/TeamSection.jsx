import React from 'react';
import { Award } from 'lucide-react';

const TeamSection = () => {
  const doctors = [
    {
      name: '[Doctor Name]',
      specialty: 'Lead Orthopedic & Joint Replacement Surgeon',
      qualifications: 'MS (Orthopedics), M.Ch (Joint Reconstruction)',
      experience: '[X] years of surgical experience',
      image: 'https://images.unsplash.com/photo-1758575514487-0390fcacc339'
    }
  ];

  return (
    <section id="team" className="py-24 bg-white" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="team-heading"
          >
            Meet Our Team
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="team-description"
          >
            Our experienced orthopedic specialists are dedicated to providing you with exceptional surgical care, advanced rehabilitation, and comprehensive recovery tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow"
              data-testid={`team-member-${index}`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3
                  className="text-2xl font-bold text-slate-900 mb-2"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {doctor.specialty}
                </p>
                <div className="space-y-2 text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <p className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    {doctor.qualifications}
                  </p>
                  <p>{doctor.experience}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;