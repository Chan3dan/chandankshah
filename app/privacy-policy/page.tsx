import LegalPageShell from "@/components/public/LegalPageShell";
import { BUSINESS_DISCLAIMER } from "@/lib/site-content";
import { getSetting, type ProfileSettings, type SocialSettings } from "@/lib/settings";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Chandan Kumar Shah digital services website and enquiry forms.",
};

export default async function PrivacyPolicyPage() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName?: string; siteTagline?: string }>,
  ]);

  return (
    <LegalPageShell
      title="Privacy Policy"
      eyebrow="Legal"
      description="How contact details, enquiry submissions, and service-related information are handled on this website."
      profile={profile}
      social={social}
      meta={meta}
    >
      <h2>Information collected</h2>
      <p>
        When you contact this website, details such as your name, phone number, email
        address, requested service, and message may be collected so enquiries can be
        reviewed and answered.
      </p>
      <h2>How information is used</h2>
      <p>
        Submitted information is used to respond to enquiries, deliver requested
        services, clarify requirements, manage bookings, and improve service quality.
        It is not sold to third parties.
      </p>
      <h2>Communication</h2>
      <p>
        By contacting this website, you agree that follow-up may happen by phone,
        WhatsApp, or email regarding your enquiry or requested service.
      </p>
      <h2>Data protection</h2>
      <p>
        Reasonable steps are taken to protect submitted information, but no online
        system can guarantee absolute security. Please avoid sending highly sensitive
        personal or financial information unless specifically requested for a real
        service need.
      </p>
      <h2>Third-party services</h2>
      <p>
        This website may use hosting, analytics, email delivery, spam protection, and
        authentication services from third-party providers. Those providers may process
        technical data needed to operate the site.
      </p>
      <h2>Independent service notice</h2>
      <p>{BUSINESS_DISCLAIMER}</p>
      <h2>Updates</h2>
      <p>
        This policy may be updated from time to time as the business, services, or
        website features evolve.
      </p>
    </LegalPageShell>
  );
}
