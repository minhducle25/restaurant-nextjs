import dishApiRequest from "@/apiRequests/dish";
import { htmlToTextForDescription } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import MenuTikTok from "@/app/[locale]/(public)/menu-tiktok";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Locale, locales } from "@/config";
import evnConfig from "@/config";
import type { Metadata } from "next";

export async function generateMetadata({
  params
}:{params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const description = htmlToTextForDescription(t('description'))
  const title = t('title')
  const url = `${evnConfig.NEXT_PUBLIC_URL}/${locale}`

  // Build alternate language URLs
  const languages = locales.reduce((acc, l) => {
    acc[l === 'vi' ? 'vi-VN' : 'en-US'] = `${evnConfig.NEXT_PUBLIC_URL}/${l}`
    return acc
  }, {} as Record<string, string>)

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      images: [
        {
          url: `${evnConfig.NEXT_PUBLIC_URL}/banner.png`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${evnConfig.NEXT_PUBLIC_URL}/banner.png`]
    }
  }
}
export default async function Home({
  params
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  setRequestLocale(locale)
  const t = await getTranslations('HomePage');
  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return <div>{t('somethingWentWrong')}</div>;
  }

  const restaurantJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${evnConfig.NEXT_PUBLIC_URL}/#restaurant`,
    name: t('title'),
    description: t('description'),
    image: `${evnConfig.NEXT_PUBLIC_URL}/banner.png`,
    url: `${evnConfig.NEXT_PUBLIC_URL}/${locale}`,
    logo: `${evnConfig.NEXT_PUBLIC_URL}/favicon.ico`,
    servesCuisine: ['Vietnamese', 'Asian'],
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'HCM',
      postalCode: '700000',
      addressCountry: 'VN'
    },
    telephone: '+84-xxx-xxx-xxx',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '22:00'
      }
    ],
    acceptsReservations: 'True',
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: {
        '@type': 'MenuSection',
        hasMenuItem: dishList.map((dish) => ({
          '@type': 'MenuItem',
          name: dish.name,
          description: htmlToTextForDescription(dish.description),
          offers: {
            '@type': 'Offer',
            price: dish.price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock'
          },
          image: dish.image
        }))
      }
    },
    // Aggregate rating (nếu có reviews trong tương lai)
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.5',
    //   reviewCount: '150'
    // },
    sameAs: [
      // Thêm social media links khi có:
      // 'https://www.facebook.com/minukitchen',
      // 'https://www.instagram.com/minukitchen',
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <MenuTikTok dishList={dishList} />
    </>
  );
}
