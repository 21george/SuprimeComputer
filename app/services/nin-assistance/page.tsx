import { Metadata } from "next";
import ServiceDetailRoute from "@/components/service-detail-route";
import { getServiceBySlug } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("nin-assistance");
  return {
    title: service?.seo_title || "NIN Registration Assistance | Supreme Computer",
    description: service?.seo_description || "Get practical assistance with NIN registration-related processes at Supreme Computer in Benin City. Confirm requirements and availability by phone.",
  };
}

export default function NinAssistancePage() {
  return <ServiceDetailRoute slug="nin-assistance"/>;
}
