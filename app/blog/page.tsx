import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

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
  const featured = posts[0];
  const rest = posts.slice(1);
  const categories = [...new Set(posts.map((p: any) => p.category))] as string[];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "56px 0 48px" }}>
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
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
                <p style={{ fontSize: 16 }}>No posts published yet. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 48 }}>
                <div>
                  {featured && (
                    <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
                      <div className="card" style={{ padding: 32 }}>
                        {featured.coverImage && (
                          <div style={{ height: 220, background: "var(--bg-subtle)", borderRadius: 12, marginBottom: 22, overflow: "hidden" }}>
                            <img src={featured.coverImage} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                          <span style={{ padding: "3px 10px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{featured.category}</span>
                          <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={12} /> {featured.readTime} min read
                          </span>
                        </div>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 400, color: "var(--ink-1)", marginBottom: 10, lineHeight: 1.2 }}>{featured.title}</h2>
                        <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7 }}>{featured.excerpt}</p>
                      </div>
                    </Link>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {rest.map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                        <div className="card" style={{ padding: 22 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                            <span style={{ padding: "2px 8px", background: "var(--bg-muted)", color: "var(--ink-4)", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{post.category}</span>
                            <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {post.readTime} min</span>
                          </div>
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400, color: "var(--ink-1)", marginBottom: 6, lineHeight: 1.2 }}>{post.title}</h3>
                          <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.65 }}>{post.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Categories</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {categories.map((cat) => (
                        <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: 8 }}>
                          <span style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}>{cat}</span>
                          <span style={{ fontSize: 12, color: "var(--ink-4)", background: "var(--bg-muted)", padding: "2px 8px", borderRadius: 99 }}>
                            {posts.filter((p: any) => p.category === cat).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Need Help?</h3>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14 }}>Questions about Loksewa, DEMAT, or any service? I&apos;m here.</p>
                    <Link href="/contact" className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>Contact Me</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp }} social={social} meta={meta} />
    </>
  );
}
