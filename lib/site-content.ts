export const BUSINESS_DISCLAIMER =
  "Chandan Kumar Shah provides independent digital assistance and consultation services. This website and its services are not affiliated with, endorsed by, or acting on behalf of any government office, regulator, bank, or public authority.";

export const SERVICE_PROMISES = [
  {
    title: "Clear communication",
    description: "You get straightforward guidance on requirements, timing, pricing, and next steps before work starts.",
  },
  {
    title: "Careful handling",
    description: "Documents and details are checked carefully to reduce avoidable mistakes and delays.",
  },
  {
    title: "Practical support",
    description: "Support continues through clarifications, revisions, and handoff so you are not left guessing.",
  },
];

export const CONTACT_EXPECTATIONS = [
  "Tell me which service you need and what stage you are at.",
  "Mention any deadline, urgency, or appointment date if one exists.",
  "Share whether you prefer WhatsApp, phone, or email for follow-up.",
];

export const PROCESS_STEPS = [
  {
    title: "Share your requirement",
    description: "Send your service need, deadline, and any document details so I can assess the work clearly.",
  },
  {
    title: "Receive a clear plan",
    description: "You get guidance on required documents, expected turnaround time, pricing, and the next action to take.",
  },
  {
    title: "Work gets completed",
    description: "I handle the task, keep you updated when needed, and confirm the final output or submission status.",
  },
];

export function buildServiceFaqs(service: {
  title: string;
  category?: string;
  price?: string;
  priceNote?: string;
  features?: string[];
}) {
  const featureText = service.features?.slice(0, 4).join(", ") || "the required service steps";

  return [
    {
      question: `Who is ${service.title} for?`,
      answer: `${service.title} is suitable for clients who need reliable help with ${service.category?.toLowerCase() || "digital service"} tasks and want clear guidance before submitting documents or making online requests.`,
    },
    {
      question: `What is included in ${service.title}?`,
      answer: `This service typically includes guidance, requirement checking, execution support, and communication around ${featureText}. Exact scope depends on your case.`,
    },
    {
      question: `How much does ${service.title} cost?`,
      answer: `${service.price || "Pricing varies by complexity"}. ${service.priceNote || "Final pricing may depend on document completeness, urgency, and the number of steps involved."}`,
    },
    {
      question: `How long does ${service.title} take?`,
      answer: "Turnaround depends on document readiness, platform availability, and urgency. Most clients receive a clear timeline after the first review of their requirement.",
    },
    {
      question: "Is this an official government service?",
      answer: BUSINESS_DISCLAIMER,
    },
  ];
}
