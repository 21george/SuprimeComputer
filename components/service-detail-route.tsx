import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/service-detail-page";
import { getAllServiceDetails, getMediaAssets, getSiteContent, getAllCopy } from "@/lib/supabase-content";
import { serviceDetailBySlug, serviceDetails } from "@/lib/service-details";

export default async function ServiceDetailRoute({ slug }: { slug: string }) {
  const [details, site, media, copy] = await Promise.all([
    getAllServiceDetails(), getSiteContent(), getMediaAssets(), getAllCopy(),
  ]);
  const all = details ?? serviceDetails;
  const service = details ? details.find((item) => item.slug === slug) : serviceDetailBySlug[slug];
  if (!service) notFound();
  return <ServiceDetailPage service={service} relatedServices={all} settings={site?.settings} hours={site?.hours} media={media} copy={copy}/>;
}
