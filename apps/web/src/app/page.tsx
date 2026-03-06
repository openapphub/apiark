import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { Features } from "@/components/features";
import { Protocols } from "@/components/protocols";
import { VideoDemo } from "@/components/video-demo";
import Performance from "@/components/performance";
import ComparisonTable from "@/components/comparison-table";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Protocols />
      <VideoDemo />
      <Performance />
      <ComparisonTable />
      <CTA />
      <Footer />
    </>
  );
}
