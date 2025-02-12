module.exports = {
  api: process.env.NEXT_PUBLIC_API_URL,
  url: process.env.NEXT_PUBLIC_BASE_URL,
  reCaptcha: {
    siteKey: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
  },
  google_key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  marker: {
    gold: {
      url: 'https://api.workerhomes.pl/uploads/gold_f944ebe64d.png',
      size: [50, 50],
    },
    silver: {
      url: 'https://api.workerhomes.pl/uploads/silver_0946901c00.png',
      size: [40, 40],
    },
    platinum: {
      url: 'https://api.workerhomes.pl/uploads/platinum_fbf53485e2.png',
      size: [60, 60],
    },
    free: {
      url: 'https://api.workerhomes.pl/uploads/free_829d142da5.png',
      size: [30, 30],
    },
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  brand: {
    name: 'WorkersHomes',
    logo: {
      dark: '/uploads/logo_dark_48857cce96.png',
      light: '/uploads/Artboard_20_56c27e13e1.png',
    },
    og: {
      title: 'WorkersHomes',
      description: 'WorkersHomes',
      image: '/uploads/Artboard_20_56c27e13e1.png',
    },
  },
  searchOrder: [
    {
      value: '10',
      label: '1st',
    },
    {
      value: '20',
      label: '2nd',
    },
    {
      value: '30',
      label: '3rd',
    },
    {
      value: '40',
      label: 'Last',
    },
  ],
  roles: {
    admin: 'super_admin',
    user: 'user',
  },
  languages: {
    polish: {
      en: 'Polish',
      pl: 'Polski',
      de: 'Polnisch',
    },
    english: {
      en: 'English',
      pl: 'Angielski',
      de: 'Englisch',
    },
    german: {
      en: 'German',
      pl: 'Niemiecki',
      de: 'Deutsch',
    },
  },
  spokenLanguages: [
    {
      id: 1,
      locale: 'en',
      en: 'English',
      pl: 'Angielski',
      de: 'Englisch',
    },
    {
      id: 2,
      locale: 'es',
      en: 'Spanish',
      pl: 'Hiszpański',
      de: 'Spanisch',
    },
    {
      id: 3,
      locale: 'fr',
      en: 'French',
      pl: 'Francuski',
      de: 'Französisch',
    },
    {
      id: 4,
      locale: 'de',
      en: 'German',
      pl: 'Niemiecki',
      de: 'Deutsch',
    },
    {
      id: 5,
      locale: 'zh',
      en: 'Chinese',
      pl: 'Chiński',
      de: 'Chinesisch',
    },
    {
      id: 6,
      locale: 'ar',
      en: 'Arabic',
      pl: 'Arabski',
      de: 'Arabisch',
    },
    {
      id: 7,
      locale: 'ru',
      en: 'Russian',
      pl: 'Rosyjski',
      de: 'Russisch',
    },
    {
      id: 8,
      locale: 'hi',
      en: 'Hindi',
      pl: 'Hinduski',
      de: 'Hindi',
    },
    {
      id: 9,
      locale: 'pt',
      en: 'Portuguese',
      pl: 'Portugalski',
      de: 'Portugiesisch',
    },
    {
      id: 10,
      locale: 'ja',
      en: 'Japanese',
      pl: 'Japoński',
      de: 'Japanisch',
    },
    {
      id: 11,
      locale: 'ko',
      en: 'Korean',
      pl: 'Koreański',
      de: 'Koreanisch',
    },
    {
      id: 12,
      locale: 'it',
      en: 'Italian',
      pl: 'Włoski',
      de: 'Italienisch',
    },
    {
      id: 13,
      locale: 'tr',
      en: 'Turkish',
      pl: 'Turecki',
      de: 'Türkisch',
    },
    {
      id: 14,
      locale: 'nl',
      en: 'Dutch',
      pl: 'Holenderski',
      de: 'Niederländisch',
    },
    {
      id: 15,
      locale: 'sv',
      en: 'Swedish',
      pl: 'Szwedzki',
      de: 'Schwedisch',
    },
    {
      id: 16,
      locale: 'pl',
      en: 'Polish',
      pl: 'Polski',
      de: 'Polnisch',
    },
    {
      id: 17,
      locale: 'fa',
      en: 'Persian',
      pl: 'Perski',
      de: 'Persisch',
    },
    {
      id: 18,
      locale: 'th',
      en: 'Thai',
      pl: 'Tajski',
      de: 'Thailändisch',
    },
    {
      id: 19,
      locale: 'vi',
      en: 'Vietnamese',
      pl: 'Wietnamski',
      de: 'Vietnamesisch',
    },
    {
      id: 20,
      locale: 'uk',
      en: 'Ukrainian',
      pl: 'Ukraiński',
      de: 'Ukrainisch',
    },
    {
      id: 21,
      locale: 'el',
      en: 'Greek',
      pl: 'Grecki',
      de: 'Griechisch',
    },
    {
      id: 22,
      locale: 'cs',
      en: 'Czech',
      pl: 'Czeski',
      de: 'Tschechisch',
    },
    {
      id: 23,
      locale: 'he',
      en: 'Hebrew',
      pl: 'Hebrajski',
      de: 'Hebräisch',
    },
    {
      id: 24,
      locale: 'da',
      en: 'Danish',
      pl: 'Duński',
      de: 'Dänisch',
    },
    {
      id: 25,
      locale: 'no',
      en: 'Norwegian',
      pl: 'Norweski',
      de: 'Norwegisch',
    },
    {
      id: 26,
      locale: 'fi',
      en: 'Finnish',
      pl: 'Fiński',
      de: 'Finnisch',
    },
    {
      id: 27,
      locale: 'hu',
      en: 'Hungarian',
      pl: 'Węgierski',
      de: 'Ungarisch',
    },
    {
      id: 28,
      locale: 'ro',
      en: 'Romanian',
      pl: 'Rumuński',
      de: 'Rumänisch',
    },
    {
      id: 29,
      locale: 'bg',
      en: 'Bulgarian',
      pl: 'Bułgarski',
      de: 'Bulgarisch',
    },
    {
      id: 30,
      locale: 'sr',
      en: 'Serbian',
      pl: 'Serbski',
      de: 'Serbisch',
    },
  ],
  paymentMethods: [
    {
      id: 1,
      label: 'Credit Card',
      value: 'card',
    },
    {
      id: 2,
      label: 'Paypal',
      value: 'paypal',
    },
  ],
}
