import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import BookingFlow from "@/components/public/BookingFlow";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export const metadata = { title: "Book a Service" };
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  await connectDB();
  const { service: preselected } = await searchParams;
  const [servicesRaw, profile, social, meta] = await Promise.all([
    Service.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);
  const services = JSON.parse(JSON.stringify(servicesRaw));

  return (
    <>
      <Navbar />
      <BookingFlow
        services={services}
        preselectedService={preselected}
        profile={profile}
      />
      <Footer
        profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp }}
        social={social}
        meta={meta}
      />
    </>
  );
}
