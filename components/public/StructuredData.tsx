// Structured data (JSON-LD) components for SEO rich results

interface PersonSchemaProps {
  name: string;
  url: string;
  description?: string;
  email?: string;
  telephone?: string;
  location?: string;
  image?: string;
  sameAs?: string[];
}

export function PersonSchema({ name, url, description, email, telephone, location, image, sameAs = [] }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    description,
    email,
    telephone,
    image,
    address: location ? { "@type": "PostalAddress", addressCountry: "NP", addressLocality: location } : undefined,
    sameAs: sameAs.filter(Boolean),
    knowsAbout: [
      "Loksewa Application",
      "DEMAT Account Nepal",
      "Mero Share Registration",
      "Government Documentation Nepal",
      "Nepal Public Service Commission",
      "Web Development",
      "BCA Nepal",
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface LocalBusinessSchemaProps {
  name: string;
  url: string;
  description?: string;
  telephone?: string;
  email?: string;
  location?: string;
  openingHours?: string;
  priceRange?: string;
  services?: string[];
}

export function LocalBusinessSchema({ name, url, description, telephone, email, location, openingHours = "Mo-Sa 09:00-19:00", priceRange = "Rs. 300 - Rs. 5000", services = [] }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    name,
    url,
    description,
    telephone,
    email,
    address: { "@type": "PostalAddress", addressCountry: "NP", addressLocality: location || "Nepal" },
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "19:00" },
    openingHours,
    priceRange,
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Digital Services", itemListElement: services.map(s => ({ "@type": "Offer", name: s })) },
    currenciesAccepted: "NPR",
    paymentAccepted: "Cash, eSewa, Khalti, Bank Transfer",
    areaServed: { "@type": "Country", name: "Nepal" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  price?: string;
  provider?: string;
}

export function ServiceSchema({ name, description, url, price, provider }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: provider ? { "@type": "Person", name: provider } : undefined,
    offers: price ? { "@type": "Offer", price: price.replace(/[^0-9–-]/g, ""), priceCurrency: "NPR", availability: "https://schema.org/InStock" } : undefined,
    areaServed: { "@type": "Country", name: "Nepal" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface FAQSchemaProps {
  faqs: { question: string; answer: string }[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  url: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  tags?: string[];
}

export function BlogPostSchema({ title, description, url, author, publishedAt, updatedAt, image, tags = [] }: BlogPostSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    author: { "@type": "Person", name: author },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: image || undefined,
    keywords: tags.join(", "),
    publisher: { "@type": "Person", name: author },
    inLanguage: "en-US",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
