import { getSetting } from "@/lib/settings";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import ContactClient from "@/components/public/ContactClient";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export const metadata = { title: "Contact Me" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  await connectDB();
  const [profile, social, meta, servicesRaw] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
    Service.find({ isActive: true }).sort({ sortOrder: 1 }).select("title").lean(),
  ]);
  const services = JSON.parse(JSON.stringify(servicesRaw));

  return (
    <>
      <Navbar />
      <ContactClient profile={profile} social={social} services={services} />
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
