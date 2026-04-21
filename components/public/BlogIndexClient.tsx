"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, PenSquare, Search } from "lucide-react";

type BlogPostSummary = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  readTime: number;
};

export default function BlogIndexClient({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.excerpt, post.category].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, posts, query]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <PenSquare size={42} />
        </div>
        <p style={{ fontSize: "clamp(14px,2vw,16px)" }}>No posts published yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card-static" style={{ padding: "clamp(20px,4vw,28px)", marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, alignItems: "end" }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 10 }}>Discover Articles Faster</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem,3vw,2.1rem)", fontWeight: 400, color: "var(--ink-1)", margin: 0 }}>
              Search by topic, category, or intent
            </h2>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)", borderRadius: 14, padding: "0 14px", minHeight: 48, background: "var(--surface)" }}>
            <Search size={16} color="var(--ink-4)" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Loksewa, DEMAT, forms, website..."
              style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 16, color: "var(--ink-1)", fontFamily: "var(--font-sans)" }}
            />
          </label>
        </div>

        <div className="page-chip-row" style={{ marginTop: 18 }}>
          {categories.map((category) => {
            const active = category === activeCategory;
            const count = category === "All" ? posts.length : posts.filter((post) => post.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                style={{
                  minHeight: 40,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                  background: active ? "var(--blue)" : "var(--surface)",
                  color: active ? "#fff" : "var(--ink-2)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {category} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card-static" style={{ padding: "clamp(26px,5vw,36px)", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", marginBottom: 10 }}>No articles match this search</h3>
          <p style={{ margin: "0 auto 18px", maxWidth: 620, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7 }}>
            Try a different keyword or switch to another category. You can also contact directly if you need help with a specific process.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-secondary" onClick={() => { setQuery(""); setActiveCategory("All"); }}>
              Clear Filters
            </button>
            <Link href="/contact" className="btn btn-primary">Contact Me</Link>
          </div>
        </div>
      ) : (
        <div className="sidebar-layout-wide">
          <div>
            {featured && (
              <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
                <div className="card" style={{ padding: 32 }}>
                  {featured.coverImage && (
                    <div style={{ height: 220, background: "var(--bg-subtle)", borderRadius: 12, marginBottom: 22, overflow: "hidden" }}>
                      <img src={featured.coverImage} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
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

            <div className="card-list">
              {rest.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: 22 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ padding: "2px 8px", background: "var(--bg-muted)", color: "var(--ink-4)", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{post.category}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={11} /> {post.readTime} min
                      </span>
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
              <div className="card-list" style={{ gap: 8 }}>
                {categories.filter((category) => category !== "All").map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: activeCategory === category ? "var(--blue-bg)" : "var(--bg-subtle)",
                      borderRadius: 8,
                      border: "1px solid transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>{category}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-4)", background: "var(--bg-muted)", padding: "2px 8px", borderRadius: 99 }}>
                      {posts.filter((post) => post.category === category).length}
                    </span>
                  </button>
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
  );
}
