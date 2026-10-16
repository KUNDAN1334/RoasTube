import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PrivacyPromise } from "@/components/landing/PrivacyPromise";
import { Showcase } from "@/components/landing/Showcase";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="w-full overflow-x-clip">
        <Hero />
        <HowItWorks />
        <Showcase />
        <PrivacyPromise />
      </main>
      <SiteFooter />
    </>
  );
}
