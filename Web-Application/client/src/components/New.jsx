import React from 'react';
import {
  Hero,
  Navbar,
  Companies,
  Courses,
  Achievement,
  Categories,
  Feedback,
  CTA,
  Footer,
} from '../components';

const New = () => {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Companies />
      <Courses />
      <Achievement />
      <Categories />
      <Feedback />
      <CTA />
      <Footer />
    </div>
  );
};

export default New;