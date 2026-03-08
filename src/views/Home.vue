<script setup>
import Navbar from '../components/Navbar.vue';
import Hero from '../components/Hero.vue';
import About from '../components/About.vue';
import ResumeTabs from '../components/ResumeTabs.vue';
import ServicesOverview from '../components/ServicesOverview.vue';
import Services from '../components/Services.vue';
import Testimonials from '../components/Testimonials.vue';
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
      <ResumeTabs />
      <ServicesOverview />
      <Services />
      <Testimonials />
      <Blog />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles for the home page */
</style>
