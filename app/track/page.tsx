import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import TrackStatusClient from "@/components/public/TrackStatusClient";
import { getSetting, type ProfileSettings, type SocialSettings } from "@/lib/settings";

export const metadata = {
  title: "Track Your Request",
  description: "Track booking or enquiry progress using your Chandan Kumar Shah request tracking code.",
};

export default async function TrackPage() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; location?: string }>,
  ]);

  return (
    <>
      <Navbar />
      <TrackStatusClient />
      <Footer
        profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }}
        social={social}
        meta={meta}
      />
    </>
  );
}
