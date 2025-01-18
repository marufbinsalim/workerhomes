import { setLocale } from 'yup'
import { useTranslations } from 'next-intl'

export function useYupLocale() {
  const t = useTranslations('validation')

  setLocale({
    mixed: {
      required: t('required'),
    },
    string: {
      min: ({ min }) => t('minLength', { min }),
      max: ({ max }) => t('maxLength', { max }),
      matches: t('matches'),
      email: t('email'),
    },
    // Add more validations as needed
  })
}
