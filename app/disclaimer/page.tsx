import LegalPageShell from "@/components/public/LegalPageShell";
import { BUSINESS_DISCLAIMER } from "@/lib/site-content";
import { getSetting, type ProfileSettings, type SocialSettings } from "@/lib/settings";

export const metadata = {
  title: "Disclaimer",
  description: "Important independent-service disclaimer for Chandan Kumar Shah digital assistance.",
};

export default async function DisclaimerPage() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName?: string; siteTagline?: string }>,
  ]);

  return (
    <LegalPageShell
      title="Disclaimer"
      eyebrow="Legal"
      description="Important clarification about the nature of the services provided through this website."
      profile={profile}
      social={social}
      meta={meta}
    >
      <h2>Independent assistance</h2>
      <p>{BUSINESS_DISCLAIMER}</p>
      <h2>No official representation</h2>
      <p>
        Content on this website should not be interpreted as an official announcement,
        government notice, legal ruling, banking instruction, or regulatory advice.
      </p>
      <h2>No guarantee of external outcomes</h2>
      <p>
        Submission success can be improved through careful preparation, but final
        outcomes depend on official systems, institutional checks, public notices,
        platform rules, and document validity.
      </p>
      <h2>Client verification</h2>
      <p>
        Clients should verify important deadlines, eligibility criteria, and official
        requirements from the relevant authority before making final decisions.
      </p>
    </LegalPageShell>
  );
}
