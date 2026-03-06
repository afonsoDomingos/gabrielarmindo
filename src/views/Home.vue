<script setup>
import Navbar from '../components/Navbar.vue';
import Hero from '../components/Hero.vue';
import About from '../components/About.vue';
import Experience from '../components/Experience.vue';
import Skills from '../components/Skills.vue';
import Services from '../components/Services.vue';
import Certifications from '../components/Certifications.vue';
import ServicesOverview from '../components/ServicesOverview.vue';
import Blog from '../components/Blog.vue';
import Contact from '../components/Contact.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="home-page">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Services />
      <Certifications />
      <ServicesOverview />
      <Blog />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles for the home page */
</style>
