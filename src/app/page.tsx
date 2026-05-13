import HeroSection from "@/components/sections/HeroSection";
import {
  NewArrivals,
  TrendingProducts,
  EditorialShowcase,
  BrandStory,
  Bestsellers,
  Testimonials,
} from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NewArrivals />
      <EditorialShowcase />
      <TrendingProducts />
      <BrandStory />
      <Bestsellers />
      <Testimonials />
    </>
  );
}
