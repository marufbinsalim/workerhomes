'use client'

import { useTranslations } from 'next-intl'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const TermsConent = () => {
  const t = useTranslations('terms')
  return (
    <Tabs>
      <div className='row y-gap-30'>
        <div className='col-lg-12'>
          <h1 className='text-30 fw-600 mb-15'>{t('title')}</h1>
          <h5 className='text-20 fw-600 mb-15'>{t('date')}</h5>
          <p className='text-15 text-dark-1 mt-5'>{t('description.main')}</p>
        </div>
        <div className='col-lg-4'>
          <div className='px-30 py-30 rounded-4 border-light'>
            <TabList className='tabs__controls row y-gap-10 js-tabs-controls'>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.1')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.2')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.3')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.4')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.5')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.6')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.7')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.8')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.9')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.10')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.11')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.12')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.13')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.14')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.15')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.16')}
              </Tab>
              <Tab className='col-12 tabs__button js-tabs-button text-truncate'>
                {t('sidebar.17')}
              </Tab>
            </TabList>
          </div>
        </div>
        {/* End .col-lg-3 */}

        <div className='col-lg-8'>
          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.1')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.1')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.2')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.2')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.3')}</h1>
              <ul>
                <li>
                  <strong>{t('description.3.list.1.title')}</strong>{' '}
                  {t('description.3.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.3.list.2.title')}</strong>{' '}
                  {t('description.3.list.2.description')}
                </li>
                <li>
                  <strong>{t('description.3.list.3.title')}</strong>{' '}
                  {t('description.3.list.3.description')}
                </li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.4')}</h1>
              <ul>
                <li>
                  <strong>{t('description.4.list.1.title')}</strong>{' '}
                  {t('description.4.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.4.list.2.title')}</strong>{' '}
                  {t('description.4.list.2.description')}
                </li>
                <li>
                  <strong>{t('description.4.list.3.title')}</strong>{' '}
                  {t('description.4.list.3.description')}
                </li>
                <li>
                  <strong>{t('description.4.list.4.title')}</strong>{' '}
                  {t('description.4.list.4.description')}
                </li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.5')}</h1>
              <ul>
                <li>
                  <strong>{t('description.5.list.1.title')}</strong>{' '}
                  {t('description.5.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.5.list.2.title')}</strong>{' '}
                  {t('description.5.list.2.description')}
                </li>

                <li>
                  <strong>{t('description.5.list.3.title')}</strong>{' '}
                  {t('description.5.list.3.description')}
                </li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.6')}</h1>
              <ul>
                <li>
                  <strong>{t('description.6.list.1.title')}</strong>{' '}
                  {t('description.6.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.6.list.2.title')}</strong>{' '}
                  {t('description.6.list.2.description')}
                </li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.7')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.7')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.8')}</h1>
              <p className='text-15 text-dark-1 mt-5'>
                {t('description.8.text')}
              </p>

              <ul>
                <li>
                  <strong>{t('description.8.list.1.title')}</strong>{' '}
                  {t('description.8.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.8.list.2.title')}</strong>{' '}
                  {t('description.8.list.2.description')}
                </li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.9')}</h1>
              <ul>
                <li>
                  <strong>{t('description.9.list.1.title')}</strong>{' '}
                  {t('description.9.list.1.description')}
                </li>
                <li>
                  <strong>{t('description.9.list.2.title')}</strong>{' '}
                  {t('description.9.list.2.description')}
                </li>
                <li>
                  <strong>{t('description.9.list.3.title')}</strong>{' '}
                  {t('description.9.list.3.description')}
                </li>
                <li>
                  <strong>{t('description.9.list.4.title')}</strong>
                </li>
              </ul>

              <ul className='ml-30'>
                <li>* {t('description.9.list.4.list.1')}</li>
                <li>* {t('description.9.list.4.list.2')}</li>
                <li>* {t('description.9.list.4.list.3')}</li>
                <li>* {t('description.9.list.4.list.4')}</li>
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.10')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.10')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.11')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.11')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.12')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.12')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.13')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.13')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.14')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.14')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.15')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.15')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.16')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.16')}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className='tabs__content js-tabs-content' data-aos='fade'>
              <h1 className='text-30 fw-600 mb-15'>{t('sidebar.17')}</h1>
              <p className='text-15 text-dark-1 mt-5'>{t('description.17')}</p>
            </div>
          </TabPanel>
        </div>
        {/* End col-lg-9 */}
      </div>
    </Tabs>
  )
}

export default TermsConent
