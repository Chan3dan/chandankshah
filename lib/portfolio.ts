import { Project } from "@/models";

export interface PortfolioProjectSeed {
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  link: string;
  githubLink: string;
  imageUrl: string;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  role?: string;
  timeframe?: string;
  status?: string;
  platform?: string;
  focusAreas?: string[];
  outcomes?: string[];
}

export const DEFAULT_PORTFOLIO_PROJECTS: PortfolioProjectSeed[] = [
  {
    title: "Niyukta Exam Preparation Platform",
    slug: "niyukta-exam-preparation-platform",
    category: "Product Platform",
    description:
      "A focused exam-preparation platform built for Nepali competitive exam learners with cleaner navigation, faster access to study flows, and a product-style user experience.",
    longDescription:
      "Niyukta is a product-oriented web platform designed to make exam preparation feel more structured and more modern. The work focused on shaping a clearer learner journey, improving page responsiveness, and presenting educational content in a way that feels easier to navigate on everyday devices.\n\nThis project fits the portfolio as a product build rather than a simple brochure site. It demonstrates interface thinking, practical deployment, and an ability to organize a user flow around a specific audience with a real use case.\n\nThe implementation emphasizes front-end clarity, mobile usability, and a polished public-facing experience that can support future feature growth.",
    tags: ["Next.js", "React", "Responsive UI", "Product UX", "Deployment", "Performance"],
    link: "https://niyukta.vercel.app/",
    githubLink: "",
    imageUrl: "",
    featured: true,
    isActive: true,
    sortOrder: 0,
    role: "Product design, frontend implementation, deployment",
    timeframe: "2025",
    status: "Live",
    platform: "Web application",
    focusAreas: ["User flow", "Responsive design", "Information architecture"],
    outcomes: [
      "Created a more product-like web presence for a focused exam audience",
      "Improved clarity of navigation and public content presentation",
      "Shipped a live deployment suitable for real users and ongoing iteration",
    ],
  },
  {
    title: "Online Quiz System",
    slug: "online-quiz-system",
    category: "Academic Web Project",
    description:
      "A timed online quiz platform with topic selection, user sessions, and dynamic question delivery backed by PHP and MySQL.",
    longDescription:
      "The Online Quiz System was built as a complete browser-based quiz platform that lets users register, choose quiz topics, and attempt timed assessments in a structured flow. The project combines a clear front end with PHP-based session handling and MySQL-backed content delivery.\n\nThis project shows practical full-stack fundamentals: stateful user sessions, database-driven question management, and a responsive interface designed to remain usable across different screen sizes. It also demonstrates the ability to deliver a working academic system as a real hosted site instead of leaving it as a local-only prototype.\n\nFrom a portfolio perspective, it represents hands-on work with classic web technologies and a clean problem-to-solution implementation.",
    tags: ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "Responsive UI"],
    link: "https://quizmaster.infinityfreeapp.com/?i=1",
    githubLink: "",
    imageUrl: "",
    featured: true,
    isActive: true,
    sortOrder: 1,
    role: "Full-stack development, UI implementation, deployment",
    timeframe: "2024-2025",
    status: "Live",
    platform: "Quiz web application",
    focusAreas: ["Session management", "Database-backed content", "Timed interactions"],
    outcomes: [
      "Delivered a working hosted quiz system with user-facing flows",
      "Implemented timed quiz behaviour and topic-based interaction",
      "Connected dynamic questions with a database-backed application structure",
    ],
  },
  {
    title: "Chandankshah.com.np Portfolio Platform",
    slug: "chandankshah-portfolio-platform",
    category: "Portfolio Website",
    description:
      "A modern portfolio and digital services platform with admin-managed content, project publishing, theme support, SEO groundwork, and production deployment.",
    longDescription:
      "This website is more than a static portfolio. It functions as a dynamic content-managed platform for services, projects, resources, testimonials, and contact workflows. The implementation includes a public-facing website and an admin side for controlling important sections without editing code each time.\n\nThe project demonstrates real delivery concerns: responsive layouts, theme consistency, structured SEO metadata, production deployment, custom domain handling, and content architecture that supports future growth. It also reflects security-aware decisions such as admin-only editing flows, controlled content entry, and practical anti-abuse groundwork for form handling.\n\nAs a portfolio project, this site best represents the ability to combine presentation, content strategy, and maintainable implementation into a production-ready web presence.",
    tags: ["Next.js", "MongoDB", "Admin CMS", "SEO", "Dark Mode", "Vercel"],
    link: "https://chandankshah.com.np/",
    githubLink: "",
    imageUrl: "",
    featured: true,
    isActive: true,
    sortOrder: 2,
    role: "Architecture, frontend, CMS workflows, deployment",
    timeframe: "2024-2026",
    status: "Live",
    platform: "Portfolio and services platform",
    focusAreas: ["Content management", "SEO", "Responsive UI", "Production delivery"],
    outcomes: [
      "Built a portfolio site that also works as a maintainable services platform",
      "Added admin-controlled content updates for core public sections",
      "Prepared the site for search visibility, structured data, and ongoing iteration",
    ],
  },
];

export function mergePortfolioProjects(rawProjects: any[] = []) {
  const dbProjects = rawProjects.map((project) => ({
    ...project,
    focusAreas: Array.isArray(project.focusAreas) ? project.focusAreas : [],
    outcomes: Array.isArray(project.outcomes) ? project.outcomes : [],
  }));

  const bySlug = new Map(dbProjects.map((project) => [project.slug, project]));
  const merged = DEFAULT_PORTFOLIO_PROJECTS.map((seed) => ({
    ...seed,
    ...(bySlug.get(seed.slug) || {}),
  }));

  const extra = dbProjects.filter((project) => !DEFAULT_PORTFOLIO_PROJECTS.some((seed) => seed.slug === project.slug));

  return [...merged, ...extra].sort((a, b) => {
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    return String(a.title).localeCompare(String(b.title));
  });
}

export async function syncDefaultPortfolioProjects() {
  try {
    await Promise.all(
      DEFAULT_PORTFOLIO_PROJECTS.map((project) =>
        Project.updateOne(
          { slug: project.slug },
          { $setOnInsert: project },
          { upsert: true },
        ),
      ),
    );
  } catch {
    // Keep reads resilient when the database is unavailable.
  }
}
