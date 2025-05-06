import Link from "next/link";

export default function Footer() {
  return (
    <div className="tw:bg-[#F7F7F7] font-primary tw:text-gray-800 tw:py-8 ">
      <div className="tw:max-w-8xl tw:px-16 tw:mx-auto">
        <img src="/assets/logo.png" alt="workerhomes" className="tw:w-[200px] tw:h-[41px] tw:mb-6" />
        <div className="tw:flex tw:flex-col tw:lg:flex-row tw:items-start tw:justify-between tw:gap-8">
          <div className="tw:lg:w-1/4 tw:w-full ">
            <p className="tw:mb-6 tw:w-[345px] tw:h-[72px] tw:text-[18px] tw:leading-[24px]  tw:text-[var(--color-font-dark)] tw:font-medium">
              WorkerHome connects property owners with renters, making apartment and house renting easy and hassle-free.
            </p>

            <div className="tw:space-y-3">
              <div>
                <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)]">Need live support?</h3>
                <a href="mailto:info@workerhomes.pl" className="tw:font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
                  info@workerhomes.pl
                </a>
              </div>
          
            </div>
          </div>

          <div className="tw:w-full tw:lg:w-[250px] tw:flex tw:gap-8">
            <div>
              <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">Company</h3>
              <ul className="tw:space-y-2 font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
                <li><Link href="#" className="tw:hover:underline">About</Link></li>
                <li><Link href="#" className="tw:hover:underline">Contact</Link></li>
                <li><Link href="#" className="tw:hover:underline">FAQs</Link></li>
              </ul>
            </div>
          </div>
     
            <div className="tw:w-full tw:lg:w-[250px] tw:gap-8">
            <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">Hosting</h3>
            <ul className="tw:space-y-2 font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
                <li><Link href="#" className="tw:hover:underline">List your property</Link></li>
                <li><Link href="#" className="tw:hover:underline">Hosting Resources</Link></li>
                <li><Link href="#" className="tw:hover:underline">Tips and Tricks/Advices/Guide</Link></li>
                <li><Link href="#" className="tw:hover:underline">You could earn</Link></li>
                <li><Link href="#" className="tw:hover:underline">Blog</Link></li>
              </ul>
            </div>
  
          
          <div className="tw:w-full tw:lg:w-[244px]">
            <h3 className="tw:font-semibold tw:text-[14px] tw:text-[var(--color-font-dark)] tw:mb-4">Follow us on social media</h3>
            <div className="tw:flex tw:gap-4 tw:text-2xl">
              <Link href="#" className="tw:hover:opacity-75">
                <img src="/assets/facebook.png" alt="Icon" className="w-6 h-6" />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img src="/assets/linkedin.png" alt="Icon" className="w-6 h-6" />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img src="/assets/twitter.png" alt="Icon" className="w-6 h-6" />
              </Link>
              <Link href="#" className="tw:hover:opacity-75">
                <img src="/assets/instagram.png" alt="Icon" className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="tw:border-t-2 tw:mt-8 tw:border-[var(--color-font-regular)] tw:pt-6">
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-4">
            <div className="tw:text-[var(--color-font-regular)] tw:text-[14px]">
              ©2025 By Workerhomes.pl. All Rights Reserved
            </div>
            <div className="tw:flex tw:gap-4 tw:flex-wrap tw:font-semibold tw:text-[16px] tw:text-[var(--color-font-dark)]">
              <Link href="#" className="tw:hover:underline">Privacy</Link>
              <Link href="#" className="tw:hover:underline">Terms & condition</Link>
              <Link href="#" className="tw:hover:underline">Sitemap</Link>
            </div>
            <div className="tw:mt-2 tw:md:mt-0 tw:text-[var(--color-font-regular)] tw:text-[16px]">
              <Link href="#" className="tw:hover:underline">Back to top</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}