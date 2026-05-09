import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Narrative from "@/components/Narrative";
import FeatureStrip from "@/components/FeatureStrip";
import Location from "@/components/Location";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Narrative />
      <FeatureStrip />
      <Location />
      <Gallery />
      <Contact />
      <Footer />
      <SpeedInsights />
    </>
  );
}
