import { Metadata } from "next";
import ServiceDetailRoute from "@/components/service-detail-route";
import { getServiceBySlug } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("computer-training");
  return {
    title: service?.seo_title || "Computer Training | Supreme Computer",
    description: service?.seo_description || "Learn about practical computer training at Supreme Computer, Benin City. Ask the centre for current subjects, schedules and fees.",
  };
}

export default function ComputerTrainingPage() {
  return <ServiceDetailRoute slug="computer-training"/>;
}
