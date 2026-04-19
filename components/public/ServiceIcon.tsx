"use client";

import {
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Landmark,
  LineChart,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";

type ServiceLike = {
  slug?: string;
  title?: string;
  category?: string;
};

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  "loksewa-form-filling": Landmark,
  "demat-mero-share": LineChart,
  documentation: FileText,
  "academic-projects": GraduationCap,
  "web-development": BriefcaseBusiness,
  "digital-assistance": Globe,
};

function resolveIcon(service: ServiceLike): LucideIcon {
  if (service.slug && ICON_BY_SLUG[service.slug]) {
    return ICON_BY_SLUG[service.slug];
  }

  const text = `${service.title || ""} ${service.category || ""}`.toLowerCase();

  if (text.includes("loksewa") || text.includes("government")) return Landmark;
  if (text.includes("demat") || text.includes("share") || text.includes("finance")) return LineChart;
  if (text.includes("document")) return FileText;
  if (text.includes("academic") || text.includes("education")) return GraduationCap;
  if (text.includes("web") || text.includes("development") || text.includes("technical")) return BriefcaseBusiness;
  if (text.includes("digital")) return Globe;

  return ShieldCheck;
}

interface ServiceIconProps {
  service: ServiceLike;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function ServiceIcon({
  service,
  size = 22,
  color = "currentColor",
  strokeWidth = 1.9,
}: ServiceIconProps) {
  const Icon = resolveIcon(service);
  return <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function cleanBadgeLabel(value: string) {
  return value.replace(/^[^\p{L}\p{N}]+/u, "").trim();
}

export const profileHighlights = [
  { label: "Loksewa Guidance", icon: Landmark },
  { label: "DEMAT & Mero Share", icon: LineChart },
  { label: "Web Development", icon: BriefcaseBusiness },
  { label: "Documentation Support", icon: FileCheck2 },
];
