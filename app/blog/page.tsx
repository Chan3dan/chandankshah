import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import BlogIndexClient from "@/components/public/BlogIndexClient";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();
  const [postsRaw, profile, social, meta] = await Promise.all([
    BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).select("-content").lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);
  const posts = JSON.parse(JSON.stringify(postsRaw));

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,56px) 0 clamp(36px,7vw,48px)" }}>
          <div className="site-container">
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span>Blog</span>
            </nav>
            <p className="section-eyebrow">Articles & Updates</p>
            <h1 className="section-title" style={{ marginBottom: 12 }}>Blog</h1>
            <p className="section-desc">Tips, guides, and insights on Loksewa preparation, DEMAT investing, and digital services in Nepal.</p>
          </div>
        </section>

        <section className="section">
          <div className="site-container">
            <BlogIndexClient posts={posts} />
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
