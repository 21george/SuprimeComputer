import "server-only";
import type { ServiceDetail } from "@/lib/service-details";

/** Public content is queried with the RLS-limited publishable key, never the secret key. */
const baseUrl = process.env.SUPABASE_URL || "";
const publishable = process.env.SUPABASE_PUBLISHABLE_KEY || "";
const secret = process.env.SUPABASE_SECRET_KEY || "";

export const isContentConfigured = Boolean(baseUrl && publishable);
export const isEnquiryConfigured = Boolean(baseUrl && secret && publishable);

type DbService = {
  id: string; code: string; slug: string; position: number; title: string;
  short_title: string; card_description: string; action_label: string;
  icon_key: string; accent_key: string; featured: boolean; has_detail_page: boolean;
  title_lead: string | null; title_accent: string | null; category: string | null;
  visual_label: string | null; art_key: string | null; summary: string | null;
  overview: string | null; important_note: string | null;
  seo_title: string | null; seo_description: string | null;
};

type DbItem = { service_id: string; section: "help" | "prepare" | "step"; position: number; title: string | null; body: string };
type DbFaq = { service_id: string; position: number; question: string; answer: string };
type DbTopic = { id: string; service_id: string; position: number; name: string; duration_label: string; lead: string; description: string };
type DbExample = { topic_id: string; position: number; body: string };

export type SiteSettings = {
  business_name: string; email: string; primary_phone: string; secondary_phone: string | null;
  primary_whatsapp: string; secondary_whatsapp: string | null;
  address: string; city: string; region: string; locality: string | null;
  maps_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
};
export type OpeningHour = { weekday: number; opens_at: string | null; closes_at: string | null; is_closed: boolean; note: string | null };
export type ServiceCardContent = {
  id: string; label: string; description: string; iconKey: string; action: string;
  accent: string; featured: boolean; detailsHref?: string;
};
export type SiteContent = {
  settings: SiteSettings | null;
  hours: OpeningHour[];
  copy: Record<string, string>;
  services: ServiceCardContent[];
  benefits: { no: string; title: string; text: string }[];
  processSteps: { no: string; title: string; text: string; iconKey: string }[];
};
export type MediaAsset = { asset_key: string; file_url: string; alt_text: string; width: number | null; height: number | null };

async function query<T>(table: string, filter: Record<string, string>, useSecret = false): Promise<T[]> {
  const apiKey = useSecret ? secret : publishable;
  if (!baseUrl || !apiKey) throw new Error("Supabase configuration is incomplete");
  const params = new URLSearchParams(filter);
  const endpoint = `${baseUrl.replace(/\/$/, "")}/rest/v1/${table}?${params}`;
  const response = await fetch(endpoint, { headers: { apikey: apiKey }, cache: "no-store" });
  if (!response.ok) throw new Error(`Supabase ${table}: HTTP ${response.status}`);
  return response.json() as Promise<T[]>;
}

/** For use from server-only route handlers; only allowed tables are written. */
export async function writePrivateRow<T>(table: "sc_contact_submissions" | "sc_email_notifications", row: Record<string, unknown>, method: "POST" | "PATCH" = "POST", match?: Record<string, string>): Promise<T> {
  if (!isEnquiryConfigured) throw new Error("Supabase private write unavailable");
  const params = new URLSearchParams(match || {});
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/rest/v1/${table}${params.size ? `?${params}` : ""}`, {
    method, cache: "no-store",
    headers: { apikey: secret, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`Supabase ${table} write: HTTP ${response.status}`);
  const entries = await response.json() as T[];
  if (!entries.length) throw new Error(`Supabase ${table} write returned no row`);
  return entries[0];
}

export async function lookupServiceId(code: string): Promise<string | null> {
  const services = await query<{ id: string }>("sc_services", { select: "id", code: `eq.${code}`, published: "eq.true", limit: "1" });
  return services[0]?.id ?? null;
}

export async function getSiteContent(): Promise<SiteContent | null> {
  // Before installation, the original static site stays available.
  if (!isContentConfigured) return null;
  const [settings, hours, copyRows, rows, benefitRows, stepRows] = await Promise.all([
    query<SiteSettings>("sc_settings", { select: "*", id: "eq.main" }),
    query<OpeningHour>("sc_hours", { select: "*", order: "weekday.asc" }),
    query<{ page_key: string; content_key: string; body: string }>("sc_copy", { select: "page_key,content_key,body", published: "eq.true" }),
    query<DbService>("sc_services", { select: "*", published: "eq.true", order: "position.asc" }),
    query<{ position: number; title: string; body: string }>("sc_benefits", { select: "position,title,body", published: "eq.true", order: "position.asc" }),
    query<{ position: number; title: string; body: string; icon_key: string }>("sc_process_steps", { select: "position,title,body,icon_key", published: "eq.true", order: "position.asc" }),
  ]);
  const copy: Record<string, string> = {};
  for (const value of copyRows) copy[`${value.page_key}.${value.content_key}`] = value.body;
  return {
    settings: settings[0] || null,
    hours, copy,
    services: rows.map((row) => ({
      id: row.code.slice(1), label: row.short_title, description: row.card_description,
      iconKey: row.icon_key, action: row.action_label, accent: row.accent_key,
      featured: row.featured, ...(row.has_detail_page ? { detailsHref: `/services/${row.slug}` } : {}),
    })),
    benefits: benefitRows.map((row) => ({ no: String(row.position).padStart(2, "0"), title: row.title, text: row.body })),
    processSteps: stepRows.map((row) => ({ no: String(row.position).padStart(2, "0"), title: row.title, text: row.body, iconKey: row.icon_key })),
  };
}

export async function getAllServiceDetails(): Promise<ServiceDetail[] | null> {
  if (!isContentConfigured) return null;
  const [rows, items, faqs, topics, examples] = await Promise.all([
    query<DbService>("sc_services", { select: "*", published: "eq.true", has_detail_page: "eq.true", order: "position.asc" }),
    query<DbItem>("sc_service_items", { select: "service_id,section,position,title,body", order: "position.asc" }),
    query<DbFaq>("sc_service_faqs", { select: "service_id,position,question,answer", order: "position.asc" }),
    query<DbTopic>("sc_training_topics", { select: "*", order: "position.asc" }),
    query<DbExample>("sc_training_examples", { select: "topic_id,position,body", order: "position.asc" }),
  ]);
  return rows.map((row) => {
    const serviceItems = items.filter((item) => item.service_id === row.id);
    const trainingTopics = topics.filter((topic) => topic.service_id === row.id).map((topic) => ({
      name: topic.name, duration: topic.duration_label, lead: topic.lead, description: topic.description,
      examples: examples.filter((example) => example.topic_id === topic.id).map((example) => example.body),
    }));
    return {
      slug: row.slug, number: row.code.slice(1), title: row.title,
      titleLead: row.title_lead || row.title, titleAccent: row.title_accent || "",
      category: row.category || "SERVICE", summary: row.summary || "",
      overview: row.overview || "", important: row.important_note || "",
      visualLabel: row.visual_label || "", art: (row.art_key || "training") as ServiceDetail["art"],
      helps: serviceItems.filter((item) => item.section === "help").map((item) => ({ title: item.title || "", text: item.body })),
      prepare: serviceItems.filter((item) => item.section === "prepare").map((item) => item.body),
      steps: serviceItems.filter((item) => item.section === "step").map((item) => ({ title: item.title || "", text: item.body })),
      faqs: faqs.filter((item) => item.service_id === row.id).map((item) => ({ question: item.question, answer: item.answer })),
      ...(trainingTopics.length ? { trainingTopics } : {}),
    };
  });
}

export async function getMediaAssets(): Promise<Record<string, MediaAsset>> {
  if (!isContentConfigured) return {};
  const rows = await query<MediaAsset>("sc_media", { select: "asset_key,file_url,alt_text,width,height", published: "eq.true" });
  return Object.fromEntries(rows.map((row) => [row.asset_key, row]));
}

export async function getAllCopy(): Promise<Record<string, string>> {
  if (!isContentConfigured) return {};
  const rows = await query<{ page_key: string; content_key: string; body: string }>("sc_copy", { select: "page_key,content_key,body", published: "eq.true" });
  const copy: Record<string, string> = {};
  for (const row of rows) copy[`${row.page_key}.${row.content_key}`] = row.body;
  return copy;
}

export async function getServiceBySlug(slug: string): Promise<DbService | null> {
  if (!isContentConfigured) return null;
  const rows = await query<DbService>("sc_services", { select: "*", slug: `eq.${slug}`, published: "eq.true", limit: "1" });
  return rows[0] ?? null;
}

export async function getContactServiceList(): Promise<[string, string][]> {
  if (!isContentConfigured) return [];
  const rows = await query<Pick<DbService, "code" | "short_title">>("sc_services", { select: "code,short_title", published: "eq.true", order: "position.asc" });
  return rows.map((row) => [row.code, row.short_title] as [string, string]);
}
