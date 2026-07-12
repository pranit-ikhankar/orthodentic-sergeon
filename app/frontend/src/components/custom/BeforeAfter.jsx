import React from 'react';
import { ArrowRight } from 'lucide-react';
import photo1 from '../../assets/SpineReallignBefore.png';
import photo2 from '../../assets/SpineReallignAfter.png';
import photo3 from '../../assets/JointMobilityBefore.png';
import photo4 from '../../assets/JointMobilityAfter.png';


const BeforeAfter = () => {
  const cases = [
    {
      title: 'Spine Realignment',
      description: 'Correcting curvature to relieve pain and improve posture',
      before: photo1,
      after: photo2
    },
    {
      title: 'Joint Mobility',
      description: 'Advanced shoulder reconstruction for pain-free range of motion',
      before: photo3,
      after: photo4
    }
  ];

  return (
    <section className="py-24 bg-slate-50" data-testid="before-after-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="before-after-heading"
          >
            Patient Recovery Gallery
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="before-after-description"
          >
            See the life-changing results our patients have achieved with our advanced orthodentic treatments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-slate-100"
              data-testid={`before-after-card-${index}`}
            >
              <div className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>BEFORE</p>
                  <img
                    src={caseItem.before}
                    alt="Before treatment"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>AFTER</p>
                  <img
                    src={caseItem.after}
                    alt="After treatment"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="px-6 pb-6">
                <h3
                  className="text-xl font-bold text-slate-900 mb-2"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {caseItem.title}
                </h3>
                <p className="text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {caseItem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;