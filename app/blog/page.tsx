import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import BlogIndexClient from "@/components/public/BlogIndexClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
  description:
    "Read practical guides, service explainers, documentation tips, and web development insights written for clients and users across Nepal.",
  keywords: ["blog Chandan Shah", "Loksewa guides", "DEMAT guides Nepal", "web development blog Nepal"],
});
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
        <section className="public-page-hero">
          <div className="site-container">
            <div className="public-page-head">
              <nav className="public-page-breadcrumbs">
                <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={13} />
                <span>Blog</span>
              </nav>
              <div className="public-page-copy">
                <p className="section-eyebrow">Articles & Updates</p>
                <h1 className="section-title">Blog</h1>
                <p className="section-desc">Practical tips, service guides, and digital insights written to be easy to read on mobile, tablet, and desktop alike.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="site-container public-page-shell">
            <BlogIndexClient posts={posts} />
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
