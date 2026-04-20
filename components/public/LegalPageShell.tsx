import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

interface LegalPageShellProps {
  title: string;
  eyebrow: string;
  description: string;
  profile: ProfileSettings;
  social: SocialSettings;
  meta: { siteName?: string; siteTagline?: string };
  children: React.ReactNode;
}

export default function LegalPageShell({
  title,
  eyebrow,
  description,
  profile,
  social,
  meta,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,56px) 0 clamp(32px,6vw,44px)" }}>
          <div className="site-container" style={{ maxWidth: 920 }}>
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="section-title" style={{ marginBottom: 12 }}>
              {title}
            </h1>
            <p className="section-desc">{description}</p>
          </div>
        </section>

        <section style={{ padding: "clamp(40px,8vw,64px) 0" }}>
          <div className="site-container" style={{ maxWidth: 920 }}>
            <div className="card-static" style={{ padding: "clamp(24px,4vw,40px)" }}>
              <div className="prose">{children}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        profile={{
          phone: profile.phone,
          email: profile.email,
          whatsapp: profile.whatsapp,
          location: profile.location,
        }}
        social={social}
        meta={meta}
      />
    </>
  );
}
