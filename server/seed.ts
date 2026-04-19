import mongoose from "mongoose";

// ── Schemas (standalone, no import from /models to avoid Next.js deps) ─────

const ServiceSchema = new mongoose.Schema(
  { title: String, slug: String, icon: String, description: String, longDescription: { type: String, default: "" }, features: [String], price: String, priceNote: { type: String, default: "" }, color: String, badge: String, category: String, isActive: { type: Boolean, default: true }, sortOrder: Number },
  { timestamps: true }
);
const ProjectSchema = new mongoose.Schema(
  { title: String, slug: String, category: String, description: String, longDescription: { type: String, default: "" }, tags: [String], link: String, githubLink: String, imageUrl: String, featured: Boolean, isActive: { type: Boolean, default: true }, sortOrder: Number },
  { timestamps: true }
);
const TestimonialSchema = new mongoose.Schema(
  { name: String, role: String, company: String, text: String, rating: Number, avatarInitial: String, avatarColor: String, service: String, isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false } },
  { timestamps: true }
);
const BlogPostSchema = new mongoose.Schema(
  { title: String, slug: String, excerpt: String, content: String, coverImage: String, tags: [String], category: String, isPublished: Boolean, publishedAt: Date, readTime: Number },
  { timestamps: true }
);
const SiteSettingsSchema = new mongoose.Schema(
  { key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

// ── Seed Data ────────────────────────────────────────────────────────────────

const SERVICES = [
  { title: "Loksewa Form Filling", slug: "loksewa-form-filling", icon: "🏛️", category: "Government", color: "#2563eb", badge: "Most Popular", price: "Rs. 300–800", priceNote: "Price depends on form complexity", description: "Expert assistance with PSC, TSC, and all government job application forms. Error-free, deadline-aware service.", longDescription: "We help you navigate the complex process of filling Loksewa applications with precision. From choosing the right post level to submitting your form on time, every field is double-checked.", features: ["PSC Applications", "TSC Forms", "All Levels", "Application Review", "Deadline Tracking", "Document Checklist"], isActive: true, sortOrder: 0 },
  { title: "DEMAT & Mero Share", slug: "demat-mero-share", icon: "📈", category: "Financial", color: "#059669", badge: "High Demand", price: "Rs. 500", priceNote: "One-time setup fee", description: "Complete DEMAT account setup, Mero Share registration, IPO applications, and ongoing share management.", longDescription: "Open your DEMAT account at CDSC, register on Mero Share, and start applying for IPOs — all with guided, step-by-step assistance.", features: ["DEMAT Account Opening", "Mero Share Registration", "CDSC KYC Update", "IPO Application", "Share Portfolio Help", "CRN Linking"], isActive: true, sortOrder: 1 },
  { title: "Documentation Services", slug: "documentation", icon: "📋", category: "Government", color: "#7c3aed", price: "Rs. 400–700", description: "Citizenship, passport, PAN card, NOC, and all government document assistance from start to finish.", features: ["Citizenship Certificate", "Passport Renewal", "PAN Card", "NOC & Certificates", "Recommendation Letters", "Document Help"], isActive: true, sortOrder: 2 },
  { title: "Academic Projects", slug: "academic-projects", icon: "📚", category: "Academic", color: "#d97706", price: "Rs. 1,500–3,000", priceNote: "Based on word count", description: "Research papers, project reports, presentations for BBS, BBA, BCA, and BIT students.", features: ["BCA/BIT Reports", "BBS/BBA Reports", "Research Papers", "Data Analysis", "Presentations", "Plagiarism-Free"], isActive: true, sortOrder: 3 },
  { title: "Web Development", slug: "web-development", icon: "💻", category: "Technical", color: "#0ea5e9", price: "Rs. 5,000+", priceNote: "Based on complexity", description: "Websites, landing pages, portfolios, and small web apps using React, Next.js, and modern tools.", features: ["Static Websites", "Portfolio Sites", "React / Next.js", "Vercel Deployment", "Domain Setup", "Basic SEO"], isActive: true, sortOrder: 4 },
  { title: "Digital Assistance", slug: "digital-assistance", icon: "🌐", category: "Digital", color: "#ec4899", price: "Rs. 200–500", description: "Online portal registrations, digital signature setup, internet banking, and e-government services.", features: ["Portal Registration", "Digital Signature", "Internet Banking", "E-Gov Services", "Form Submission", "App Guidance"], isActive: true, sortOrder: 5 },
];

const PROJECTS = [
  { title: "Niyukta — Exam Prep Platform", slug: "niyukta", category: "Web Application", description: "A full-stack exam prep platform for Nepal's Loksewa civil service aspirants. Adaptive MCQs, mock tests, AI insights.", longDescription: "Built with Next.js, MongoDB, and TypeScript. Features adaptive question banks, full mock exams with timers, personalized analytics, and a mobile-first UI.", tags: ["Next.js", "React", "TypeScript", "MongoDB", "Tailwind CSS"], link: "https://niyukta.com", featured: true, isActive: true, sortOrder: 0 },
  { title: "Personal Portfolio Website", slug: "personal-portfolio", category: "Web Development", description: "This very website — fully dynamic, admin-controlled, built with Next.js 15, MongoDB, and NextAuth.", tags: ["Next.js", "MongoDB", "NextAuth", "Vercel", "TypeScript"], link: "https://chandankshah.com.np", featured: true, isActive: true, sortOrder: 1 },
  { title: "Loksewa Success Campaign", slug: "loksewa-campaign", category: "Service Project", description: "Assisted 50+ candidates with PSC applications. 43 selected — 86% success rate.", tags: ["Loksewa", "PSC", "Government Forms"], featured: false, isActive: true, sortOrder: 2 },
  { title: "Community DEMAT Drive", slug: "community-demat-drive", category: "Financial Services", description: "Helped 80 community members open DEMAT accounts and apply for IPOs. 68 received allotments.", tags: ["DEMAT", "Mero Share", "IPO"], featured: false, isActive: true, sortOrder: 3 },
];

const TESTIMONIALS = [
  { name: "Ram Bahadur Thapa", role: "Government Employee", text: "Chandan helped me fill my Loksewa form perfectly. I got selected on the first attempt! His attention to detail is truly exceptional.", rating: 5, avatarInitial: "R", avatarColor: "#2563eb", service: "Loksewa Form Filling", isActive: true, isFeatured: true },
  { name: "Sita Kumari Sharma", role: "Teacher, Kathmandu", text: "My TSC application was completed within a day. Very professional. The process seemed so complicated but was made easy.", rating: 5, avatarInitial: "S", avatarColor: "#059669", service: "Loksewa Form Filling", isActive: true, isFeatured: true },
  { name: "Bikash Poudel", role: "Investor, Pokhara", text: "DEMAT and Mero Share set up in no time. Already received 3 IPO allotments in the first month. Great service!", rating: 5, avatarInitial: "B", avatarColor: "#7c3aed", service: "DEMAT & Mero Share", isActive: true, isFeatured: true },
  { name: "Anjali Thapa", role: "BBA Student", text: "My final project report was done perfectly within the deadline. Got a distinction. Will use again!", rating: 5, avatarInitial: "A", avatarColor: "#d97706", service: "Academic Projects", isActive: true, isFeatured: false },
  { name: "Hari Prasad Nepal", role: "Civil Servant", text: "Passport renewed in just 7 days. Documentation help was smooth and completely hassle-free.", rating: 5, avatarInitial: "H", avatarColor: "#0ea5e9", service: "Documentation", isActive: true, isFeatured: false },
];

const BLOG_POSTS = [
  { title: "How to Fill a Loksewa Application Form — Step by Step", slug: "how-to-fill-loksewa-form", category: "Loksewa Guide", excerpt: "A complete guide to filling PSC application forms correctly the first time, avoiding common mistakes that lead to rejections.", content: `<h2>Introduction</h2>\n<p>Every year, thousands of Loksewa applications are rejected due to simple filling errors. This guide walks you through each section carefully.</p>\n<h2>Step 1: Choose the Right Post</h2>\n<p>Before filling anything, confirm the post level, service group, and sub-group matches your qualifications exactly.</p>\n<h2>Step 2: Personal Information</h2>\n<p>Fill your name exactly as it appears on your citizenship certificate. Even minor spelling differences can cause issues.</p>\n<h2>Step 3: Educational Qualifications</h2>\n<p>List qualifications from highest to lowest. Attach certified copies of all certificates.</p>\n<h2>Conclusion</h2>\n<p>Need help? Contact me directly and I'll guide you through the process.</p>`, tags: ["Loksewa", "PSC", "Government", "Tips"], isPublished: true, publishedAt: new Date(), readTime: 5 },
  { title: "DEMAT Account in Nepal — Complete Beginner's Guide 2024", slug: "demat-account-nepal-guide", category: "Finance", excerpt: "Everything you need to know about opening a DEMAT account in Nepal, registering on Mero Share, and applying for IPOs.", content: `<h2>What is a DEMAT Account?</h2>\n<p>A DEMAT (Dematerialized) account holds your shares in electronic form. In Nepal, it's managed through CDSC.</p>\n<h2>Requirements</h2>\n<ul><li>Citizenship certificate copy</li><li>Bank account details</li><li>Passport-size photo</li><li>Mobile number linked to your bank</li></ul>\n<h2>Opening Process</h2>\n<p>Visit any CDSC-registered broker with your documents, or use my service for guided assistance.</p>`, tags: ["DEMAT", "Mero Share", "IPO", "Nepal Finance"], isPublished: true, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), readTime: 6 },
];

const DEFAULT_SETTINGS = [
  { key: "hero", value: { name: "Chandan Kumar Shah", tagline: "BCA Student & Digital Services Specialist", subtitle: "Turning complexity into clarity", description: "I help individuals and businesses with Loksewa form filling, DEMAT accounts, documentation, academic projects, and web development — bridging traditional services with modern tech in Nepal.", ctaPrimary: "View Services", ctaSecondary: "My Portfolio", badges: ["🎓 BCA Student", "🏛️ Loksewa Expert", "📊 DEMAT Specialist", "💻 Web Developer", "📋 Docs Consultant"], stats: [{ value: "200+", label: "Clients Served" }, { value: "98%", label: "Success Rate" }, { value: "5+", label: "Years Active" }, { value: "50+", label: "Projects Done" }], avatarLetter: "C", resumeUrl: "/resume.pdf" } },
  { key: "profile", value: { fullName: "Chandan Kumar Shah", bio1: "I'm a BCA student with a passion for technology and a proven track record of helping people navigate Nepal's complex government systems.", bio2: "From Loksewa applications to full-stack web projects, I deliver reliable, affordable services. I also built Niyukta — a modern exam prep platform for civil service aspirants.", location: "Nepal", availability: "Mon–Sat, 9am–7pm NST", phone: "+977-98XXXXXXXX", email: "hello@chandankshah.com.np", whatsapp: "977980000000", skills: [{ name: "Loksewa & Government Forms", level: 98, category: "Administrative" }, { name: "DEMAT & Capital Markets", level: 93, category: "Financial" }, { name: "Documentation & Legal", level: 96, category: "Administrative" }, { name: "React / Next.js", level: 80, category: "Technical" }, { name: "Academic Project Writing", level: 88, category: "Academic" }], education: [{ degree: "Bachelor of Computer Applications (BCA)", institution: "Your College Name", year: "2022–2026", grade: "Running" }, { degree: "+2 Science", institution: "Your School Name", year: "2020–2022", grade: "Distinction" }], certifications: [{ name: "Full Stack Web Development", issuer: "Online Platform", year: "2023" }], languages: ["Nepali (Native)", "Hindi (Fluent)", "English (Professional)"] } },
  { key: "niyukta", value: { show: true, headline: "Prepare for Loksewa the Smart Way", subheadline: "Niyukta — Built by Chandan Shah", description: "Niyukta is a modern, adaptive exam preparation platform built specifically for Nepal's civil service aspirants.", url: "https://niyukta.com", features: ["Adaptive MCQ practice sets by subject", "Full-length mock tests with timer", "AI-powered performance analytics", "Identify and fix weak subjects", "Exam pressure mode simulation", "Track rank progress over time"], cta: "Start Preparing Free →", stats: [{ value: "10K+", label: "Students" }, { value: "50K+", label: "Questions" }, { value: "95%", label: "Pass Rate" }] } },
  { key: "nav", value: { niyuktaUrl: "https://niyukta.com", niyuktaLabel: "Niyukta", showNiyuktaInNav: true, extraLinks: [] } },
  { key: "social", value: { facebook: "https://facebook.com/", instagram: "https://instagram.com/", github: "https://github.com/", linkedin: "https://linkedin.com/in/", twitter: "", youtube: "" } },
  { key: "meta", value: { siteName: "Chandan Kumar Shah", siteTagline: "Digital Services & Portfolio", siteDescription: "Professional digital services in Nepal — Loksewa, DEMAT, documentation, web development.", siteUrl: "https://chandankshah.com.np", googleAnalytics: "", maintenanceMode: false } },
  { key: "pricing", value: { show: true, heading: "Simple, Transparent Pricing", subheading: "All prices in Nepalese Rupees (NPR). No hidden fees.", plans: [{ name: "Basic", price: "500", period: "per service", description: "Single service, straightforward tasks", features: ["Single form/document", "Standard processing", "1 revision", "WhatsApp support"], highlighted: false, cta: "Get Started" }, { name: "Standard", price: "1,500", period: "per service", description: "Complex multi-step services", features: ["Complex documentation", "End-to-end handling", "Priority processing", "3 revisions", "Call support", "Error guarantee"], highlighted: true, cta: "Most Popular", badge: "Best Value" }, { name: "Monthly", price: "4,000", period: "per month", description: "Unlimited requests, all services", features: ["Unlimited requests", "All service types", "DEMAT included", "24/7 support", "Unlimited revisions", "Consultation calls"], highlighted: false, cta: "Go Premium" }] } },
];

const ResourceSchema = new mongoose.Schema({
  title: String, description: String, category: String, type: String,
  fileUrl: { type: String, default: "" }, externalUrl: { type: String, default: "" },
  thumbnail: { type: String, default: "" }, tags: [String],
  downloadCount: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }, requiresEmail: { type: Boolean, default: false },
  sortOrder: Number,
}, { timestamps: true });
const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

const RESOURCES = [
  { title: "Loksewa PSC Syllabus 2081 — Section Officer", description: "Complete syllabus for Section Officer (Non-Technical) Gazetted Third Class examination.", category: "Loksewa", type: "pdf", externalUrl: "https://psc.gov.np", tags: ["PSC", "Syllabus", "Section Officer"], isFeatured: true, isActive: true, sortOrder: 0 },
  { title: "Loksewa Form Filling — Step by Step Guide", description: "A practical guide showing exactly how to fill PSC application forms without errors.", category: "Loksewa", type: "pdf", externalUrl: "https://psc.gov.np", tags: ["PSC", "Form Filling", "Guide"], isFeatured: true, isActive: true, sortOrder: 1 },
  { title: "DEMAT Account Opening Checklist", description: "Complete checklist of all documents required to open a DEMAT account in Nepal.", category: "DEMAT & Finance", type: "pdf", externalUrl: "https://cdsc.com.np", tags: ["DEMAT", "CDSC", "Checklist"], isFeatured: true, isActive: true, sortOrder: 2 },
  { title: "Mero Share Registration Guide", description: "Step-by-step Mero Share registration and IPO application tutorial.", category: "DEMAT & Finance", type: "link", externalUrl: "https://meroshare.cdsc.com.np", tags: ["Mero Share", "IPO", "Tutorial"], isActive: true, sortOrder: 3 },
  { title: "Citizenship Certificate — Documents Required", description: "Official list of documents needed for citizenship certificate in Nepal.", category: "Documentation", type: "pdf", externalUrl: "https://moha.gov.np", tags: ["Citizenship", "Documents", "Nepal"], isActive: true, sortOrder: 4 },
  { title: "BCA Final Year Project Report Template", description: "Editable template for BCA project reports following Tribhuvan University format.", category: "Academic", type: "doc", externalUrl: "#", tags: ["BCA", "Project Report", "Template", "TU"], isActive: true, sortOrder: 5 },
];

// ── Main seed function ────────────────────────────────────────────────────────

export async function seedDatabase(force = false) {
  const existing = {
    services: await Service.countDocuments(),
    projects: await Project.countDocuments(),
    testimonials: await Testimonial.countDocuments(),
  };

  const hasData = existing.services > 0 || existing.projects > 0;

  if (hasData && !force) {
    return { message: "Data already exists. Use force:true to re-seed.", existing, skipped: true };
  }

  if (force || hasData) {
    await Promise.all([
      Service.deleteMany({}),
      Project.deleteMany({}),
      Testimonial.deleteMany({}),
      BlogPost.deleteMany({}),
      SiteSettings.deleteMany({}),
      Resource.deleteMany({}),
    ]);
  }

  await Promise.all([
    Service.insertMany(SERVICES),
    Project.insertMany(PROJECTS),
    Testimonial.insertMany(TESTIMONIALS),
    BlogPost.insertMany(BLOG_POSTS),
    Resource.insertMany(RESOURCES),
  ]);

  // Upsert settings
  for (const setting of DEFAULT_SETTINGS) {
    await SiteSettings.findOneAndUpdate({ key: setting.key }, { value: setting.value }, { upsert: true });
  }

  return {
    seeded: {
      services: SERVICES.length,
      projects: PROJECTS.length,
      testimonials: TESTIMONIALS.length,
      blogPosts: BLOG_POSTS.length,
      resources: RESOURCES.length,
      settings: DEFAULT_SETTINGS.length,
    },
  };
}

