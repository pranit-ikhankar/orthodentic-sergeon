import React from 'react';
import Navbar from '../components/custom/Navbar';
import HeroSection from '../components/custom/HeroSection';
import AboutSection from '../components/custom/AboutSection';
import ServicesGrid from '../components/custom/ServicesGrid';
import TeamSection from '../components/custom/TeamSection';
import BeforeAfter from '../components/custom/BeforeAfter';
import Testimonials from '../components/custom/Testimonials';
import TechnologySection from '../components/custom/TechnologySection';
import ContactSection from '../components/custom/ContactSection';
import Footer from '../components/custom/Footer';

const HomePage = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar onBookClick={scrollToContact} />
      <HeroSection onBookClick={scrollToContact} />
      <AboutSection />
      <ServicesGrid />
      <TeamSection />
      <BeforeAfter />
      <Testimonials />
      <TechnologySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;