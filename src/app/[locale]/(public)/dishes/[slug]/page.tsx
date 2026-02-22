import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { formatCurrency, getIdFromSlugUrl, htmlToTextForDescription, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import type { Metadata } from "next";
import { Locale } from "@/config";
import evnConfig from "@/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: Locale }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const id = getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)))
  const dish = data?.payload?.data

  if (!dish) {
    return {
      title: 'Dish Not Found',
      description: ''
    }
  }

  const title = dish.name
  const description = htmlToTextForDescription(dish.description)
  const url = `${evnConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      images: dish.image
        ? [
            {
              url: dish.image,
              width: 800,
              height: 600,
              alt: dish.name
            }
          ]
        : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: dish.image ? [dish.image] : undefined
    }
  }
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params
  const id = getIdFromSlugUrl(slug);

  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)));

  const dish = data?.payload?.data;

  const menuItemJsonLd = dish
    ? {
        '@context': 'https://schema.org',
        '@type': 'MenuItem',
        name: dish.name,
        description: htmlToTextForDescription(dish.description),
        image: dish.image,
        url: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${slug}`,
        offers: {
          '@type': 'Offer',
          price: dish.price,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock'
        },
        suitableForDiet: 'https://schema.org/HalalDiet'
      }
    : null

  return (
    <>
      {menuItemJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuItemJsonLd) }}
        />
      )}
      <DishDetail dish={dish} />
    </>
  )
}
