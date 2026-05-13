import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Stats from "@/components/sections/Stats";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";

// ISR: render once at build, revalidate every 5 minutes. Combined with the
// Cache-Control header in next.config.ts this lets Cloudflare + Vercel cache
// the HTML at edge so repeat visitors don't pay the us-east-1 SSR round-trip.
export const revalidate = 300;
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
