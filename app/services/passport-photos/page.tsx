import { Metadata } from "next";
import ServiceDetailRoute from "@/components/service-detail-route";
import { getServiceBySlug } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("passport-photos");
  return {
    title: service?.seo_title || "Passport Photographs & Picture Printing | Supreme Computer",
    description: service?.seo_description || "Learn about passport-style photographs and picture printing at Supreme Computer in Akpata, Benin City. Confirm formats, availability and pricing by phone.",
  };
}

export default function PassportPhotosPage() {
  return <ServiceDetailRoute slug="passport-photos"/>;
}
