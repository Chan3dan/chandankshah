import Link from "next/link";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import { getSetting } from "@/lib/settings";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export default async function NotFound() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section className="section">
          <div className="site-container">
            <div
              className="card-static"
              style={{
                padding: "clamp(28px, 6vw, 56px)",
                textAlign: "center",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              <p className="section-eyebrow" style={{ justifyContent: "center" }}>
                Page Not Found
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontWeight: 400,
                  margin: "0 0 12px",
                  color: "var(--ink-1)",
                }}
              >
                This page does not exist
              </h1>
              <p
                style={{
                  fontSize: "clamp(15px, 2vw, 17px)",
                  color: "var(--ink-3)",
                  lineHeight: 1.8,
                  margin: "0 auto 24px",
                  maxWidth: 560,
                }}
              >
                The page may have moved, the link may be outdated, or the address may have been typed incorrectly.
              </p>
              <div className="stack-actions" style={{ justifyContent: "center" }}>
                <Link href="/" className="btn btn-primary">
                  Back to Home
                </Link>
                <Link href="/services" className="btn btn-secondary">
                  Browse Services
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }}
        social={social}
        meta={meta}
      />
    </>
  );
}
