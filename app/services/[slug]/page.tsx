import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/service-detail-page";
import { serviceDetails, serviceDetailBySlug } from "@/lib/service-details";

type Props = { params: Promise<{ slug: string }> };

/** Next.js prerenders the five known services; an unknown slug returns 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceDetailBySlug[slug];
  if (!service) return { title: "Service not found | Supreme Computer" };

  return {
    title: `${service.title} | Supreme Computer`,
    description: service.summary,
    openGraph: { title: `${service.title} | Supreme Computer`, description: service.summary, type: "website" },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = serviceDetailBySlug[slug];
  if (!service) notFound();
  return <ServiceDetailPage service={service}/>;
}
