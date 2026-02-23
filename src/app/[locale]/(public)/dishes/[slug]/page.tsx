import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { getIdFromSlugUrl, htmlToTextForDescription, wrapServerApi } from "@/lib/utils";
import type { Metadata } from "next";
import { Locale } from "@/config";
import evnConfig from "@/config";
import { getTranslations } from "next-intl/server";
import { getDishKey, hasDishTranslation } from "@/lib/dish-i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: Locale }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const id = getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)))
  const dish = data?.payload?.data
  const tDishes = await getTranslations({ locale, namespace: 'Dishes' })

  if (!dish) {
    return {
      title: 'Dish Not Found',
      description: ''
    }
  }

  const dishName = hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.name`) : dish.name
  const dishDesc = hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.description`) : dish.description

  const title = dishName
  const description = htmlToTextForDescription(dishDesc)
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
              alt: dishName
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
  const tDishes = await getTranslations({ locale, namespace: 'Dishes' });

  const dish = data?.payload?.data;
  
  const dishName = dish && hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.name`) : dish?.name || ''
  const dishDesc = dish && hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.description`) : dish?.description || ''

  const menuItemJsonLd = dish
    ? {
        '@context': 'https://schema.org',
        '@type': 'MenuItem',
        name: dishName,
        description: htmlToTextForDescription(dishDesc),
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

  const breadcrumbJsonLd = dish
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${evnConfig.NEXT_PUBLIC_URL}/${locale}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Menu',
            item: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/dishes`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: dishName,
            item: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${slug}`
          }
        ]
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
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <DishDetail dish={dish} />
    </>
  )
}
