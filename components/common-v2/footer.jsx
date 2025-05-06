import Link from "next/link";

export default function Footer() {
  return (
    <footer className="tw:bg-white tw:text-gray-800 tw:py-8 tw:px-4">
      <div className="tw:max-w-7xl tw:mx-auto">
        <div className="tw:flex  tw:flex-row tw:gap-8 tw:items-start">

          <div className="tw:w-1/3">
            <h1 className="tw:text-2xl tw:font-bold tw:mb-4">WorkerHomes</h1>
            <p className="tw:mb-6">
              WorkerHome connects property owners with renters, making apartment and house renting easy and hassle-free.
            </p>

            <div className="tw:space-y-3">
              <div>
                <h3 className="tw:font-semibold">Need live support?</h3>
                <a href="mailto:info@workerhomes.pl" className="">
                  info@workerhomes.pl
                </a>
              </div>
              <div>
                <h3 className="tw:font-semibold">Need live support?</h3>
                <a href="mailto:info@workerhomes.pl" className="">
                  info@workerhomes.pl
                </a>
              </div>
            </div>
          </div>

          <div className="lg:tw:w-1/3 tw:flex tw:gap-8">
            <div>
              <h3 className="tw:font-bold tw:text-lg tw:mb-4">Company</h3>
              <ul className="tw:space-y-2">
                <li><Link href="#" className="tw:hover:underline">About</Link></li>
                <li><Link href="#" className="hover:tw:underline">Contact</Link></li>
                <li><Link href="#" className="hover:tw:underline">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="tw:font-bold tw:text-lg tw:mb-4">Hosting</h3>
              <ul className="tw:space-y-2">
                <li><Link href="#" className="hover:tw:underline">List your property</Link></li>
                <li><Link href="#" className="hover:tw:underline">Hosting Resources</Link></li>
                <li><Link href="#" className="hover:tw:underline">Tips and Tricks/Advices/Guide</Link></li>
                <li><Link href="#" className="hover:tw:underline">You could earn</Link></li>
                <li><Link href="#" className="hover:tw:underline">Blog</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:tw:w-1/3">
            <h3 className="tw:font-bold tw:text-lg tw:mb-4">Follow us on social media</h3>
            <div className="tw:flex tw:gap-4 tw:text-2xl">
              <Link href="#" className="hover:tw:opacity-75">📞</Link>
              <Link href="#" className="hover:tw:opacity-75">🟐</Link>
              <Link href="#" className="hover:tw:opacity-75">🟐</Link>
              <Link href="#" className="hover:tw:opacity-75">🟐</Link>
              <Link href="#" className="hover:tw:opacity-75">🟐</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="tw:border-t tw:border-gray-200 tw:mt-8 tw:pt-6">
          <div className="tw:flex tw:flex-col md:tw:flex-row tw:justify-between tw:items-center">
            <div className="tw:mb-4 md:tw:mb-0">
              ©2025 By Workerhomes.pl. All Rights Reserved
            </div>
            <div className="tw:flex tw:flex-wrap tw:gap-4">
              <Link href="#" className="hover:tw:underline">Privacy</Link>
              <Link href="#" className="hover:tw:underline">Terms & condition</Link>
              <Link href="#" className="hover:tw:underline">Sitemap</Link>
              <Link href="#" className="hover:tw:underline">Back to top</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}