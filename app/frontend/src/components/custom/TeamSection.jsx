import React from 'react';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';

const TeamSection = () => {
  const doctors = [
    {
      name: 'Dr. Pranit Ikhankar',
      specialty: 'Lead Orthopedic & Joint Replacement Surgeon',
      qualifications: 'MS (Orthopedics), M.Ch (Joint Reconstruction), Fellowship in Arthroscopy (USA)',
      experience: '14+ years of specialized joint replacement & trauma surgery experience',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Dr. Ananya Sen',
      specialty: 'Sports Medicine & Arthroscopic Surgeon',
      qualifications: 'MS (Ortho), DNB (Sports Medicine), ISAKOS Certified Specialist',
      experience: '9+ years treating professional athletes, ACL reconstructions & rotator cuff tears',
      image: 'https://images.unsplash.com/photo-1594824813591-683a69a47dd6?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Dr. Rajesh Kulkarni',
      specialty: 'Senior Spine Surgeon & Rehabilitation Director',
      qualifications: 'MS (Ortho), Fellowship in Minimally Invasive Spine Surgery (Germany)',
      experience: '16+ years of spinal realignment, disc preservation & recovery therapy',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section id="team" className="py-20 md:py-28 bg-white border-t border-slate-100" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4" /> Board-Certified Surgeons
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="team-heading"
          >
            Meet Our Clinical Specialists
          </h2>
          <p
            className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="team-description"
          >
            Our seasoned orthopedic team brings decades of collective surgical expertise, advanced robotic navigation, and personalized post-operative rehabilitation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-slate-50/70 rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-blue-200 transition-all group"
              data-testid={`team-member-${index}`}
            >
              <div className="aspect-[4/4.5] overflow-hidden relative bg-slate-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {doctor.name}
                </h3>
                <p className="text-blue-600 text-sm font-semibold mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {doctor.specialty}
                </p>
                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200/60" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <p className="flex items-start">
                    <Award className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{doctor.qualifications}</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{doctor.experience}</span>
                  </p>
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