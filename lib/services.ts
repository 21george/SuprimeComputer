import { BookOpen, Camera, FilePenLine, FileText, Globe2, GraduationCap, IdCard, ScanLine, Smartphone, TabletSmartphone, type LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  action: string;
  accent: string;
  featured?: boolean;
  detailsHref?: string;
};

/** The home cards use this catalogue; dedicated content lives in service-details.ts. */
export const services: Service[] = [
  { id: "01", label: "Typing & Typesetting", description: "Neat, professional typing and formatting for letters, applications, agreements and important documents.", icon: FilePenLine, action: "Ask about typing", accent: "type" },
  { id: "02", label: "Photocopying & Scanning", description: "Clear photocopies, digital document scans and dependable reprinting for your everyday needs.", icon: ScanLine, action: "Ask about scanning", accent: "scan" },
  { id: "03", label: "Passport Photos", description: "Passport photographs and quality picture printing for personal, school and professional needs.", icon: Camera, action: "Ask about photos", accent: "photo", detailsHref: "/services/passport-photos" },
  { id: "04", label: "Print From Your Phone", description: "Have a file on your phone? Contact our team to arrange convenient, professional printing.", icon: Smartphone, action: "Ask how it works", accent: "phone", detailsHref: "/services/print-from-phone" },
  { id: "05", label: "NIN Assistance", description: "Guidance with NIN registration-related processes, subject to applicable official requirements.", icon: IdCard, action: "Ask for guidance", accent: "id", detailsHref: "/services/nin-assistance" },
  { id: "06", label: "WAEC & NECO Services", description: "Assistance checking examination results and scratch cards where available. Call to confirm details.", icon: FileText, action: "Check availability", accent: "exam", detailsHref: "/services/waec-neco" },
  { id: "07", label: "Computer Training", description: "Build practical computer skills with guided learning. Contact us for current training schedules.", icon: GraduationCap, action: "Ask about training", accent: "learn", detailsHref: "/services/computer-training" },
  { id: "08", label: "Agreement & Documents", description: "Careful typing, arrangement and formatting for agreement documents and business paperwork.", icon: BookOpen, action: "Discuss a document", accent: "docs" },
  { id: "09", label: "Website Design & Development", description: "Modern, responsive websites for businesses, personal brands and organisations — designed to look great and work across devices.", icon: Globe2, action: "Discuss a website", accent: "web", featured: true },
  { id: "10", label: "Mobile App Development", description: "Have an app idea? Let's discuss the design and development of a mobile experience built around your goals and audience.", icon: TabletSmartphone, action: "Discuss a mobile app", accent: "mobile", featured: true },
];
