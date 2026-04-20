import LegalPageShell from "@/components/public/LegalPageShell";
import { getSetting, type ProfileSettings, type SocialSettings } from "@/lib/settings";

export const metadata = {
  title: "Refund & Revision Policy",
  description: "Refund and revision policy for Chandan Kumar Shah digital support services.",
};

export default async function RefundPolicyPage() {
  const [profile, social, meta] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName?: string; siteTagline?: string }>,
  ]);

  return (
    <LegalPageShell
      title="Refund & Revision Policy"
      eyebrow="Legal"
      description="How revision requests, scope changes, and refund situations are handled for digital services."
      profile={profile}
      social={social}
      meta={meta}
    >
      <h2>Revision-first approach</h2>
      <p>
        The preferred approach is to resolve genuine service issues through correction
        and revision wherever practical, especially when the original requirement was
        shared correctly and the issue is within the agreed scope.
      </p>
      <h2>When refunds may be considered</h2>
      <p>
        Partial or full refunds may be considered if work has not started, if a booking
        cannot be fulfilled at all, or if a confirmed scope cannot be delivered due to
        an internal issue.
      </p>
      <h2>When refunds usually do not apply</h2>
      <p>
        Refunds usually do not apply to completed consultation time, work already
        delivered, delays caused by missing client information, or outcomes controlled
        by third-party institutions or platforms.
      </p>
      <h2>Scope changes</h2>
      <p>
        If your requirement changes substantially after work begins, the request may be
        treated as a new or expanded scope instead of a refund case.
      </p>
      <h2>How to request help</h2>
      <p>
        If you believe there is a service issue, contact support with your name, the
        service used, and a short explanation so the matter can be reviewed fairly.
      </p>
    </LegalPageShell>
  );
}
