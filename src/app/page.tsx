import { Header } from "@/components/Header";
import { LandingPage } from "@/components/landing/LandingPage";
import { getLandingStats } from "@/lib/landing/stats";

export default async function Home() {
  const stats = await getLandingStats();

  return (
    <div className="min-h-screen bg-canvas">
      <Header showFeaturesLink />
      <LandingPage stats={stats} />
    </div>
  );
}
