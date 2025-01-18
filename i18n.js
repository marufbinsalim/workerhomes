import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'pl'],
}

export default getRequestConfig(async ({ locale }) => {
  if (!i18nConfig?.locales?.includes(locale)) notFound()

  return {
    messages: (await import(`./localization/${locale}.json`)).default,
  }
})
