import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChevronRight, ArrowLeft, Calendar } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export const revalidate = 60;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug }).lean() as any;
  return { title: post?.title || "Blog Post", description: post?.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const [post, relatedRaw, profile, social, meta] = await Promise.all([
    BlogPost.findOne({ slug, isPublished: true }).lean() as Promise<any>,
    BlogPost.find({ isPublished: true, slug: { $ne: slug } }).limit(3).select("-content").lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);
  if (!post) notFound();
  const p = JSON.parse(JSON.stringify(post));
  const related = JSON.parse(JSON.stringify(relatedRaw));

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* Header */}
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "52px 0 44px" }}>
          <div className="site-container" style={{ maxWidth: 800 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20 }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <Link href="/blog" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Blog</Link>
              <ChevronRight size={13} />
              <span style={{ color: "var(--ink-2)" }}>{p.title}</span>
            </nav>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <span style={{ padding: "3px 10px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{p.category}</span>
              <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} /> {p.readTime} min read
              </span>
              {p.publishedAt && (
                <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} /> {new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.15, marginBottom: 14 }}>
              {p.title}
            </h1>
            {p.excerpt && <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.75 }}>{p.excerpt}</p>}
          </div>
        </section>

        {/* Cover image */}
        {p.coverImage && (
          <div className="site-container" style={{ maxWidth: 800, marginTop: 32 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={p.coverImage} alt={p.title} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        )}

        {/* Article body */}
        <article className="section-sm">
          <div className="site-container" style={{ maxWidth: 800 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 48 }}>
              <div className="prose" dangerouslySetInnerHTML={{ __html: p.content?.replace(/\n/g, "<br/>") || "" }} />

              {/* Sidebar */}
              <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Tags */}
                {p.tags?.length > 0 && (
                  <div className="card-static" style={{ padding: 20 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Tags</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tags.map((t: string) => (
                        <span key={t} style={{ padding: "3px 9px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, color: "var(--ink-4)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author card */}
                <div className="card-static" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 18, color: "#fff" }}>C</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{profile.fullName}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-4)" }}>BCA Student · Digital Services</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 12 }}>
                    Professional services for Loksewa, DEMAT, documentation, and more.
                  </p>
                  <Link href="/contact" className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                    Get a Service
                  </Link>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                  <div className="card-static" style={{ padding: 20 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>More Articles</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {related.map((r: any) => (
                        <Link key={r._id} href={`/blog/${r.slug}`} style={{ display: "block", textDecoration: "none" }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)", marginBottom: 2, lineHeight: 1.3 }}>{r.title}</p>
                          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{r.readTime} min read</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
              <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
                <ArrowLeft size={14} /> Back to Blog
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp }} social={social} meta={meta} />
    </>
  );
}
