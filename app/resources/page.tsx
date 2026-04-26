import { connectDB } from "@/lib/mongodb";
import { Resource } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import ResourcesClient from "@/components/public/ResourcesClient";
import { FAQSchema } from "@/components/public/StructuredData";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Free Loksewa & DEMAT Resources",
  path: "/resources",
  description:
    "Free study materials, syllabus PDFs, digital guides, and downloadable resources for Loksewa preparation, DEMAT setup, and online service workflows in Nepal.",
  keywords: ["Loksewa resources", "DEMAT guide Nepal", "free study materials Nepal", "digital service resources"],
});
export const dynamic = "force-dynamic";

const LOKSEWA_FAQS = [
  { question: "What documents are needed for a Loksewa application?", answer: "You need citizenship certificate copy, academic certificates, PP-size photo, and application fee receipt. Specific posts may require additional documents." },
  { question: "How do I fill a PSC application form correctly?", answer: "Fill your name exactly as on citizenship, choose the correct post/level, attach certified copies of all certificates, and double-check roll number. Use our form filling service for guaranteed accuracy." },
  { question: "What is the Loksewa exam syllabus for section officer?", answer: "The Section Officer exam covers General Knowledge, Nepali, English, and subject-specific papers. Download our syllabus PDF below for the complete breakdown." },
  { question: "How long does DEMAT account opening take in Nepal?", answer: "DEMAT account opening at CDSC typically takes 1–3 business days after document submission. With our assisted service, we ensure your documents are complete before submission." },
];

export default async function ResourcesPage() {
  await connectDB();
  const [resourcesRaw, profile, social, meta] = await Promise.all([
    Resource.find({ isActive: true }).sort({ isFeatured: -1, sortOrder: 1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; siteUrl?: string }>,
  ]);
  const resources = JSON.parse(JSON.stringify(resourcesRaw));
  const BASE = (meta as any).siteUrl || "https://chandankshah.com.np";

  return (
    <>
      <FAQSchema faqs={LOKSEWA_FAQS} />
      <Navbar />
      <ResourcesClient resources={resources} profile={profile} />
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
