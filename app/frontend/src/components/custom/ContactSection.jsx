import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for managing doctor availability validations
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [isDateValid, setIsDateValid] = useState(false);

  // Get today's date in YYYY-MM-DD format to block past calendar slots
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle picking dates and checking API availability
  const handleDateChange = async (selectedDate) => {
    if (!selectedDate) {
      setFormData(prev => ({ ...prev, preferred_date: '' }));
      setIsDateValid(false);
      setAvailabilityMsg('');
      return;
    }

    const dayOfWeek = new Date(selectedDate).getDay();

    // 1. Instant check: 0 represents Sunday
    if (dayOfWeek === 0) {
      toast.error('Sundays are closed!');
      setAvailabilityMsg('❌ Sundays are closed! Please pick a Monday - Saturday date.');
      setFormData(prev => ({ ...prev, preferred_date: '' }));
      setIsDateValid(false);
      return;
    }

    // Set the date field and show loading status
    setFormData(prev => ({ ...prev, preferred_date: selectedDate }));
    setAvailabilityMsg('⏳ Checking doctor\'s schedule availability...');
    setIsDateValid(false);

    // 2. Contact Backend API to check database slots count
    try {
      const data = await api.checkAvailability(selectedDate);
      
      if (data.available) {
        setAvailabilityMsg(`✅ ${data.message}`);
        setIsDateValid(true); // Unlocks submission ability
      } else {
        toast.error(data.message);
        setAvailabilityMsg(`❌ ${data.message}`);
        setFormData(prev => ({ ...prev, preferred_date: '' })); // Clear if full
        setIsDateValid(false);
      }
    } catch (error) {
      console.error('Availability check failed:', error);
      // Fallback: allow submission
      setAvailabilityMsg('⚠️ Availability check offline, booking will proceed.');
      setIsDateValid(true); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.preferred_date || !formData.preferred_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Secondary layer block in case button styles fail to disable
    if (!isDateValid) {
      toast.error('Please select a valid and available date first.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.bookAppointment(formData);
      toast.success('Appointment request submitted successfully! We\'ll contact you soon.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      });
      setAvailabilityMsg('');
      setIsDateValid(false);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Institute',
      content: 'Orthopedic Excellence Wing, Medical Enclave, City Hospital Road'
    },
    {
      icon: Phone,
      title: 'Emergency / Consultations',
      content: '+91 98765 43210'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'appointments@dr-ikhankar.com'
    },
    {
      icon: Clock,
      title: 'Clinic Hours',
      content: 'Mon-Fri: 9AM-6PM, Sat: 9AM-2PM (Sun: Emergency)'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
            data-testid="contact-heading"
          >
            Book Your Appointment
          </h2>
          <p
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            data-testid="contact-description"
          >
            Take the first step toward pain-free movement. Fill out the form below and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                  <div className="bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-slate-900 mb-1"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {info.title}
                    </h3>
                    <p className="text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {info.content}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 rounded-xl overflow-hidden shadow-sm h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98784368459395!3d40.75889797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Clinic Location"
                data-testid="contact-map"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-8 border border-slate-100" data-testid="booking-form">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Full Name *</label>
                  <input
                    id="name"
                    data-testid="booking-input-name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Phone Number *</label>
                  <input
                    id="phone"
                    data-testid="booking-input-phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (234) 567-8900"
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    data-testid="booking-input-email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="service" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Service Type *</label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Initial-consultaion">Initial Orthopedic Consultation</option>
                    <option value="Joint-Pain-Evaluation">Joint Pain Evaluation (Knee/Hip/Shoulder)</option>
                    <option value="Sports-Injury-Assessment">Sports Injury Assessment</option>
                    <option value="Cosmetic-Orthopedics">Cosmetic Orthopedics</option>
                    <option value="Joint-Implants">Joint Implants</option>
                    <option value="Orthopedic-Surgery">Orthopedic Surgery</option>
                    <option value="Emergency-Orthopedic-Care">Emergency Orthopedic Care</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Preferred Date *</label>
                  <input
                    id="date"
                    type="date"
                    data-testid="booking-input-date"
                    min={today} // Prevents picking past dates
                    value={formData.preferred_date}
                    onChange={(e) => handleDateChange(e.target.value)} // Triggers custom verification logic
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {/* Dynamic Alert Message Container */}
                  {availabilityMsg && (
                    <p className={`text-xs font-bold mt-1.5 ${isDateValid ? 'text-green-600' : 'text-red-500'}`}>
                      {availabilityMsg}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="time" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Preferred Time *</label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => handleChange('preferred_time', e.target.value)}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a time</option>
                    <option value="9am">9:00 AM</option>
                    <option value="10am">10:00 AM</option>
                    <option value="11am">11:00 AM</option>
                    <option value="12pm">12:00 PM</option>
                    <option value="2pm">2:00 PM</option>
                    <option value="3pm">3:00 PM</option>
                    <option value="4pm">4:00 PM</option>
                    <option value="5pm">5:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="message" className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>Additional Notes</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any specific concerns or questions?"
                  className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className={`w-full mt-6 text-white py-4 text-lg rounded-md shadow-sm transition-colors ${
                  isSubmitting || !isDateValid ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isSubmitting || !isDateValid} // Keeps button locked until date status turns valid
                data-testid="booking-submit-button"
              >
                {isSubmitting ? 'Submitting...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;