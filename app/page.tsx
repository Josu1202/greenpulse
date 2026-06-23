import { MainLayout } from "@/components/layout";
import { FeatureGrid, Hero } from "@/components/home";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <FeatureGrid />
    </MainLayout>
  );
}