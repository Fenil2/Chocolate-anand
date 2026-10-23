import { site } from "@/lib/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Bestsellers } from "@/components/home/Bestsellers";
import { FlavourFinder } from "@/components/home/FlavourFinder";
import { Sensory } from "@/components/home/Sensory";
import { Philosophy } from "@/components/home/Philosophy";
import { Gifting } from "@/components/home/Gifting";
import { Closing } from "@/components/home/Closing";

export default function Home() {
  return (
    <>
      <AnnouncementBar message={site.announcement} />
      <Header />
      <main id="main">
        <Hero />
        <Bestsellers />
        <FlavourFinder />
        <Sensory />
        <Philosophy />
        <Gifting />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
