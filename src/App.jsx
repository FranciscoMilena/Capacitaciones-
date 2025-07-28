// src/App.jsx

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedCourses from './components/FeaturedCourses';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCourses />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default App;
