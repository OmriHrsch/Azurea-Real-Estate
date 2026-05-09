import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Narrative from "@/components/Narrative";
import FeatureStrip from "@/components/FeatureStrip";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Narrative />
      <FeatureStrip />
      <SpeedInsights />
    </>
  );
}
