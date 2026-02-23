import dishApiRequest from '@/apiRequests/dish';
import evnConfig, { locales } from '@/config'
import { generateSlugUrl } from '@/lib/utils';
import type { MetadataRoute } from 'next'
 
const staticRoutes: MetadataRoute.Sitemap = [{
    url: '',
    changeFrequency: 'daily',
    priority: 1
}, {
    url: '/login',
    changeFrequency: 'yearly',
    priority: 0.5
}, {
    url: '/about',
    changeFrequency: 'monthly',
    priority: 0.6
}, {
    url: '/terms',
    changeFrequency: 'yearly',
    priority: 0.4
}, {
    url: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.4
}]
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
        const result = await dishApiRequest.list();

    const dishList = result.payload.data;

  const localizeStaticSiteMap = locales.reduce((acc, locale) => {
    return [
        ...acc,
        ...staticRoutes.map((route) => {
            return {
            ...route,
            url: `${evnConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
            lastModified: new Date(),
        }
    })
    ]
  },[] as MetadataRoute.Sitemap);
    const localizeDishSiteMap = locales.reduce((acc, locale) => {
        const dishListSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
            return {
            url: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({name: dish.name, id: dish.id})}`,
            lastModified: dish.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }
    })
    return [
        ...acc,
        ...dishListSiteMap
    ]
  },[] as MetadataRoute.Sitemap);
  return [
    ...localizeStaticSiteMap,
    ...localizeDishSiteMap
  ]
}