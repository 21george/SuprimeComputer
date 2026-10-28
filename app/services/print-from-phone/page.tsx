import { Metadata } from "next";
import ServiceDetailRoute from "@/components/service-detail-route";
import { getServiceBySlug } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("print-from-phone");
  return {
    title: service?.seo_title || "Print From Your Phone | Supreme Computer",
    description: service?.seo_description || "Learn about printing documents from your phone at Supreme Computer in Benin City. Confirm file transfer options and pricing by phone.",
  };
}

export default function PrintFromPhonePage() {
  return <ServiceDetailRoute slug="print-from-phone"/>;
}
