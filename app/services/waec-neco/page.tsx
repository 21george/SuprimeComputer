import { Metadata } from "next";
import ServiceDetailRoute from "@/components/service-detail-route";
import { getServiceBySlug } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("waec-neco");
  return {
    title: service?.seo_title || "WAEC & NECO Result Services | Supreme Computer",
    description: service?.seo_description || "Ask for assistance checking WAEC and NECO examination results at Supreme Computer in Benin City. Confirm scratch card availability and pricing by phone.",
  };
}

export default function WaecNecoPage() {
  return <ServiceDetailRoute slug="waec-neco"/>;
}
