import { connectDB } from "./mongodb";
import { SiteSettings } from "@/models";

export interface HeroSettings {
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  bannerUrl: string;
  bannerPublicId: string;
  logoUrl: string;
  logoPublicId: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badges: string[];
  stats: { value: string; label: string }[];
  avatarLetter: string;
  resumeUrl: string;
}

export interface ProfileSettings {
  fullName: string;
  bio1: string;
  bio2: string;
  location: string;
  availability: string;
  phone: string;
  email: string;
  whatsapp: string;
  skills: { name: string; level: number; category: string }[];
  education: { degree: string; institution: string; year: string; grade?: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  languages: string[];
}

export interface NiyuktaSettings {
  show: boolean;
  headline: string;
  subheadline: string;
  description: string;
  url: string;
  features: string[];
  cta: string;
  stats: { value: string; label: string }[];
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  github: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

export interface SiteMetaSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  ogImage: string;
  favicon: string;
  googleAnalytics: string;
  maintenanceMode: boolean;
}

export interface PricingSettings {
  show: boolean;
  heading: string;
  subheading: string;
  plans: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    cta: string;
    badge?: string;
  }[];
}

const DEFAULTS = {
  hero: {
    name: "Chandan Kumar Shah",
    tagline: "BCA Student & Digital Services Specialist",
    subtitle: "Turning complexity into clarity",
    description: "I help individuals and businesses with Loksewa form filling, DEMAT accounts, documentation, academic projects, and web development — bridging traditional services with modern tech in Nepal.",
    bannerUrl: "",
    bannerPublicId: "",
    logoUrl: "",
    logoPublicId: "",
    ctaPrimary: "View Services",
    ctaSecondary: "My Portfolio",
    badges: ["BCA Student", "Loksewa Expert", "DEMAT Specialist", "Web Developer", "Documentation Consultant"],
    stats: [
      { value: "200+", label: "Clients Served" },
      { value: "98%", label: "Success Rate" },
      { value: "5+", label: "Years Active" },
      { value: "50+", label: "Projects Done" },
    ],
    avatarLetter: "C",
    resumeUrl: "/resume.pdf",
  } as HeroSettings,

  profile: {
    fullName: "Chandan Kumar Shah",
    bio1: "I'm a BCA student with a deep passion for technology and a proven track record of helping people navigate Nepal's complex government systems.",
    bio2: "From Loksewa applications to full-stack web projects, I deliver reliable, affordable, and accurate services. I also built Niyukta — a modern exam prep platform for civil service aspirants.",
    location: "Nepal",
    availability: "Mon–Sat, 9am–7pm NST",
    phone: "+977-98XXXXXXXX",
    email: "hello@chandankshah.com.np",
    whatsapp: "977980000000",
    skills: [
      { name: "Loksewa & Government Forms", level: 98, category: "Administrative" },
      { name: "DEMAT & Capital Markets", level: 93, category: "Financial" },
      { name: "Documentation & Legal", level: 96, category: "Administrative" },
      { name: "React / Next.js", level: 80, category: "Technical" },
      { name: "Academic Project Writing", level: 88, category: "Academic" },
      { name: "Database (MongoDB, SQL)", level: 75, category: "Technical" },
    ],
    education: [
      { degree: "Bachelor of Computer Applications (BCA)", institution: "Your College Name", year: "2022–2026", grade: "Running" },
      { degree: "+2 Science", institution: "Your School Name", year: "2020–2022", grade: "Distinction" },
    ],
    certifications: [
      { name: "Full Stack Web Development", issuer: "Online Platform", year: "2023" },
    ],
    languages: ["Nepali (Native)", "Hindi (Fluent)", "English (Professional)"],
  } as ProfileSettings,

  niyukta: {
    show: true,
    headline: "Prepare for Loksewa the Smart Way",
    subheadline: "Niyukta — Built by Chandan Shah",
    description: "Niyukta is a modern, adaptive exam preparation platform built specifically for Nepal's civil service aspirants. Practice with intelligent MCQs, take full mock tests, and get AI-driven insights on your weak areas.",
    url: "https://niyukta.com",
    features: [
      "Adaptive MCQ practice sets by subject",
      "Full-length mock tests with timer",
      "AI-powered performance analytics",
      "Identify and fix weak subjects",
      "Exam pressure mode simulation",
      "Track rank progress over time",
      "Nepali & English syllabus coverage",
    ],
    cta: "Start Preparing Free →",
    stats: [
      { value: "10K+", label: "Students" },
      { value: "50K+", label: "Questions" },
      { value: "95%", label: "Pass Rate" },
    ],
  } as NiyuktaSettings,

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    twitter: "",
    youtube: "",
  } as SocialSettings,

  meta: {
    siteName: "Chandan Kumar Shah",
    siteTagline: "Digital Services & Portfolio",
    siteDescription: "Professional digital services — Loksewa, DEMAT, documentation, projects, web development. BCA student, Nepal.",
    siteUrl: "https://chandankshah.com.np",
    ogImage: "",
    favicon: "",
    googleAnalytics: "",
    maintenanceMode: false,
  } as SiteMetaSettings,

  pricing: {
    show: true,
    heading: "Simple, Transparent Pricing",
    subheading: "All prices in Nepalese Rupees (NPR). No hidden fees.",
    plans: [
      {
        name: "Basic",
        price: "500",
        period: "per service",
        description: "Single service, straightforward tasks",
        features: ["Single form/document", "Standard processing", "1 revision", "WhatsApp support"],
        highlighted: false,
        cta: "Get Started",
      },
      {
        name: "Standard",
        price: "1,500",
        period: "per service",
        description: "Complex multi-step services",
        features: ["Complex documentation", "End-to-end handling", "Priority processing", "3 revisions", "Call support", "Error guarantee"],
        highlighted: true,
        cta: "Most Popular",
        badge: "Best Value",
      },
      {
        name: "Monthly",
        price: "4,000",
        period: "per month",
        description: "Unlimited requests, all services",
        features: ["Unlimited requests", "All service types", "DEMAT included", "24/7 support", "Unlimited revisions", "Consultation calls", "Priority queue"],
        highlighted: false,
        cta: "Go Premium",
      },
    ],
  } as PricingSettings,

  nav: {
    niyuktaUrl: "https://niyukta.com",
    niyuktaLabel: "Niyukta",
    showNiyuktaInNav: true,
    extraLinks: [],
  } as NavSettings,
};

export async function getSetting<T>(key: string): Promise<T> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key });
    if (doc) return doc.value as T;
    return DEFAULTS[key as keyof typeof DEFAULTS] as unknown as T;
  } catch {
    return DEFAULTS[key as keyof typeof DEFAULTS] as unknown as T;
  }
}

export async function setSetting(key: string, value: unknown) {
  await connectDB();
  await SiteSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
}

export async function getAllSettings() {
  await connectDB();
  const docs = await SiteSettings.find({});
  const result: Record<string, unknown> = { ...DEFAULTS };
  docs.forEach((d) => {
    result[d.key] = d.value;
  });
  return result;
}

export interface NavSettings {
  niyuktaUrl: string;
  niyuktaLabel: string;
  showNiyuktaInNav: boolean;
  extraLinks: { label: string; href: string; external: boolean }[];
}

// Add to DEFAULTS map
export const NAV_DEFAULTS: NavSettings = {
  niyuktaUrl: "https://niyukta.com",
  niyuktaLabel: "Niyukta",
  showNiyuktaInNav: true,
  extraLinks: [],
};
