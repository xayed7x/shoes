import DesktopHero from "@/components/hero/DesktopHero";
import MobileHero from "@/components/hero/MobileHero";

/**
 * HeroSection — layout shell
 *
 * Desktop (md+): HTML/CSS composition with real text, live prices, and
 *   motion — rendered by DesktopHero (server) + DesktopHeroClient (client).
 *
 * Mobile (<md): Full-quality hero with real slide data, live prices,
 *   headline, CTA, swipe gesture, dot indicators — MobileHero (server)
 *   + MobileHeroClient (client).
 */
export default function HeroSection() {
  return (
    <>
      {/* ── Desktop hero ───────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>

      {/* ── Mobile hero (md:hidden is set on MobileHeroClient root) ────── */}
      <MobileHero />
    </>
  );
}
