import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Tracker } from "@/components/analytics/Tracker";
import { getProfile } from "@/lib/data/public";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <>
      <Header />
      <main id="contenu" className="min-h-dvh">
        {children}
      </main>
      <Footer profile={profile} />
      <DemoBanner />
      <RevealObserver />
      <Tracker />
    </>
  );
}
