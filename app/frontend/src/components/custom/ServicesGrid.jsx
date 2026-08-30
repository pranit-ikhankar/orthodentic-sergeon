import React from 'react';
import { Smile, Stethoscope, Sparkles, Baby, Crown, Scissors } from 'lucide-react';
import service1 from '../../assets/JointReplace.png';
import service2 from '../../assets/SportsMedicine.png';
import service3 from '../../assets/Arthroscopic.png';
import service4 from '../../assets/SpineCare.png';
import service5 from '../../assets/FractureCare.png';
import service6 from '../../assets/Rehab.png';


const ServicesGrid = () => {
  const services = [
    {
      icon: Smile,
      title: 'Joint Replacement',
      description: 'Knee, Hip, and Shoulder replacement surgerys to restore mobility and relieve pain.',
      size: 'large',
      image: service1
    },
    {
      icon: Sparkles,
      title: 'Sports Medicine',
      description: 'Treating ligament tears, ACL injuries, and athletic wear-and-tear conditions to get you back in the game.',
      size: 'large',
      image: service2
    },
    {
      icon: Crown,
      title: 'Arthroscopic Surgery',
      description: 'Minimally invasive keyhole surgeries for joints like knees and shoulders to diagnose and treat various conditions.',
      size: 'small',
      image: service3
    },
    {
      icon: Scissors,
      title: 'Spine & Back Care',
      description: 'Treatment for spine and back conditions to alleviate pain and improve mobility.',
      size: 'small',
      image: service4
    },
    {
      icon: Sparkles,
      title: 'Fracture & Trauma Care',
      description: 'Comprehensive treatment for bone fractures and traumatic injuries to promote healing and restore function.',
      size: 'small',
      image: service5
    },
    {
      icon: Baby,
      title: 'Physical Rehabilitation',
      description: 'Recovery and strengthening exercises to help you regain function and mobility.',
      size: 'small',
      image: service6
    }
  ];

  return (
    <section id="services" className="py-24 bg-white" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="services-heading"
          >
            Our Orthopedic Specialties
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="services-description"
          >
            From preventative joint care to advanced minimally invasive reconstructions, we offer comprehensive orthopedic and joint surgical treatments tailored to your mobility goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLarge = service.size === 'large';
            return (
              <div
                key={index}
                className={`group relative rounded-xl overflow-hidden border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                data-testid={`service-card-${index}`}
              >
                {service.image ? (
                  <div className="relative h-64">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Icon className="h-8 w-8 mb-3" />
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-slate-200"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-8 h-full">
                    <div className="bg-blue-50 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3
                      className="text-xl font-bold text-slate-900 mb-3"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-slate-600"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {service.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;