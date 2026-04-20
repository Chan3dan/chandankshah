import mongoose, { Schema, model, models, Document } from "mongoose";

// ─── SERVICE ───────────────────────────────────────────
export interface IService extends Document {
  title: string;
  slug: string;
  icon: string;
  description: string;
  longDescription: string;
  features: string[];
  price: string;
  priceNote: string;
  color: string;
  badge: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "🔧" },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    features: [{ type: String }],
    price: { type: String, default: "" },
    priceNote: { type: String, default: "" },
    color: { type: String, default: "#2563eb" },
    badge: { type: String, default: "" },
    category: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── PROJECT ───────────────────────────────────────────
export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  link: string;
  githubLink: string;
  imageUrl: string;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "Web App" },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    tags: [{ type: String }],
    link: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── TESTIMONIAL ───────────────────────────────────────
export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarInitial: string;
  avatarColor: string;
  service: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    text: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatarInitial: { type: String, default: "C" },
    avatarColor: { type: String, default: "#2563eb" },
    service: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── BLOG POST ─────────────────────────────────────────
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  publishedAt: Date;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
    category: { type: String, default: "General" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// ─── CONTACT MESSAGE ───────────────────────────────────
export interface IMessage extends Document {
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  requestType: "contact" | "booking" | "resource";
  status: "new" | "read" | "replied" | "archived";
  progressStatus: "received" | "in_review" | "documents_needed" | "in_progress" | "completed" | "cancelled";
  trackingCode: string;
  adminNotes: string;
  ip: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    service: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    requestType: { type: String, enum: ["contact", "booking", "resource"], default: "contact" },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
    progressStatus: {
      type: String,
      enum: ["received", "in_review", "documents_needed", "in_progress", "completed", "cancelled"],
      default: "received",
    },
    trackingCode: { type: String, required: true, unique: true },
    adminNotes: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

// ─── SITE SETTINGS ─────────────────────────────────────
export interface ISiteSettings extends Document {
  key: string;
  value: unknown;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// Export models (safe for hot-reload)
export const Service = models.Service || model<IService>("Service", ServiceSchema);
export const Project = models.Project || model<IProject>("Project", ProjectSchema);
export const Testimonial = models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
export const BlogPost = models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
export const Message = models.Message || model<IMessage>("Message", MessageSchema);
export const SiteSettings = models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

// ─── RESOURCE ──────────────────────────────────────────
export interface IResource extends Document {
  title: string; description: string; category: string;
  type: "pdf" | "link" | "doc" | "video";
  fileUrl: string; externalUrl: string; thumbnail: string;
  tags: string[]; downloadCount: number; isActive: boolean;
  isFeatured: boolean; requiresEmail: boolean; sortOrder: number;
  createdAt: Date; updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  type: { type: String, enum: ["pdf", "link", "doc", "video"], default: "pdf" },
  fileUrl: { type: String, default: "" },
  externalUrl: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  tags: [{ type: String }],
  downloadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  requiresEmail: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Resource = models.Resource || model<IResource>("Resource", ResourceSchema);
