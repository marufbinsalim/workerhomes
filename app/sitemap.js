import { api } from '@/config'
import { getSitemap } from '@/lib/services/dwelling'
import axios from 'axios'

export const revalidate = 30

export default async function sitemap() {
  const { data } = await getSitemap()

  const formattedData =
    data?.length > 0
      ? data?.map(item => {
          return {
            ...item,
            // alternates: null,
          }
        })
      : []

  const values = [
    {
      url: `https://workerhomes.pl/en/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/`,
          de: `https://workerhomes.pl/de/`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/become-hosted`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/faqs`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/guides`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/pricing`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/listings`,
          de: `https://workerhomes.pl/de/listings`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/about`,
          de: `https://workerhomes.pl/de/about`,
        },
      },
    },
    {
      url: `https://workerhomes.pl/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
      alternates: {
        languages: {
          pl: `https://workerhomes.pl/pl/contact`,
          de: `https://workerhomes.pl/de/contact`,
        },
      },
    },
    ...formattedData,
  ]

  return values
}
