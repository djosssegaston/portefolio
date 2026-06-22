export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  results: string[];
  challenges: string[];
  technologies: string[];
  category: string;
  image: string;
  gallery: string[];
  githubUrl?: string;
  demoUrl?: string;
  testimonial?: Testimonial;
  featured: boolean;
  date: string;
  status: "published" | "draft" | "archived";
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string;
  category: SkillCategory;
  description?: string;
}

export type SkillCategory =
  | "web-development"
  | "backend-development"
  | "frontend-development"
  | "databases"
  | "tools"
  | "devops"
  | "digital-marketing"
  | "project-management"
  | "ai";

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  companyLogo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
  logo?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialUrl?: string;
  badge: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
  featured: boolean;
  validated: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  published: boolean;
  scheduledDate?: string;
  popular: boolean;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  name: string;
  email: string;
  content: string;
  date: string;
  validated: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  price?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  archived: boolean;
  replied: boolean;
}

export interface SiteConfig {
  name: string;
  fullName: string;
  title: string;
  description: string;
  keywords: string[];
  logo: string;
  favicon: string;
  ogImage: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
  stats: StatsData[];
  about: {
    presentation: string;
    vision: string;
    values: string[];
    timeline: TimelineEvent[];
    cvUrl: string;
  };
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface StatsData {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "work" | "education" | "achievement";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "super-admin" | "admin" | "editor";
  permissions: string[];
}

export interface AnalyticsData {
  visitors: number;
  pageViews: number;
  cvDownloads: number;
  messagesCount: number;
  visitorsChart: ChartDataPoint[];
  pageViewsChart: ChartDataPoint[];
  trafficSources: TrafficSource[];
  devices: DeviceData[];
  topPages: TopPage[];
  countries: CountryData[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

export interface TopPage {
  url: string;
  title: string;
  views: number;
}

export interface CountryData {
  country: string;
  visitors: number;
  flag: string;
}

export interface EventTraining {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  type: "formation" | "conference" | "workshop" | "hackathon" | "meetup" | "autre";
  startDate: string;
  endDate?: string;
  location: string;
  organizer: string;
  organizerUrl?: string;
  image?: string;
  gallery: string[];
  tags: string[];
  certificate: boolean;
  certificateUrl?: string;
  registrationUrl?: string;
  speaker?: string;
  speakerBio?: string;
  skills: string[];
  featured: boolean;
  status: "upcoming" | "completed" | "cancelled";
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapUrl: string;
}
