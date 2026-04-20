import LegalPageShell from "@/components/public/LegalPageShell";
import { BUSINESS_DISCLAIMER } from "@/lib/site-content";
import { getSetting, type ProfileSettings, type SocialSettings } from "@/lib/settings";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for Chandan Kumar Shah digital support and consulting services.",
};

export default async function TermsOfServicePage() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName?: string; siteTagline?: string }>,
  ]);

  return (
    <LegalPageShell
      title="Terms of Service"
      eyebrow="Legal"
      description="Basic service terms for enquiries, bookings, revisions, and digital support provided through this website."
      profile={profile}
      social={social}
      meta={meta}
    >
      <h2>Scope of service</h2>
      <p>
        Services offered through this website include digital assistance, guidance,
        document-related support, online form help, technical work, and consulting as
        described on relevant pages.
      </p>
      <h2>Client responsibilities</h2>
      <p>
        Clients are responsible for sharing accurate information, complete documents,
        correct spellings, and timely responses. Delays or errors caused by incomplete
        or incorrect client information remain the client&apos;s responsibility.
      </p>
      <h2>Pricing and timing</h2>
      <p>
        Displayed prices are starting points or standard package rates. Final cost and
        turnaround can vary depending on complexity, urgency, third-party platform
        availability, and revision needs.
      </p>
      <h2>Revisions</h2>
      <p>
        Reasonable revisions are provided within the selected package or agreed scope.
        Major scope changes, new requirements, or additional submissions may require a
        separate quote.
      </p>
      <h2>Service limitations</h2>
      <p>
        Approval, issuance, selection, and final decisions remain with the relevant
        institution, platform, authority, or reviewing body. Assistance with a process
        does not guarantee approval or final acceptance.
      </p>
      <h2>Independent business notice</h2>
      <p>{BUSINESS_DISCLAIMER}</p>
      <h2>Changes to terms</h2>
      <p>
        These terms may be updated as services, pricing structures, and operational
        processes change.
      </p>
    </LegalPageShell>
  );
}
