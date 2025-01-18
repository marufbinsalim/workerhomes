module.exports = t => [
  // {
  //   id: 1,
  //   title: t('support.title'),
  //   menuList: [
  //     { name: t('support.links.contact'), routerPath: '/' },
  //     { name: t('support.links.legal'), routerPath: '/' },
  //     { name: t('support.links.privacy'), routerPath: '/' },
  //     { name: t('support.links.terms'), routerPath: '/' },
  //     { name: t('support.links.sitemap'), routerPath: '/' },
  //   ],
  // },
  {
    id: 2,
    title: t('hosting.title'),
    menuList: [
      { name: t('hosting.host'), routerPath: '/dashboard/dwellings' },
      { name: t('hosting.resource'), routerPath: '/listings' },
      { name: t('hosting.guide'), routerPath: '/guides' },
      { name: t('hosting.earn'), routerPath: '/become-hosted' },
      { name: t('hosting.blog'), routerPath: '/blogs' },
    ],
  },
  {
    id: 3,
    title: t('company.title'),
    menuList: [
      { name: t('company.links.about'), routerPath: '/about' },
      { name: t('company.links.contact'), routerPath: '/contact' },
      { name: t('company.links.faqs'), routerPath: '/faqs' },
    ],
  },
]
