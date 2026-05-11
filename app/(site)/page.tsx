import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Stats from "@/components/sections/Stats";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import PriceEstimator from "@/components/sections/PriceEstimator";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Manifesto />
      <Services />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <PriceEstimator />
      <Process />
      <FAQ />
      <CTA />
    </>
  );
}
