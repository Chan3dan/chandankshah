export const BUSINESS_DISCLAIMER =
  "Chandan Kumar Shah provides independent digital assistance and consultation services. This website and its services are not affiliated with, endorsed by, or acting on behalf of any government office, regulator, bank, or public authority.";

export const OFFICIAL_PROCESS_NOTICE =
  "For services involving official forms, public notices, exams, regulated financial accounts, or submission portals, support is provided as independent guidance and assistance only. Final approval, acceptance, issuance, and platform decisions remain with the relevant institution or authority.";

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

export const SERVICES_PAGE_FAQS = [
  {
    question: "How do I choose the right service?",
    answer: "Start with the service that matches your main outcome. If your case includes multiple connected steps, ask about a bundle so the process can be handled more efficiently.",
  },
  {
    question: "Can I ask for help even if my exact task is not listed?",
    answer: "Yes. The listed services cover common needs, but related digital assistance, documentation help, and process support can often be handled after a quick review.",
  },
  {
    question: "Do you guarantee approval for official forms or accounts?",
    answer: `${BUSINESS_DISCLAIMER} Final approval, acceptance, issuance, and platform decisions remain with the relevant institution or authority.`,
  },
];

export const CONTACT_FAQS = [
  {
    question: "How quickly do you reply after a message is sent?",
    answer: "Most enquiries receive a reply within a few hours during business hours. Complex cases may need a short review before the next steps are confirmed.",
  },
  {
    question: "What should I include in my first message?",
    answer: "Include the service you need, your deadline, the stage you are at, and any document or account details that affect the work. Clear details help move the request faster.",
  },
  {
    question: "Can I contact by WhatsApp instead of email?",
    answer: "Yes. WhatsApp is a good option for quick follow-up, while email is helpful when you want a written thread or need to share structured details.",
  },
];

export function isOfficialProcessService(service: {
  slug?: string;
  title?: string;
  category?: string;
}) {
  const value = `${service.slug || ""} ${service.title || ""} ${service.category || ""}`.toLowerCase();
  return [
    "loksewa",
    "psc",
    "demat",
    "mero share",
    "mero share",
    "documentation",
    "document",
    "government",
    "form",
    "ipo",
  ].some((keyword) => value.includes(keyword));
}

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
