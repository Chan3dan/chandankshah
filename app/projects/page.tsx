import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { mergePortfolioProjects, syncDefaultPortfolioProjects } from "@/lib/portfolio";
import ProjectsPortfolioClient from "@/components/public/ProjectsPortfolioClient";

export const metadata = buildMetadata({
  title: "Portfolio & Projects",
  path: "/projects",
  description:
    "Explore web products, portfolio systems, and practical delivery projects built by Chandan Kumar Shah with attention to structure, responsiveness, and real-world usability.",
  keywords: ["portfolio Nepal developer", "projects Chandan Shah", "web development portfolio Nepal", "web application portfolio"],
});
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await connectDB();
  await syncDefaultPortfolioProjects();
  const [projectsRaw, profile, social, meta] = await Promise.all([
    Project.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);

  const projects = mergePortfolioProjects(JSON.parse(JSON.stringify(projectsRaw)));

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <ProjectsPortfolioClient projects={projects} />
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
