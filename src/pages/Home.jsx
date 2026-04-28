import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import WhyJoin from '../components/WhyJoin';
import FeaturedAlumni from '../components/FeaturedAlumni';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Stats />
      <WhyJoin />
      <FeaturedAlumni />
      <Testimonials />
      <CTABanner />
    </div>
  );
};

export default Home;
